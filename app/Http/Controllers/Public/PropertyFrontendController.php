<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PropertyFrontendController extends Controller
{
    /**
     * Display the welcome page with this week's featured properties.
     */
    public function home(Request $request): Response
    {
        $weekStart = Carbon::now()->subDays(7);

        $featuredProperties = $this->availableProperties(Property::query())
            ->where('created_at', '>=', $weekStart)
            ->latest()
            ->take(6)
            ->get()
            ->map(fn (Property $property) => $this->transformProperty($property));

        return Inertia::render('welcome', [
            'featuredProperties' => $featuredProperties,
        ]);
    }

    /**
     * Display a paginated list of available properties.
     */
    public function availableListings(Request $request): Response
    {
        $activeType = $request->string('type')->trim()->value();
        $location = $request->string('location')->trim()->value();
        $budgetKey = $request->string('monthly_budget')->trim()->value();
        $moveInKey = $request->string('move_in')->trim()->value();

        $budgetRanges = $this->budgetRanges();
        $selectedBudget = $budgetKey !== '' && isset($budgetRanges[$budgetKey])
            ? $budgetRanges[$budgetKey]
            : null;

        $moveInWindows = $this->moveInWindows();
        $selectedMoveIn = $moveInKey !== '' && isset($moveInWindows[$moveInKey])
            ? $moveInWindows[$moveInKey]
            : null;

        $propertiesQuery = $this->availableProperties(Property::query());

        if ($activeType) {
            $propertiesQuery->where('type', $activeType);
        }

        if ($location) {
            $propertiesQuery->where(function (Builder $builder) use ($location): void {
                $builder
                    ->where('location', 'like', "%{$location}%")
                    ->orWhere('city', 'like', "%{$location}%")
                    ->orWhere('barangay', 'like', "%{$location}%");
            });
        }

        if ($selectedBudget) {
            if (isset($selectedBudget['min'])) {
                $propertiesQuery->where('monthly_rent', '>=', $selectedBudget['min']);
            }

            if (array_key_exists('max', $selectedBudget) && $selectedBudget['max'] !== null) {
                $propertiesQuery->where('monthly_rent', '<=', $selectedBudget['max']);
            }
        }

        if ($selectedMoveIn && (isset($selectedMoveIn['min_days']) || isset($selectedMoveIn['max_days']))) {
            $now = Carbon::now()->startOfDay();

            $propertiesQuery->whereNotNull('availability_date');

            if (isset($selectedMoveIn['min_days'])) {
                $minDate = (clone $now)->addDays((int) $selectedMoveIn['min_days']);
                $propertiesQuery->whereDate('availability_date', '>=', $minDate->toDateString());
            }

            if (isset($selectedMoveIn['max_days'])) {
                $maxDate = (clone $now)->addDays((int) $selectedMoveIn['max_days']);
                $propertiesQuery->whereDate('availability_date', '<=', $maxDate->toDateString());
            }
        }

        $properties = $propertiesQuery
            ->latest()
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Property $property) => $this->transformProperty($property));

        return Inertia::render('available-listings', [
            'properties' => $properties,
            'filters' => $this->filters(),
            'activeType' => $activeType ?: 'All',
            'searchCriteria' => [
                'location' => $location !== '' ? $location : null,
                'budget' => $selectedBudget['label'] ?? null,
                'move_in' => $selectedMoveIn['label'] ?? null,
                'type' => $activeType ?: null,
            ],
        ]);
    }

    /**
     * Handle a public availability request and redirect with applied filters.
     */
    public function requestAvailability(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'location' => ['nullable', 'string', 'max:255'],
            'property_type' => ['nullable', 'string', 'max:255'],
            'monthly_budget' => ['nullable', 'string', Rule::in(array_keys($this->budgetRanges()))],
            'move_in' => ['nullable', 'string', Rule::in(array_keys($this->moveInWindows()))],
        ]);

        $query = array_filter([
            'location' => $validated['location'] ?? null,
            'type' => $validated['property_type'] ?? null,
            'monthly_budget' => $validated['monthly_budget'] ?? null,
            'move_in' => $validated['move_in'] ?? null,
        ], fn ($value) => $value !== null && $value !== '');

        return redirect()->route('available-listings', $query);
    }

    /**
     * Display the map tracker with all available properties.
     */
    public function mapTracker(): Response
    {
        $properties = $this->availableProperties(Property::query())
            ->latest()
            ->get()
            ->map(fn (Property $property) => $this->transformProperty($property));

        return Inertia::render('map-tracker', [
            'properties' => $properties,
        ]);
    }

    /**
     * Display a tenant-focused property detail page.
     */
    public function show(Request $request, Property $property): Response
    {
        abort_unless(optional($request->user())->role === 'tenant', 403);

        $property->load([
            'user:id,first_name,last_name,name,email,role',
            'reservations' => function ($query): void {
                $this->activeReservations($query);
            },
        ]);

        return Inertia::render('properties/reserve', [
            'property' => $this->transformProperty($property),
        ]);
    }

    /**
     * Prepare the filters used on the public listings.
     *
     * @return list<string>
     */
    protected function filters(): array
    {
        return ['All', 'Apartment', 'Condo', 'Loft', 'Residence', 'Townhome', 'Penthouse'];
    }

    /**
     * Provide the budget ranges available for public availability requests.
     *
     * @return array<string, array{label: string, min: int, max?: int|null}>
     */
    protected function budgetRanges(): array
    {
        return [
            '500-1000' => ['label' => '₱500 – ₱1,000', 'min' => 500, 'max' => 1000],
            '1000-1500' => ['label' => '₱1,000 – ₱1,500', 'min' => 1000, 'max' => 1500],
            '1500-2000' => ['label' => '₱1,500 – ₱2,000', 'min' => 1500, 'max' => 2000],
            '2000-2500' => ['label' => '₱2,000 – ₱2,500', 'min' => 2000, 'max' => 2500],
            '2500-3000' => ['label' => '₱2,500 – ₱3,000', 'min' => 2500, 'max' => 3000],
            '3000-4000' => ['label' => '₱3,000 – ₱4,000', 'min' => 3000, 'max' => 4000],
            '4000+' => ['label' => '₱4,000+', 'min' => 4000, 'max' => null],
        ];
    }

    /**
     * Provide the supported move-in windows for availability requests.
     *
     * @return array<string, array{label: string, min_days?: int, max_days?: int}>
     */
    protected function moveInWindows(): array
    {
        return [
            'within_30_days' => ['label' => 'Within 30 days', 'min_days' => 0, 'max_days' => 30],
            '60_90_days' => ['label' => '60 - 90 days', 'min_days' => 60, 'max_days' => 90],
            '3_6_months' => ['label' => '3 - 6 months', 'min_days' => 90, 'max_days' => 180],
            'exploring' => ['label' => 'Exploring options'],
        ];
    }

    /**
     * Transform a property for the public-facing frontend.
     *
     * @return array<string, mixed>
     */
    protected function transformProperty(Property $property): array
    {
        $amenities = collect(preg_split('/\r\n|\r|\n/', (string) $property->amenities))
            ->map(fn (string $value) => trim($value))
            ->filter()
            ->values();

        $activeReservation = $property->relationLoaded('reservations')
            ? $property->reservations->first()
            : null;

        return [
            'id' => $property->id,
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
            'amenities' => $amenities,
            'description' => $property->description,
            'hero_image' => $property->hero_image,
            'availability_photo_url' => $property->availability_photo_path
                ? Storage::disk('public')->url($property->availability_photo_path)
                : null,
            'pet_policy' => $property->pet_policy,
            'notes' => $property->notes,
            'created_at' => optional($property->created_at)->toDateTimeString(),
            'updated_at' => optional($property->updated_at)->toDateTimeString(),
            'owner' => $property->relationLoaded('user') && $property->user
                ? [
                    'name' => $property->user->name,
                    'email' => $property->user->email,
                    'role' => $property->user->role,
                ]
                : null,
            'active_reservation' => $activeReservation ? [
                'id' => $activeReservation->id,
                'status' => $activeReservation->status,
                'reservation_type' => $activeReservation->reservation_type,
                'reference' => $activeReservation->reference,
                'starts_at' => optional($activeReservation->starts_at)->toIso8601String(),
                'ends_at' => optional($activeReservation->ends_at)->toIso8601String(),
            ] : null,
        ];
    }

    /**
     * Apply availability constraints to the property query.
     */
    protected function availableProperties(Builder $query): Builder
    {
        return $query->whereDoesntHave('reservations', function (Builder $reservationQuery): void {
            $this->activeReservations($reservationQuery);
        });
    }

    /**
     * Constrain a reservation query to active reservations.
     */
    protected function activeReservations(Builder|Relation $query): void
    {
        $now = Carbon::now();

        $query
            ->whereIn('status', ['pending', 'active'])
            ->where('starts_at', '<=', $now)
            ->where(function (Builder $builder) use ($now): void {
                $builder
                    ->whereNull('ends_at')
                    ->orWhere('ends_at', '>', $now);
            })
            ->orderByDesc('starts_at');
    }
}
