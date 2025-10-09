<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = Str::lower((string) optional($user)->role);

        abort_unless(in_array($role, ['admin', 'owner'], true), 403);

        $confirmationCutoff = Carbon::now()->subHour();

        $reservations = Reservation::query()
            ->with([
                'tenant:id,first_name,last_name,name,email,mobile_number,property_name,unit_number,lease_start,lease_end,monthly_rent,tenant_status,concierge_name',
                'property:id,name,location,street_address,city,barangay,monthly_rent',
                'owner:id,first_name,last_name,name,email',
            ])
            ->where('status', 'active')
            ->where(function ($query) use ($confirmationCutoff) {
                $query
                    ->whereNull('tenant_confirmed_at')
                    ->orWhere('tenant_confirmed_at', '>', $confirmationCutoff);
            })
            ->when($role === 'owner', fn ($query) => $query->where('owner_id', optional($user)->id))
            ->orderBy('starts_at')
            ->get()
            ->map(function (Reservation $reservation) {
                $tenant = $reservation->tenant;
                $owner = $reservation->owner;
                $property = $reservation->property;

                return [
                    'id' => $reservation->id,
                    'status' => $reservation->status,
                    'type' => $reservation->reservation_type,
                    'starts_at' => optional($reservation->starts_at)?->toIso8601String(),
                    'ends_at' => optional($reservation->ends_at)?->toIso8601String(),
                    'reference' => $reservation->reference,
                    'tenant' => $tenant ? [
                        'id' => $tenant->id,
                        'name' => $tenant->name ?: trim(sprintf('%s %s', $tenant->first_name, $tenant->last_name)),
                        'email' => $tenant->email,
                        'mobile_number' => $tenant->mobile_number,
                        'property_name' => $tenant->property_name,
                        'unit_number' => $tenant->unit_number,
                        'lease_start' => optional($tenant->lease_start)?->toDateString(),
                        'lease_end' => optional($tenant->lease_end)?->toDateString(),
                        'monthly_rent' => $tenant->monthly_rent !== null ? (float) $tenant->monthly_rent : null,
                        'tenant_status' => $tenant->tenant_status,
                        'concierge_name' => $tenant->concierge_name,
                        'address' => collect([
                            $tenant->property_name,
                            optional($property)->street_address,
                            optional($property)->barangay,
                            optional($property)->city,
                            optional($property)->location,
                        ])->filter()->unique()->implode(', '),
                    ] : null,
                    'owner' => $owner ? [
                        'id' => $owner->id,
                        'name' => $owner->name ?: trim(sprintf('%s %s', $owner->first_name, $owner->last_name)),
                        'email' => $owner->email,
                    ] : null,
                    'property' => $property ? [
                        'id' => $property->id,
                        'name' => $property->name,
                        'location' => collect([
                            $property->street_address,
                            $property->barangay,
                            $property->city,
                            $property->location,
                        ])->filter()->unique()->implode(', '),
                        'street_address' => $property->street_address,
                        'barangay' => $property->barangay,
                        'city' => $property->city,
                        'monthly_rent' => $property->monthly_rent !== null ? (float) $property->monthly_rent : null,
                    ] : null,
                ];
            });

        return Inertia::render('reservations', [
            'reservations' => $reservations,
        ]);
    }

    public function confirmTenant(Request $request, Reservation $reservation): RedirectResponse
    {
        $user = $request->user();
        $role = Str::lower((string) optional($user)->role);

        abort_unless(in_array($role, ['admin', 'owner'], true), 403);

        if ($role === 'owner') {
            abort_unless($reservation->owner_id === optional($user)->id, 403);
        }

        $tenant = $reservation->tenant;

        abort_if($tenant === null, 404);

        $validated = $request->validate([
            'property_name' => ['required', 'string', 'max:255'],
            'monthly_rent' => ['nullable', 'numeric', 'min:0'],
            'tenant_status' => ['required', 'string', 'max:255', Rule::in(['Current', 'Expiring Soon', 'Overdue', 'Notice Given', 'Pending'])],
            'lease_start' => ['nullable', 'date'],
            'lease_end' => ['nullable', 'date', 'after_or_equal:lease_start'],
            'concierge_name' => ['nullable', 'string', 'max:255'],
        ]);

        $tenant->update([
            'property_name' => $validated['property_name'],
            'monthly_rent' => $validated['monthly_rent'] ?? null,
            'tenant_status' => $validated['tenant_status'],
            'lease_start' => $validated['lease_start'] ?? null,
            'lease_end' => $validated['lease_end'] ?? null,
            'concierge_name' => $validated['concierge_name'] ?? null,
        ]);

        $reservation->update([
            'tenant_confirmed_at' => Carbon::now(),
        ]);

        return back()->with('success', 'Tenant details confirmed successfully.');
    }

    /**
     * Store a newly created reservation in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        abort_unless(optional($user)->role === 'tenant', 403);

        $validated = $request->validate([
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'reservation_type' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'reference' => ['nullable', 'string', 'size:10'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ]);

        /** @var Property $property */
        $property = Property::query()
            ->with('user:id')
            ->findOrFail($validated['property_id']);

        $ownerId = optional($property->user)->id;

        if (!$ownerId) {
            throw ValidationException::withMessages([
                'reservation' => 'This property is missing owner details and cannot be reserved right now.',
            ]);
        }

        $now = Carbon::now();

        $activeReservation = $property
            ->reservations()
            ->whereIn('status', ['pending', 'active'])
            ->where('starts_at', '<=', $now)
            ->where(function ($query) use ($now) {
                $query
                    ->whereNull('ends_at')
                    ->orWhere('ends_at', '>', $now);
            })
            ->orderByDesc('starts_at')
            ->first();

        if ($activeReservation) {
            $message = 'This property is currently reserved.';

            if ($activeReservation->ends_at) {
                $message .= ' It will be available again after '
                    .$activeReservation->ends_at->copy()->setTimezone($now->getTimezone())->toDayDateTimeString()
                    .'.';
            }

            throw ValidationException::withMessages([
                'reservation' => $message,
            ]);
        }

        $startsAt = isset($validated['starts_at'])
            ? Carbon::parse($validated['starts_at'])
            : $now->copy();

        if ($startsAt->lessThan($now)) {
            $startsAt = $now->copy();
        }

        $endsAt = $startsAt->copy()->addDay();

        $reference = $validated['reference'] ?? null;

        if (!is_string($reference) || trim($reference) === '') {
            $reference = Str::upper(Str::random(10));
        } else {
            $reference = Str::upper($reference);
        }

        $reservation = $property->reservations()->create([
            'tenant_id' => optional($user)->id,
            'property_id' => $property->id,
            'owner_id' => $ownerId,
            'status' => 'active',
            'reservation_type' => $validated['reservation_type'],
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'reference' => $reference,
            'amount' => $property->monthly_rent,
            'notes' => $validated['notes'] ?: null,
        ]);

        return redirect()
            ->route('tenant.properties.show', $property)
            ->with('success', sprintf('Reservation confirmed. Reference: %s', $reservation->reference));
    }
}
