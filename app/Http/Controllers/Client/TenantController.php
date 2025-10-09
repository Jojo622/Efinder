<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Display a listing of the tenants.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        abort_unless($user !== null, 403);

        $role = Str::lower((string) $user->role);
        abort_unless(in_array($role, ['admin', 'owner'], true), 403);

        $tenantQuery = User::query()
            ->whereRaw('LOWER(role) = ?', ['tenant']);

        if ($role === 'owner') {
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

        $metrics = [
            'activeTenants' => (clone $tenantQuery)->count(),
            'expiringSoon' => (clone $tenantQuery)->where('tenant_status', 'Expiring Soon')->count(),
            'overdueBalance' => (clone $tenantQuery)->sum('balance_due'),
            'uniqueProperties' => (clone $tenantQuery)
                ->whereNotNull('property_name')
                ->select('property_name')
                ->distinct()
                ->count(),
        ];

        $tenants = (clone $tenantQuery)
            ->orderByRaw('COALESCE(lease_end, lease_start) IS NULL')
            ->orderBy('lease_end')
            ->orderBy('lease_start')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $tenant): array => $this->transformTenant($tenant));

        return Inertia::render('tenants/index', [
            'tenants' => $tenants,
            'metrics' => [
                'activeTenants' => $metrics['activeTenants'],
                'expiringSoon' => $metrics['expiringSoon'],
                'overdueBalance' => (float) $metrics['overdueBalance'],
                'uniqueProperties' => $metrics['uniqueProperties'],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified tenant.
     */
    public function edit(User $tenant): Response
    {
        $this->ensureAdminAccess();
        $this->ensureTenant($tenant);

        return Inertia::render('tenants/edit', [
            'tenant' => $this->transformTenant($tenant),
        ]);
    }

    /**
     * Update the specified tenant in storage.
     */
    public function update(Request $request, User $tenant): RedirectResponse
    {
        $this->ensureAdminAccess();
        $this->ensureTenant($tenant);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($tenant->id),
            ],
            'mobile_number' => ['nullable', 'string', 'max:255'],
            'property_name' => ['nullable', 'string', 'max:255'],
            'unit_number' => ['nullable', 'string', 'max:255'],
            'lease_start' => ['nullable', 'date'],
            'lease_end' => ['nullable', 'date', 'after_or_equal:lease_start'],
            'monthly_rent' => ['nullable', 'numeric', 'min:0'],
            'balance_due' => ['nullable', 'numeric', 'min:0'],
            'tenant_status' => ['nullable', 'string', 'max:255'],
            'concierge_name' => ['nullable', 'string', 'max:255'],
        ]);

        $tenant->update($validated + [
            'name' => trim($validated['first_name'].' '.$validated['last_name']),
        ]);

        return to_route('tenants.edit', $tenant)->with('success', 'Tenant details updated successfully.');
    }

    /**
     * Remove the specified tenant from storage.
     */
    public function destroy(User $tenant): RedirectResponse
    {
        $this->ensureAdminAccess();
        $this->ensureTenant($tenant);

        $tenant->delete();

        return to_route('tenants.index')->with('success', 'Tenant removed successfully.');
    }

    /**
     * Ensure the given user is a tenant.
     */
    protected function ensureTenant(User $tenant): void
    {
        abort_unless(strtolower((string) $tenant->role) === 'tenant', 404);
    }

    /**
     * Restrict tenant management to administrators.
     */
    protected function ensureAdminAccess(): void
    {
        $role = Str::lower((string) optional(Auth::user())->role);

        abort_unless($role === 'admin', 403);
    }

    /**
     * Normalise the tenant data for Inertia responses.
     */
    protected function transformTenant(User $tenant): array
    {
        return [
            'id' => $tenant->id,
            'first_name' => $tenant->first_name,
            'last_name' => $tenant->last_name,
            'name' => $tenant->name,
            'email' => $tenant->email,
            'mobile_number' => $tenant->mobile_number,
            'property_name' => $tenant->property_name,
            'unit_number' => $tenant->unit_number,
            'lease_start' => optional($tenant->lease_start)->toDateString(),
            'lease_end' => optional($tenant->lease_end)->toDateString(),
            'monthly_rent' => $tenant->monthly_rent !== null ? (float) $tenant->monthly_rent : null,
            'balance_due' => $tenant->balance_due !== null ? (float) $tenant->balance_due : null,
            'tenant_status' => $tenant->tenant_status,
            'concierge_name' => $tenant->concierge_name,
        ];
    }
}
