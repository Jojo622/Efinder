<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets available to the authenticated user.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = Str::lower((string) optional($user)->role);

        abort_unless($user !== null && in_array($role, ['tenant', 'admin'], true), 403);

        $ticketsQuery = Ticket::query()->latest();

        if ($role === 'tenant') {
            $ticketsQuery->where('user_id', $user->id);
        }

        $tickets = $ticketsQuery
            ->get()
            ->map(fn (Ticket $ticket): array => $this->transformTicket($ticket));

        return Inertia::render('ticket-concerns', [
            'tickets' => $tickets,
            'canManageTickets' => $role === 'admin',
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new ticket.
     */
    public function create(Request $request): Response
    {
        $this->ensureTenant($request);

        $user = $request->user();

        return Inertia::render('ticket-concerns/create', [
            'defaults' => [
                'property_name' => $user?->property_name,
                'unit_number' => $user?->unit_number,
                'contact_number' => $user?->mobile_number,
            ],
        ]);
    }

    /**
     * Store a newly created ticket in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->ensureTenant($request);

        $validated = $request->validate([
            'property_name' => ['required', 'string', 'max:255'],
            'unit_number' => ['nullable', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255', Rule::in(['Maintenance', 'Housekeeping', 'Billing', 'Amenities', 'Concierge'])],
            'priority' => ['required', 'string', Rule::in(['low', 'normal', 'high', 'urgent'])],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'preferred_visit_date' => ['nullable', 'date', 'after_or_equal:today'],
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        Ticket::create([
            ...$validated,
            'status' => 'open',
            'user_id' => $user->id,
        ]);

        return to_route('ticket.concerns')->with('success', 'Your ticket has been submitted successfully.');
    }

    /**
     * Update the specified ticket's status.
     */
    public function update(Request $request, Ticket $ticket): RedirectResponse
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in($this->statusOptions())],
        ]);

        $ticket->forceFill([
            'status' => $validated['status'],
            'resolved_at' => in_array($validated['status'], ['resolved', 'closed', 'completed'], true)
                ? now()
                : null,
        ])->save();

        return back()->with('success', 'Ticket status updated successfully.');
    }

    /**
     * Ensure the current user is an authenticated tenant.
     */
    protected function ensureTenant(Request $request): void
    {
        $role = Str::lower((string) optional($request->user())->role);

        abort_unless($request->user() !== null && $role === 'tenant', 403);
    }

    /**
     * Ensure the current user is an authenticated administrator.
     */
    protected function ensureAdmin(Request $request): void
    {
        $role = Str::lower((string) optional($request->user())->role);

        abort_unless($request->user() !== null && $role === 'admin', 403);
    }

    /**
     * Prepare a ticket for Inertia responses.
     */
    protected function transformTicket(Ticket $ticket): array
    {
        return [
            'id' => $ticket->id,
            'property_name' => $ticket->property_name,
            'unit_number' => $ticket->unit_number,
            'category' => $ticket->category,
            'priority' => $ticket->priority,
            'subject' => $ticket->subject,
            'description' => $ticket->description,
            'contact_number' => $ticket->contact_number,
            'preferred_visit_date' => optional($ticket->preferred_visit_date)->toDateString(),
            'status' => $ticket->status,
            'created_at' => optional($ticket->created_at)->toIso8601String(),
        ];
    }

    /**
     * Available status options for tickets.
     *
     * @return list<string>
     */
    protected function statusOptions(): array
    {
        return [
            'open',
            'acknowledged',
            'in_progress',
            'awaiting_tenant',
            'resolved',
            'closed',
            'completed',
        ];
    }
}
