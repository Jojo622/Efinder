import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ElementType } from 'react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Building2,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    Home,
    LineChart,
    PieChart,
    Sparkles,
    Users2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type Trend = 'up' | 'down' | 'neutral';

const iconMap: Record<string, ElementType> = {
    building: Building2,
    home: Home,
    users: Users2,
    calendar: CalendarClock,
    'credit-card': CreditCard,
    sparkles: Sparkles,
    'check-circle': CheckCircle2,
    'line-chart': LineChart,
    'pie-chart': PieChart,
};

interface AdminStatCard {
    title: string;
    value: string;
    change?: string | null;
    change_label?: string | null;
    trend?: Trend;
    icon?: keyof typeof iconMap;
}

interface PipelineHighlight {
    label: string;
    value: string;
    helper?: string | null;
    accent?: string | null;
    trend?: Trend;
    icon?: keyof typeof iconMap;
}

interface OccupancyInsight {
    name: string;
    occupancy: number;
    available: number;
}

interface RevenueMetric {
    label: string;
    value: string;
    helper?: string | null;
    trend?: Trend;
}

interface RenewalItem {
    name: string;
    unit?: string | null;
    date?: string | null;
    status?: string | null;
}

interface TeamFocusItem {
    title: string;
    description: string;
    due: string;
}

type DashboardPageProps = SharedData & {
    statCards?: AdminStatCard[];
    pipelineHighlights?: PipelineHighlight[];
    occupancyBreakdown?: OccupancyInsight[];
    revenueMetrics?: RevenueMetric[];
    upcomingRenewals?: RenewalItem[];
    teamFocus?: TeamFocusItem[];
};

function resolveIcon(name?: keyof typeof iconMap) {
    if (!name) {
        return PieChart;
    }

    return iconMap[name] ?? PieChart;
}

