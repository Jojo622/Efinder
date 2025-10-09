import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ElementType } from 'react';
import {
    Building2,
    CalendarClock,
    FileText,
    Home,
    LineChart,
    PiggyBank,
    Users2,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

const iconMap: Record<string, ElementType> = {
    building: Building2,
    home: Home,
    users: Users2,
    'piggy-bank': PiggyBank,
    calendar: CalendarClock,
    'file-text': FileText,
};

interface OwnerPortfolioStat {
    label: string;
    value: string;
    helper?: string | null;
    icon?: keyof typeof iconMap;
}

interface RevenueSnapshot {
    title: string;
    amount: string;
    trend?: string | null;
}

interface Milestone {
    label: string;
    tenant: string;
    date?: string | null;
}

type OwnerDashboardProps = SharedData & {
    portfolioStats?: OwnerPortfolioStat[];
    revenueSnapshots?: RevenueSnapshot[];
    upcomingMilestones?: Milestone[];
    ownerNotes?: string[];
    summary?: {
        quarterCollections?: string;
        averageStayLength?: string;
    };
};

function resolveIcon(name?: keyof typeof iconMap) {
    if (!name) {
        return Building2;
    }

    return iconMap[name] ?? Building2;
}

export default function OwnerDashboard() {
    const {
        portfolioStats = [],
        revenueSnapshots = [],
        upcomingMilestones = [],
        ownerNotes = [],
        summary = {},
    } = usePage<OwnerDashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owner Dashboard" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/80 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -right-20 top-6 h-72 w-72 stroke-sky-200/40" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                                    <LineChart className="h-4 w-4" /> Portfolio intelligence
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Welcome back, here is your estate performance snapshot</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Track returns, monitor concierge activity, and stay ahead of renewals across your managed residences. Insights are populated directly from the Laravel backend.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-6 py-4 text-sm text-slate-600 shadow-lg">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">This quarter</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.quarterCollections ?? '₱0'} net collections</p>
                                <p>Average stay length: {summary.averageStayLength ?? 'No lease data'}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {portfolioStats.length === 0 && (
                                <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500">
                                    Portfolio statistics will appear once properties and reservations are linked to your account.
                                </div>
                            )}
                            {portfolioStats.map((stat) => {
                                const Icon = resolveIcon(stat.icon);

                                return (
                                    <div key={stat.label} className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                                        <Icon className="h-10 w-10 rounded-full bg-slate-900/5 p-2 text-slate-700" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                                            <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                                            {stat.helper && <p className="text-sm text-slate-600">{stat.helper}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Revenue focus</h2>
                                <PiggyBank className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {revenueSnapshots.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500 md:col-span-3">
                                        Revenue snapshots are generated when invoices are issued to your tenants.
                                    </div>
                                )}
                                {revenueSnapshots.map((item) => (
                                    <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{item.title}</p>
                                        <p className="mt-3 text-xl font-semibold text-slate-900">{item.amount}</p>
                                        {item.trend && <p className="text-sm text-slate-600">{item.trend}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Upcoming concierge milestones</h2>
                                <CalendarClock className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-6 space-y-4">
                                {upcomingMilestones.length === 0 && (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500">
                                        No concierge milestones scheduled yet. Once reservations are added they will display here.
                                    </p>
                                )}
                                {upcomingMilestones.map((milestone) => (
                                    <div key={`${milestone.label}-${milestone.tenant}`} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{milestone.label}</p>
                                            <p className="mt-2 text-sm font-semibold text-slate-900">{milestone.tenant}</p>
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">{milestone.date ?? 'To be scheduled'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                <FileText className="h-4 w-4 text-slate-400" /> Owner briefing
                            </h2>
                            <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                {ownerNotes.length === 0 && <li className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-3">Once concierge activity is recorded, briefing notes will appear here.</li>}
                                {ownerNotes.map((note, index) => (
                                    <li key={`${note}-${index}`} className="rounded-2xl border border-slate-200/70 bg-white/90 p-3">
                                        {note}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Concierge advisory</p>
                            <p className="mt-3">Schedule a quarterly strategy session with your concierge lead to review pricing optimisation and hospitality upgrades.</p>
                        </div>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
