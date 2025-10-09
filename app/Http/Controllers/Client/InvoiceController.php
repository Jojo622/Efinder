<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the invoices.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $invoices = Invoice::query()
            ->with([
                'tenant:id,first_name,last_name,name,email,property_name,unit_number',
                'owner:id,first_name,last_name,name,email',
                'property:id,name,street_address,city,barangay,user_id',
            ])
            ->when(
                Str::lower((string) $user->role) === 'owner',
                fn ($query) => $query->where('owner_id', $user->id)
            )
            ->when(
                Str::lower((string) $user->role) === 'tenant',
                fn ($query) => $query->where('tenant_id', $user->id)
            )
            ->latest('issue_date')
            ->latest('id')
            ->get()
            ->map(fn (Invoice $invoice) => $this->transformInvoice($invoice))
            ->values();

        return Inertia::render('payments-invoices', [
            'invoices' => $invoices,
            'canCreate' => in_array(Str::lower((string) $user->role), ['admin', 'owner'], true),
        ]);
    }

    /**
     * Show the form for creating a new invoice.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        abort_if(Str::lower((string) $user->role) === 'tenant', 403);

        $owners = User::query()
            ->whereRaw('LOWER(role) = ?', ['owner'])
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $owner) => [
                'id' => $owner->id,
                'name' => $owner->name,
            ])
            ->values();

        $tenantQuery = User::query()
            ->whereRaw('LOWER(role) = ?', ['tenant']);

        if (Str::lower((string) $user->role) === 'owner') {
            $propertyNames = $user->properties()
                ->pluck('name')
                ->filter()
                ->values();

            if ($propertyNames->isEmpty()) {
                $tenantQuery->whereRaw('0 = 1');
            } else {
                $tenantQuery->whereIn('property_name', $propertyNames->all());
            }
        }

        $tenants = $tenantQuery
            ->orderBy('name')
            ->get(['id', 'name', 'property_name', 'unit_number'])
            ->map(fn (User $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'property_name' => $tenant->property_name,
                'unit_number' => $tenant->unit_number,
            ])
            ->values();

        $ownerId = Str::lower((string) $user->role) === 'owner'
            ? $user->id
            : $request->integer('owner_id');

        $properties = Property::query()
            ->when($ownerId, fn ($query, $id) => $query->where('user_id', $id))
            ->orderBy('name')
            ->get(['id', 'user_id', 'name', 'street_address', 'city', 'barangay'])
            ->map(fn (Property $property) => [
                'id' => $property->id,
                'owner_id' => $property->user_id,
                'name' => $property->name,
                'location' => implode(', ', array_filter([
                    $property->street_address,
                    $property->barangay,
                    $property->city,
                ], fn ($segment) => filled($segment))),
            ])
            ->values();

        $today = now();

        return Inertia::render('invoices/create', [
            'formOptions' => [
                'owners' => $owners,
                'tenants' => $tenants,
                'properties' => $properties,
                'statuses' => $this->statuses(),
            ],
            'canSelectOwner' => Str::lower((string) $user->role) === 'admin',
            'defaults' => [
                'owner_id' => Str::lower((string) $user->role) === 'owner' ? $user->id : null,
                'invoice_number' => $this->generateInvoiceNumber(),
                'issue_date' => $today->toDateString(),
                'due_date' => $today->copy()->addDays(7)->toDateString(),
                'billing_period_start' => $today->startOfMonth()->toDateString(),
                'billing_period_end' => $today->endOfMonth()->toDateString(),
                'status' => 'Pending',
            ],
        ]);
    }

    /**
     * Store a newly created invoice in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_if(Str::lower((string) $user->role) === 'tenant', 403);

        if (Str::lower((string) $user->role) === 'owner') {
            $request->merge(['owner_id' => $user->id]);
        }

        $ownerId = $request->integer('owner_id');

        $validated = $request->validate([
            'owner_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->whereRaw('LOWER(role) = ?', ['owner'])),
            ],
            'tenant_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(fn ($query) => $query->whereRaw('LOWER(role) = ?', ['tenant'])),
            ],
            'property_id' => [
                'required',
                'integer',
                Rule::exists('properties', 'id')->where(function ($query) use ($ownerId): void {
                    if ($ownerId) {
                        $query->where('user_id', $ownerId);
                    }
                }),
            ],
            'invoice_number' => ['required', 'string', 'max:255', Rule::unique('invoices', 'invoice_number')],
            'issue_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:issue_date'],
            'billing_period_start' => ['nullable', 'date'],
            'billing_period_end' => ['nullable', 'date', 'after_or_equal:billing_period_start'],
            'status' => ['required', 'string', Rule::in($this->statuses())],
            'rent_amount' => ['required', 'numeric', 'min:0'],
            'utilities_amount' => ['nullable', 'numeric', 'min:0'],
            'additional_fees' => ['nullable', 'numeric', 'min:0'],
            'late_fee' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $rent = (float) $validated['rent_amount'];
        $utilities = (float) ($validated['utilities_amount'] ?? 0);
        $additional = (float) ($validated['additional_fees'] ?? 0);
        $late = (float) ($validated['late_fee'] ?? 0);
        $tax = (float) ($validated['tax_amount'] ?? 0);
        $paid = (float) ($validated['amount_paid'] ?? 0);

        $subtotal = $rent + $utilities + $additional + $late;
        $total = $subtotal + $tax;
        $balance = $total - $paid;

        $invoice = Invoice::create([
            ...$validated,
            'rent_amount' => $rent,
            'utilities_amount' => $utilities,
            'additional_fees' => $additional,
            'late_fee' => $late,
            'tax_amount' => $tax,
            'amount_paid' => $paid,
            'subtotal' => $subtotal,
            'total' => $total,
            'balance_due' => $balance,
        ]);

        return to_route('invoices.show', $invoice)->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice): Response
    {
        $invoice->loadMissing([
            'tenant:id,first_name,last_name,name,email,property_name,unit_number',
            'owner:id,first_name,last_name,name,email',
            'property:id,name,street_address,city,barangay,user_id',
        ]);

        $this->authorizeInvoiceAccess($invoice);

        return Inertia::render('invoices/show', [
            'invoice' => $this->transformInvoice($invoice),
        ]);
    }

    /**
     * Ensure the authenticated user can view the invoice.
     */
    protected function authorizeInvoiceAccess(Invoice $invoice): void
    {
        $user = request()->user();

        if ($user === null) {
            abort(403);
        }

        $role = Str::lower((string) $user->role);

        if ($role === 'admin') {
            return;
        }

        if ($role === 'owner' && $invoice->owner_id === $user->id) {
            return;
        }

        if ($role === 'tenant' && $invoice->tenant_id === $user->id) {
            return;
        }

        abort(403);
    }

    /**
     * Normalise the invoice data for Inertia responses.
     */
    protected function transformInvoice(Invoice $invoice): array
    {
        return [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'status' => $invoice->status,
            'issue_date' => optional($invoice->issue_date)->toDateString(),
            'due_date' => optional($invoice->due_date)->toDateString(),
            'billing_period_start' => optional($invoice->billing_period_start)->toDateString(),
            'billing_period_end' => optional($invoice->billing_period_end)->toDateString(),
            'rent_amount' => (float) $invoice->rent_amount,
            'utilities_amount' => (float) $invoice->utilities_amount,
            'additional_fees' => (float) $invoice->additional_fees,
            'late_fee' => (float) $invoice->late_fee,
            'subtotal' => (float) $invoice->subtotal,
            'tax_amount' => (float) $invoice->tax_amount,
            'total' => (float) $invoice->total,
            'amount_paid' => (float) $invoice->amount_paid,
            'balance_due' => (float) $invoice->balance_due,
            'notes' => $invoice->notes,
            'tenant' => $invoice->tenant?->only([
                'id',
                'name',
                'email',
                'property_name',
                'unit_number',
            ]),
            'owner' => $invoice->owner?->only([
                'id',
                'name',
                'email',
            ]),
            'property' => $invoice->property
                ? [
                    'id' => $invoice->property->id,
                    'name' => $invoice->property->name,
                    'street_address' => $invoice->property->street_address,
                    'city' => $invoice->property->city,
                    'barangay' => $invoice->property->barangay,
                ]
                : null,
        ];
    }

    /**
     * Get the available invoice statuses.
     *
     * @return list<string>
     */
    protected function statuses(): array
    {
        return [
            'Draft',
            'Pending',
            'Partially Paid',
            'Paid',
            'Overdue',
            'Cancelled',
        ];
    }

    /**
     * Generate a friendly invoice number.
     */
    protected function generateInvoiceNumber(): string
    {
        return sprintf('INV-%s-%s', now()->format('Ymd'), Str::upper(Str::random(4)));
    }
}
