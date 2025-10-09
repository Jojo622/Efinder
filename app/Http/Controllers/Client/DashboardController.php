<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Property;
use App\Models\Reservation;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $role = Str::lower((string) optional($user)->role);

        return match ($role) {
            'owner' => $this->ownerDashboard($user),
            'tenant' => $this->tenantDashboard($user),
            default => $this->adminDashboard(),
        };
    }

    protected function adminDashboard(): Response
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfLastMonth = $startOfMonth->copy()->subMonth();
        $endOfLastMonth = $startOfMonth->copy()->subDay();

        $sevenDaysAgo = $now->copy()->subDays(7);
        $fourteenDaysAgo = $now->copy()->subDays(14);
        $nextSevenDaysEnd = $now->copy()->addDays(7)->endOfDay();
        $previousSevenDaysStart = $fourteenDaysAgo->copy()->startOfDay();
        $previousSevenDaysEnd = $sevenDaysAgo->copy()->endOfDay();

        $propertiesThisMonth = Property::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $propertiesLastMonth = Property::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $tenantsThisMonth = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();
        $tenantsLastMonth = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $reservationsNextWeek = Reservation::whereBetween('starts_at', [$now->copy()->startOfDay(), $nextSevenDaysEnd])->count();
        $reservationsPreviousWeek = Reservation::whereBetween('starts_at', [$previousSevenDaysStart, $previousSevenDaysEnd])->count();

        $revenueThisMonth = (float) Invoice::whereBetween('issue_date', [$startOfMonth, $endOfMonth])->sum('total');
        $revenueLastMonth = (float) Invoice::whereBetween('issue_date', [$startOfLastMonth, $endOfLastMonth])->sum('total');

        $newTenantsSevenDays = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereBetween('created_at', [$sevenDaysAgo, $now])
            ->count();
        $newTenantsPreviousSevenDays = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereBetween('created_at', [$previousSevenDaysStart, $previousSevenDaysEnd])
            ->count();

        $ticketsSevenDays = Ticket::whereBetween('created_at', [$sevenDaysAgo, $now])->count();
        $ticketsPreviousSevenDays = Ticket::whereBetween('created_at', [$previousSevenDaysStart, $previousSevenDaysEnd])->count();

        $reservationsSevenDays = Reservation::whereBetween('starts_at', [$now->copy()->startOfDay(), $nextSevenDaysEnd])->count();
        $reservationsPreviousSevenDays = Reservation::whereBetween('starts_at', [$previousSevenDaysStart, $previousSevenDaysEnd])->count();

        $propertyInsights = Property::query()
            ->withCount([
                'reservations as total_reservations_count',
                'reservations as active_reservations_count' => function ($query): void {
                    $query->whereIn('status', ['pending', 'active']);
                },
            ])
            ->orderByDesc('active_reservations_count')
            ->take(3)
            ->get()
            ->map(function (Property $property): array {
                $total = (int) $property->total_reservations_count;
                $active = (int) $property->active_reservations_count;
                $occupancy = $total > 0 ? (int) round(($active / $total) * 100) : 0;

                return [
                    'name' => $property->name,
                    'occupancy' => $occupancy,
                    'available' => max($total - $active, 0),
                ];
            })
            ->values()
            ->all();

        $upcomingRenewals = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereBetween('lease_end', [$now->copy()->startOfDay(), $now->copy()->addDays(60)->endOfDay()])
            ->orderBy('lease_end')
            ->take(5)
            ->get()
            ->map(function (User $tenant): array {
                return [
                    'name' => $tenant->name,
                    'unit' => trim((string) $tenant->property_name . ($tenant->unit_number ? ' · ' . $tenant->unit_number : '')),
                    'date' => optional($tenant->lease_end)->toDateString(),
                    'status' => $tenant->tenant_status ?: 'Pending review',
                ];
            })
            ->values()
            ->all();

        $openTickets = Ticket::where(function ($query): void {
            $query
                ->whereNull('status')
                ->orWhereNotIn('status', ['resolved', 'closed', 'completed']);
        })->count();

        $overdueInvoices = Invoice::where('balance_due', '>', 0)
            ->where('due_date', '<', $now->copy()->startOfDay())
            ->count();

        $teamFocus = [
            [
                'title' => 'Review outstanding tickets',
                'description' => sprintf('%s unresolved requests awaiting action', number_format($openTickets)),
                'due' => 'Prioritize today',
            ],
            [
                'title' => 'Confirm upcoming reservations',
                'description' => sprintf('%s scheduled within 7 days', number_format($reservationsNextWeek)),
                'due' => 'Due this week',
            ],
            [
                'title' => 'Follow up on overdue invoices',
                'description' => sprintf('%s tenant accounts need attention', number_format($overdueInvoices)),
                'due' => 'Before month end',
            ],
        ];

        return Inertia::render('dashboard', [
            'statCards' => [
                [
                    'title' => 'New properties',
                    'value' => number_format($propertiesThisMonth),
                    'change' => $this->formatAbsoluteChange($propertiesThisMonth, $propertiesLastMonth),
                    'change_label' => 'vs last month',
                    'trend' => $this->resolveTrend($propertiesThisMonth, $propertiesLastMonth),
                    'icon' => 'building',
                ],
                [
                    'title' => 'New tenants',
                    'value' => number_format($tenantsThisMonth),
                    'change' => $this->formatAbsoluteChange($tenantsThisMonth, $tenantsLastMonth),
                    'change_label' => 'vs last month',
                    'trend' => $this->resolveTrend($tenantsThisMonth, $tenantsLastMonth),
                    'icon' => 'users',
                ],
                [
                    'title' => 'Upcoming reservations',
                    'value' => number_format($reservationsNextWeek),
                    'change' => $this->formatAbsoluteChange($reservationsNextWeek, $reservationsPreviousWeek),
                    'change_label' => 'vs prior week',
                    'trend' => $this->resolveTrend($reservationsNextWeek, $reservationsPreviousWeek),
                    'icon' => 'calendar',
                ],
                [
                    'title' => 'Monthly revenue',
                    'value' => $this->formatCurrency($revenueThisMonth),
                    'change' => $this->formatPercentageChange($revenueThisMonth, $revenueLastMonth),
                    'change_label' => 'vs last month',
                    'trend' => $this->resolveTrend($revenueThisMonth, $revenueLastMonth),
                    'icon' => 'credit-card',
                ],
            ],
            'pipelineHighlights' => [
                [
                    'label' => 'Tenants onboarded',
                    'value' => number_format($newTenantsSevenDays),
                    'helper' => 'in the last 7 days',
                    'accent' => $this->formatAbsoluteChange($newTenantsSevenDays, $newTenantsPreviousSevenDays),
                    'trend' => $this->resolveTrend($newTenantsSevenDays, $newTenantsPreviousSevenDays),
                    'icon' => 'sparkles',
                ],
                [
                    'label' => 'Tickets opened',
                    'value' => number_format($ticketsSevenDays),
                    'helper' => 'concierge requests logged',
                    'accent' => $this->formatAbsoluteChange($ticketsSevenDays, $ticketsPreviousSevenDays),
                    'trend' => $this->resolveTrend($ticketsSevenDays, $ticketsPreviousSevenDays),
                    'icon' => 'check-circle',
                ],
                [
                    'label' => 'Reservations scheduled',
                    'value' => number_format($reservationsSevenDays),
                    'helper' => 'planned for next 7 days',
                    'accent' => $this->formatAbsoluteChange($reservationsSevenDays, $reservationsPreviousSevenDays),
                    'trend' => $this->resolveTrend($reservationsSevenDays, $reservationsPreviousSevenDays),
                    'icon' => 'calendar',
                ],
            ],
            'occupancyBreakdown' => $propertyInsights,
            'revenueMetrics' => [
                [
                    'label' => 'Collected',
                    'value' => $this->formatCurrency(Invoice::sum('amount_paid')),
                    'helper' => 'Across all tenants',
                    'trend' => 'up',
                ],
                [
                    'label' => 'Outstanding',
                    'value' => $this->formatCurrency(Invoice::sum('balance_due')),
                    'helper' => 'Balance awaiting payment',
                    'trend' => 'down',
                ],
                [
                    'label' => 'Projected',
                    'value' => $this->formatCurrency(
                        Invoice::where('due_date', '>=', $now->copy()->startOfDay())->sum('total')
                    ),
                    'helper' => 'Upcoming billing',
                    'trend' => 'up',
                ],
            ],
            'upcomingRenewals' => $upcomingRenewals,
            'teamFocus' => $teamFocus,
        ]);
    }

    protected function ownerDashboard(?User $user): Response
    {
        $owner = $user;
        abort_unless($owner !== null && Str::lower((string) $owner->role) === 'owner', 403);

        $now = Carbon::now();
        $properties = $owner->properties()->withCount([
            'reservations as active_reservations_count' => function ($query): void {
                $query->whereIn('status', ['pending', 'active']);
            },
        ])->get();

        $propertyNames = $properties->pluck('name')->filter();

        $totalReservations = Reservation::where('owner_id', $owner->id)->count();
        $activeReservations = Reservation::where('owner_id', $owner->id)
            ->whereIn('status', ['pending', 'active'])
            ->count();
        $occupancyRate = $totalReservations > 0 ? ($activeReservations / $totalReservations) * 100 : 0.0;

        $collectedThisMonth = (float) Invoice::where('owner_id', $owner->id)
            ->whereBetween('issue_date', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
            ->sum('amount_paid');
        $projectedNextQuarter = (float) Invoice::where('owner_id', $owner->id)
            ->whereBetween('due_date', [$now->copy()->startOfDay(), $now->copy()->addDays(90)->endOfDay()])
            ->sum('total');
        $outstandingBalance = (float) Invoice::where('owner_id', $owner->id)->sum('balance_due');

        $upcomingMilestones = Reservation::where('owner_id', $owner->id)
            ->where('starts_at', '>=', $now->copy()->startOfDay())
            ->orderBy('starts_at')
            ->take(3)
            ->get()
            ->map(function (Reservation $reservation): array {
                return [
                    'label' => ucfirst($reservation->reservation_type ?: 'Reservation'),
                    'tenant' => optional($reservation->tenant)->name ?? 'Unassigned tenant',
                    'date' => optional($reservation->starts_at)->toDateString(),
                ];
            })
            ->values()
            ->all();

        $earliestLeaseEnd = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereIn('property_name', $propertyNames)
            ->whereNotNull('lease_end')
            ->orderBy('lease_end')
            ->first();

        $notes = collect([
            $properties->isNotEmpty()
                ? sprintf('Managing %s premium residences with concierge support.', number_format($properties->count()))
                : 'No properties are currently assigned to your account.',
            $earliestLeaseEnd
                ? sprintf('Next lease maturity: %s (%s).', optional($earliestLeaseEnd->lease_end)->toFormattedDateString(), $earliestLeaseEnd->name)
                : 'No upcoming lease expirations recorded.',
        ])->all();

        $averageStayLength = $this->averageStayLengthForProperties($propertyNames);

        return Inertia::render('dashboard-owner', [
            'portfolioStats' => [
                [
                    'label' => 'Active properties',
                    'value' => number_format($properties->count()),
                    'helper' => sprintf('%s residences with concierge services', number_format($properties->sum('active_reservations_count'))),
                    'icon' => 'building',
                ],
                [
                    'label' => 'Occupancy rate',
                    'value' => number_format($occupancyRate, 1) . '%',
                    'helper' => sprintf('%s reservations active', number_format($activeReservations)),
                    'icon' => 'home',
                ],
            ],
            'revenueSnapshots' => [
                [
                    'title' => 'Collected this month',
                    'amount' => $this->formatCurrency($collectedThisMonth),
                    'trend' => $collectedThisMonth > 0 ? '+ recent receipts' : 'No collections yet',
                ],
                [
                    'title' => 'Projected next 90 days',
                    'amount' => $this->formatCurrency($projectedNextQuarter),
                    'trend' => 'Based on approved invoices',
                ],
                [
                    'title' => 'Outstanding balance',
                    'amount' => $this->formatCurrency($outstandingBalance),
                    'trend' => 'Concierge follow up required',
                ],
            ],
            'upcomingMilestones' => $upcomingMilestones,
            'ownerNotes' => $notes,
            'summary' => [
                'quarterCollections' => $this->formatCurrency(
                    (float) Invoice::where('owner_id', $owner->id)
                        ->whereBetween('issue_date', [$now->copy()->subMonths(3)->startOfMonth(), $now->copy()->endOfMonth()])
                        ->sum('amount_paid')
                ),
                'averageStayLength' => $averageStayLength,
            ],
        ]);
    }

    protected function tenantDashboard(?User $user): Response
    {
        $tenant = $user;
        abort_unless($tenant !== null && Str::lower((string) $tenant->role) === 'tenant', 403);

        $now = Carbon::now();

        $tenantInvoices = Invoice::where('tenant_id', $tenant->id);
        $currentBalance = (float) Invoice::where('tenant_id', $tenant->id)->sum('balance_due');
        $activeInvoices = Invoice::where('tenant_id', $tenant->id)->where('balance_due', '>', 0)->count();
        $nextDueInvoice = Invoice::where('tenant_id', $tenant->id)
            ->whereNotNull('due_date')
            ->where('due_date', '>=', $now->copy()->startOfDay())
            ->orderBy('due_date')
            ->first();

        $lastPayment = Invoice::where('tenant_id', $tenant->id)
            ->where('amount_paid', '>', 0)
            ->orderByDesc('updated_at')
            ->first();

        $openTickets = $tenant->tickets()
            ->where(function ($query): void {
                $query
                    ->whereNull('status')
                    ->orWhereNotIn('status', ['resolved', 'closed', 'completed']);
            })
            ->count();

        $upcomingReservations = Reservation::where('tenant_id', $tenant->id)
            ->where('starts_at', '>=', $now->copy()->startOfDay())
            ->orderBy('starts_at')
            ->take(3)
            ->get();

        $hospitalityUpdates = $upcomingReservations
            ->map(function (Reservation $reservation): array {
                return [
                    'title' => ucfirst($reservation->reservation_type ?: 'Reservation'),
                    'detail' => optional($reservation->starts_at)->toDayDateTimeString(),
                ];
            })
            ->values()
            ->all();

        $renewalWindowDays = $tenant->lease_end ? $now->diffInDays($tenant->lease_end, false) : null;

        return Inertia::render('dashboard-tenant', [
            'headerSummary' => [
                'renewalMessage' => $renewalWindowDays !== null
                    ? ($renewalWindowDays > 0
                        ? sprintf('Renewal window opens in %s days', number_format($renewalWindowDays))
                        : 'Lease renewal window is open')
                    : 'No lease end date on file',
                'conciergeName' => $tenant->concierge_name,
            ],
            'primaryCards' => [
                [
                    'label' => 'Current balance',
                    'value' => $this->formatCurrency($currentBalance),
                    'helper' => $nextDueInvoice && $nextDueInvoice->due_date
                        ? sprintf('Due on %s', optional($nextDueInvoice->due_date)->toFormattedDateString())
                        : 'No upcoming invoices',
                ],
                [
                    'label' => 'Active invoices',
                    'value' => number_format($activeInvoices),
                    'helper' => 'With outstanding balance',
                ],
                [
                    'label' => 'Open tickets',
                    'value' => number_format($openTickets),
                    'helper' => 'Awaiting concierge response',
                ],
            ],
            'billingOverview' => [
                [
                    'title' => 'Last payment',
                    'value' => $lastPayment && $lastPayment->amount_paid
                        ? $this->formatCurrency((float) $lastPayment->amount_paid)
                        : '₱0',
                    'helper' => $lastPayment && $lastPayment->updated_at
                        ? sprintf('Posted %s', optional($lastPayment->updated_at)->toFormattedDateString())
                        : 'No payments recorded',
                    'icon' => 'credit-card',
                ],
                [
                    'title' => 'Next concierge visit',
                    'value' => $upcomingReservations->first()
                        ? optional($upcomingReservations->first()->starts_at)->toFormattedDateString()
                        : 'No visits scheduled',
                    'helper' => $upcomingReservations->first()
                        ? ucfirst($upcomingReservations->first()->reservation_type ?: 'Reservation')
                        : 'Check back soon',
                    'icon' => 'calendar-days',
                ],
                [
                    'title' => 'Statements',
                    'value' => $tenantInvoices->count() > 0 ? 'Paperless' : 'Not enrolled',
                    'helper' => 'Receipts delivered to your inbox',
                    'icon' => 'receipt',
                ],
            ],
            'hospitalityUpdates' => $hospitalityUpdates,
            'supportShortcuts' => [
                [
                    'label' => 'Message concierge',
                    'description' => sprintf('Reach %s for personalized assistance.', $tenant->concierge_name ?: 'your concierge team'),
                    'icon' => 'message-circle',
                ],
                [
                    'label' => 'Submit maintenance',
                    'description' => sprintf('%s active ticket(s) in progress.', number_format($openTickets)),
                    'icon' => 'shield-check',
                ],
                [
                    'label' => 'View payment history',
                    'description' => sprintf('%s invoices on record.', number_format($tenantInvoices->count())),
                    'icon' => 'receipt',
                ],
            ],
        ]);
    }

    private function formatCurrency(float $amount): string
    {
        return '₱' . number_format($amount, 0);
    }

    private function formatAbsoluteChange(float|int $current, float|int $previous, int $precision = 0): ?string
    {
        $difference = $current - $previous;

        if ($previous == 0 && $current == 0) {
            return '0';
        }

        if (abs($difference) < 0.0001) {
            return '0';
        }

        $formatted = number_format(abs($difference), $precision);

        return $difference > 0 ? '+' . $formatted : '−' . $formatted;
    }

    private function formatPercentageChange(float $current, float $previous): ?string
    {
        if (abs($previous) < 0.0001) {
            return null;
        }

        $difference = (($current - $previous) / $previous) * 100;

        if (abs($difference) < 0.0001) {
            return '0%';
        }

        $formatted = number_format(abs($difference), 1) . '%';

        return $difference > 0 ? '+' . $formatted : '−' . $formatted;
    }

    private function resolveTrend(float|int $current, float|int $previous): string
    {
        if ($current > $previous) {
            return 'up';
        }

        if ($current < $previous) {
            return 'down';
        }

        return 'neutral';
    }

    private function averageStayLengthForProperties(Collection $propertyNames): string
    {
        if ($propertyNames->isEmpty()) {
            return 'No lease data';
        }

        $tenants = User::whereRaw('LOWER(role) = ?', ['tenant'])
            ->whereIn('property_name', $propertyNames)
            ->whereNotNull('lease_start')
            ->whereNotNull('lease_end')
            ->get();

        if ($tenants->isEmpty()) {
            return 'No lease data';
        }

        $averageDays = $tenants->map(function (User $tenant): int {
            return $tenant->lease_start && $tenant->lease_end
                ? $tenant->lease_start->diffInDays($tenant->lease_end)
                : 0;
        })->filter()->avg();

        if ($averageDays === null || $averageDays === 0.0) {
            return 'No lease data';
        }

        $months = $averageDays / 30.44;

        return number_format($months, 1) . ' months';
    }
}