function formatDate(value?: string | null) {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export default function Dashboard() {
    const {
        statCards = [],
        pipelineHighlights = [],
        occupancyBreakdown = [],
        revenueMetrics = [],
        upcomingRenewals = [],
        teamFocus = [],
    } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.6)] backdrop-blur">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -right-24 -top-24 h-72 w-72 stroke-sky-200/40" />
                    <div className="relative z-10 flex flex-col gap-8">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                                    <LineChart className="h-4 w-4" /> Portfolio pulse
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Welcome back, here is your portfolio heartbeat</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Monitor availability, concierge workload, and revenue pace across the estate. All metrics refresh automatically from your Laravel data.
                                </p>
                            </div>
                            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl">
                                <Sparkles className="h-4 w-4" /> Add new listing
                            </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {pipelineHighlights.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">
                                    Live pipeline metrics will appear here once tenant activity is recorded.
                                </div>
                            )}
                            {pipelineHighlights.map((highlight) => {
                                const Icon = resolveIcon(highlight.icon);
                                const isPositive = highlight.trend === 'up';
                                const isNegative = highlight.trend === 'down';
                                const TrendIcon = isNegative ? ArrowDownRight : ArrowUpRight;

                                return (
                                    <div
                                        key={highlight.label}
                                        className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-2 hover:border-sky-200"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                    {highlight.label}
                                                </p>
                                                <p className="mt-3 text-2xl font-semibold text-slate-900">{highlight.value}</p>
                                                {highlight.helper && (
                                                    <p className="text-sm text-slate-600">{highlight.helper}</p>
                                                )}
                                            </div>
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>

                                        {highlight.accent && (
                                            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                                                {(isPositive || isNegative) && (
                                                    <span
                                                        className={cn(
                                                            'flex items-center gap-1 rounded-full px-2 py-1',
                                                            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
                                                        )}
                                                    >
                                                        <TrendIcon className="h-3 w-3" />
                                                        {highlight.accent}
                                                    </span>
                                                )}
                                                {highlight.trend === 'neutral' && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-500">{highlight.accent}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500 md:col-span-2 xl:col-span-4">
                            No dashboard statistics yet. Once properties, tenants, or invoices are created their summaries will populate here automatically.
                        </div>
                    )}
                    {statCards.map((card) => {
                        const Icon = resolveIcon(card.icon);
                        const isPositive = card.trend === 'up';
                        const isNegative = card.trend === 'down';
                        const TrendIcon = isNegative ? ArrowDownRight : ArrowUpRight;

                        return (
                            <div
                                key={card.title}
                                className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.6)]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    {(isPositive || isNegative) && <TrendIcon className={cn('h-5 w-5', isPositive ? 'text-emerald-500' : 'text-rose-500')} />}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{card.title}</p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                                    {card.change && (
                                        <p className="text-sm text-slate-500">
                                            <span
                                                className={cn(
                                                    'font-medium',
                                                    card.trend === 'up'
                                                        ? 'text-emerald-600'
                                                        : card.trend === 'down'
                                                          ? 'text-rose-600'
                                                          : 'text-slate-600',
                                                )}
                                            >
                                                {card.change}
                                            </span>{' '}
                                            {card.change_label}
                                        </p>
                                    )}
                                    {!card.change && card.change_label && (
                                        <p className="text-sm text-slate-500">{card.change_label}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
                    <div className="space-y-6">
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.65)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-transparent" />
                            <PlaceholderPattern className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 stroke-sky-200/40" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Occupancy health</p>
                                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Portfolio overview</h2>
                                    </div>
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                </div>
                                {occupancyBreakdown.length === 0 ? (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500">
                                        Occupancy insights will display when reservations are recorded for your properties.
                                    </p>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {occupancyBreakdown.map((insight) => (
                                            <div key={insight.name} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 text-sm text-slate-600">
                                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{insight.name}</p>
                                                <p className="mt-2 text-2xl font-semibold text-slate-900">{insight.occupancy}% occupied</p>
                                                <p>Available slots: {insight.available}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Revenue focus</h2>
                                <CreditCard className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {revenueMetrics.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500 md:col-span-3">
                                        Revenue metrics become available once invoices are issued.
                                    </div>
                                )}
                                {revenueMetrics.map((metric) => (
                                    <div key={metric.label} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
                                        <p className="mt-3 text-xl font-semibold text-slate-900">{metric.value}</p>
                                        {metric.helper && <p className="text-sm text-slate-600">{metric.helper}</p>}
                                        <span
                                            className={cn(
                                                'mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                                                metric.trend === 'up'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : metric.trend === 'down'
                                                      ? 'bg-rose-50 text-rose-600'
                                                      : 'bg-slate-100 text-slate-500',
                                            )}
                                        >
                                            {metric.trend === 'up'
                                                ? 'Healthy'
                                                : metric.trend === 'down'
                                                  ? 'Attention'
                                                  : 'Stable'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Upcoming renewals</h2>
                                <CalendarClock className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-4 space-y-4">
                                {upcomingRenewals.length === 0 && (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500">
                                        No lease renewals scheduled in the next 60 days.
                                    </p>
                                )}
                                {upcomingRenewals.map((renewal) => (
                                    <div key={`${renewal.name}-${renewal.unit ?? 'unit'}`} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
                                        <p className="text-sm font-semibold text-slate-900">{renewal.name}</p>
                                        {renewal.unit && <p className="text-xs text-slate-500">{renewal.unit}</p>}
                                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                            <span>{formatDate(renewal.date)}</span>
                                            <span className="font-semibold uppercase tracking-[0.3em]">{renewal.status ?? 'Pending'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Team focus</h2>
                                <CheckCircle2 className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-4 space-y-4">
                                {teamFocus.length === 0 && (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500">
                                        Concierge action items will appear here as soon as operational data is captured.
                                    </p>
                                )}
                                {teamFocus.map((item) => (
                                    <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-white/95 p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{item.due}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
