<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OwnerController extends Controller
{
    /**
     * Display a listing of the owners.
     */
    public function index(): Response
    {
        $this->ensureAdminAccess();

        $owners = User::query()
            ->whereRaw('LOWER(role) = ?', ['owner'])
            ->withCount('properties')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $owner): array => $this->transformOwner($owner));

        return Inertia::render('owners/index', [
            'owners' => $owners,
        ]);
    }

    /**
     * Show the form for editing the specified owner.
     */
    public function edit(User $owner): Response
    {
        $this->ensureAdminAccess();
        $this->ensureOwner($owner);

        return Inertia::render('owners/edit', [
            'owner' => $this->transformOwner($owner),
        ]);
    }

    /**
     * Activate the specified owner account.
     */
    public function updateUser(User $owner): RedirectResponse
    {
        $this->ensureAdminAccess();
        $this->ensureOwner($owner);

        if (Str::lower((string) $owner->status) !== 'active') {
            $owner->forceFill([
                'status' => 'Active',
            ])->save();
        }

        return back()->with('success', 'Owner activated successfully.');
    }

    /**
     * Update the specified owner in storage.
     */
    public function update(Request $request, User $owner): RedirectResponse
    {
        $this->ensureAdminAccess();
        $this->ensureOwner($owner);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($owner->id),
            ],
            'mobile_number' => ['nullable', 'string', 'max:255'],
        ]);

        $owner->update($validated + [
            'name' => trim($validated['first_name'].' '.$validated['last_name']),
            'role' => 'owner',
        ]);

        return to_route('owners.edit', $owner)->with('success', 'Owner details updated successfully.');
    }

    /**
     * Remove the specified owner from storage.
     */
    public function destroy(User $owner): RedirectResponse
    {
        $this->ensureAdminAccess();
        $this->ensureOwner($owner);

        $owner->delete();

        return to_route('owners.index')->with('success', 'Owner removed successfully.');
    }

    /**
     * Ensure the given user is an owner.
     */
    protected function ensureOwner(User $owner): void
    {
        abort_unless(strtolower((string) $owner->role) === 'owner', 404);
    }

    /**
     * Restrict owner management to administrators.
     */
    protected function ensureAdminAccess(): void
    {
        $role = Str::lower((string) optional(Auth::user())->role);

        abort_unless($role === 'admin', 403);
    }

    /**
     * Normalise the owner data for Inertia responses.
     */
    protected function transformOwner(User $owner): array
    {
        return [
            'id' => $owner->id,
            'first_name' => $owner->first_name,
            'last_name' => $owner->last_name,
            'name' => $owner->name,
            'email' => $owner->email,
            'mobile_number' => $owner->mobile_number,
            'role' => $owner->role,
            'status' => $owner->status,
            'business_permit' => $owner->business_permit_path
                ? [
                    'url' => Storage::disk('public')->url($owner->business_permit_path),
                    'filename' => basename($owner->business_permit_path),
                ]
                : null,
            'properties_count' => (int) ($owner->properties_count ?? $owner->properties()->count()),
            'created_at' => optional($owner->created_at)->toDateTimeString(),
            'updated_at' => optional($owner->updated_at)->toDateTimeString(),
        ];
    }
}
