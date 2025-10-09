<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Display a listing of the properties.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $this->ensureUserCanAccessProperties($user);

        $role = Str::lower((string) $user->role);

        $properties = Property::query()
            ->when($role !== 'admin', function ($query) use ($user): void {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->with('user:id,first_name,last_name,name,email,role')
            ->get()
            ->map(fn (Property $property) => $this->transformProperty($property))
            ->values();

        return Inertia::render('property-portfolio', [
            'properties' => $properties,
            'filters' => $this->propertyTypes(),
        ]);
    }

    /**
     * Show the form for creating a new property.
     */
    public function create(): Response
    {
        $user = Auth::user();

        $this->ensureUserCanAccessProperties($user);
        $this->ensureOwnerCanAddProperty($user);

        return Inertia::render('properties/create', [
            'formOptions' => $this->formOptions(),
            'property' => null,
        ]);
    }

    /**
     * Store a newly created property in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $this->ensureUserCanAccessProperties($user);
        $this->ensureOwnerCanAddProperty($user);

        $validated = $this->validateProperty($request);

        if ($request->hasFile('availability_photo')) {
            $validated['availability_photo_path'] = $request->file('availability_photo')->store('properties', 'public');
        }

        $galleryImages = $this->processPropertyImages($request);

        $validated['gallery_images'] = $galleryImages === []
            ? null
            : implode(',', $galleryImages);

        $property = Property::create($validated + ['user_id' => $request->user()->id]);

        return to_route('properties.edit', $property)->with('success', 'Property created successfully.');
    }

    /**
     * Display the specified property.
     */
    public function show(Property $property): Response
    {
        $this->ensureUserCanAccessProperties(Auth::user());
        $this->authorizeAccess($property);

        return Inertia::render('properties/show', [
            'property' => $this->transformProperty($property->load('user:id,first_name,last_name,name,email,role')),
        ]);
    }

    /**
     * Show the form for editing the specified property.
     */
    public function edit(Property $property): Response
    {
        $this->ensureUserCanAccessProperties(Auth::user());
        $this->authorizeAccess($property);

        return Inertia::render('properties/edit', [
            'formOptions' => $this->formOptions(),
            'property' => $this->transformProperty($property),
        ]);
    }

    /**
     * Update the specified property in storage.
     */
    public function update(Request $request, Property $property): RedirectResponse
    {
        $this->ensureUserCanAccessProperties($request->user());
        $this->authorizeAccess($property);

        $validated = $this->validateProperty($request, $property);

        if ($request->hasFile('availability_photo')) {
            if ($property->availability_photo_path) {
                Storage::disk('public')->delete($property->availability_photo_path);
            }

            $validated['availability_photo_path'] = $request->file('availability_photo')->store('properties', 'public');
        }

        $galleryImages = $this->processPropertyImages($request, $property);

        $validated['gallery_images'] = $galleryImages === []
            ? null
            : implode(',', $galleryImages);

        $property->update($validated);

        return to_route('properties.edit', $property)->with('success', 'Property updated successfully.');
    }

    /**
     * Remove the specified property from storage.
     */
    public function destroy(Property $property): RedirectResponse
    {
        $this->ensureUserCanAccessProperties(Auth::user());
        $this->authorizeAccess($property);

        if ($property->availability_photo_path) {
            Storage::disk('public')->delete($property->availability_photo_path);
        }

        foreach ($this->splitGalleryImages($property->gallery_images) as $image) {
            Storage::disk('public')->delete($image);
        }

        $property->delete();

        return to_route('properties.index')->with('success', 'Property deleted successfully.');
    }

    /**
     * Validate the incoming property data.
     */
    protected function validateProperty(Request $request, ?Property $property = null): array
    {
        $request->merge([
            'latitude' => $request->filled('latitude') ? $request->input('latitude') : null,
            'longitude' => $request->filled('longitude') ? $request->input('longitude') : null,
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in($this->propertyTypes())],
            'status' => ['required', 'string', Rule::in($this->propertyStatuses())],
            'monthly_rent' => ['required', 'string', 'max:255'],
            'security_deposit' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'street_address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'bedrooms' => ['nullable', 'string', 'max:255'],
            'bathrooms' => ['nullable', 'string', 'max:255'],
            'square_footage' => ['nullable', 'string', 'max:255'],
            'parking_spaces' => ['nullable', 'string', 'max:255'],
            'availability_date' => ['nullable', 'date'],
            'lease_term' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],
            'amenities' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'pet_policy' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'availability_photo' => ['nullable', 'image', 'max:5120'],
            'property_images' => ['nullable', 'array'],
            'property_images.*' => ['nullable', 'image', 'max:5120'],
            'existing_images' => ['nullable', 'array'],
            'existing_images.*' => ['nullable', 'string', 'max:2048'],
        ]);

        $validated['monthly_rent'] = $this->sanitizeCurrency($validated['monthly_rent']);
        $validated['security_deposit'] = $this->sanitizeCurrency($validated['security_deposit'] ?? null);

        if ($request->missing('availability_date')) {
            $validated['availability_date'] = null;
        }

        return Arr::except($validated, ['availability_photo', 'property_images', 'existing_images']);
    }

    /**
     * Handle property gallery images for create and update flows.
     *
     * @return list<string>
     */
    protected function processPropertyImages(Request $request, ?Property $property = null): array
    {
        $originalImages = $property
            ? $this->splitGalleryImages($property->gallery_images)
            : [];

        $existingImages = collect($request->input('existing_images', []))
            ->filter(fn ($image): bool => is_string($image) && $image !== '')
            ->map(fn (string $image): string => trim($image))
            ->filter()
            ->values()
            ->all();

        if ($originalImages !== []) {
            $existingImages = array_values(array_intersect($existingImages, $originalImages));

            $deletedImages = array_diff($originalImages, $existingImages);

            foreach ($deletedImages as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $uploadedImages = [];

        foreach ($request->file('property_images', []) as $file) {
            if (! $file) {
                continue;
            }

            $uploadedImages[] = $file->store('properties', 'public');
        }

        return array_values(array_filter(array_merge($existingImages, $uploadedImages)));
    }

    /**
     * Convert a stored gallery string into an array of paths.
     *
     * @return list<string>
     */
    protected function splitGalleryImages(?string $images): array
    {
        if (! $images) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode(',', $images))));
    }

    /**
     * Ensure the authenticated user can interact with the property.
     */
    protected function authorizeAccess(Property $property): void
    {
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        $role = Str::lower((string) $user->role);

        if ($role === 'admin') {
            return;
        }

        abort_unless($role === 'owner' && $property->user_id === $user->id, 403);
    }

    /**
     * Strip non-numeric characters from currency inputs.
     */
    protected function sanitizeCurrency(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $numeric = preg_replace('/[^0-9.]/', '', $value);

        if ($numeric === '') {
            return null;
        }

        $amount = (float) $numeric;

        return number_format($amount, 2, '.', '');
    }

    /**
     * Shape the property data for Inertia.
     */
    protected function transformProperty(Property $property): array
    {
        return [
            'id' => $property->id,
            'user_id' => $property->user_id,
            'name' => $property->name,
            'type' => $property->type,
            'status' => $property->status,
            'monthly_rent' => $property->monthly_rent,
            'security_deposit' => $property->security_deposit,
            'location' => $property->location,
            'street_address' => $property->street_address,
            'city' => $property->city,
            'barangay' => $property->barangay,
            'latitude' => $property->latitude !== null ? (float) $property->latitude : null,
            'longitude' => $property->longitude !== null ? (float) $property->longitude : null,
            'bedrooms' => $property->bedrooms,
            'bathrooms' => $property->bathrooms,
            'square_footage' => $property->square_footage,
            'parking_spaces' => $property->parking_spaces,
            'availability_date' => optional($property->availability_date)->toDateString(),
            'lease_term' => $property->lease_term,
            'contact_name' => $property->contact_name,
            'contact_email' => $property->contact_email,
            'contact_phone' => $property->contact_phone,
            'amenities' => $property->amenities,
            'description' => $property->description,
            'hero_image' => $property->hero_image,
            'gallery_images' => $this->splitGalleryImages($property->gallery_images),
            'pet_policy' => $property->pet_policy,
            'notes' => $property->notes,
            'availability_photo_path' => $property->availability_photo_path,
            'created_at' => optional($property->created_at)->toDateTimeString(),
            'updated_at' => optional($property->updated_at)->toDateTimeString(),
            'user' => $property->relationLoaded('user') && $property->user
                ? [
                    'name' => $property->user->name,
                    'email' => $property->user->email,
                    'role' => $property->user->role,
                ]
                : null,
        ];
    }

    /**
     * Ensure the authenticated user has access to property management features.
     */
    protected function ensureUserCanAccessProperties(?User $user = null): void
    {
        $role = Str::lower((string) optional($user)->role);

        abort_unless(in_array($role, ['admin', 'owner'], true), 403);
    }

    /**
     * Ensure the owner account is active before adding properties.
     */
    protected function ensureOwnerCanAddProperty(?User $user = null): void
    {
        if (! $user) {
            abort(403);
        }

        if (Str::lower((string) $user->role) !== 'owner') {
            return;
        }

        if (Str::lower((string) $user->status) !== 'active') {
            abort(403, 'Your account must be active before you can add properties.');
        }
    }

    /**
     * Provide select options for the property form.
     */
    protected function formOptions(): array
    {
        return [
            'types' => $this->propertyTypes(),
            'statuses' => $this->propertyStatuses(),
        ];
    }

    protected function propertyTypes(): array
    {
        return ['Apartment', 'Condo', 'Loft', 'Residence', 'Townhome', 'Penthouse'];
    }

    protected function propertyStatuses(): array
    {
        return ['Now Leasing', 'Coming Soon', 'Fully Occupied', 'Under Renovation'];
    }

}
