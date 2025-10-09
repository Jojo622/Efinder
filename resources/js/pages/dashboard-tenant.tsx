import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ElementType } from 'react';
import {
    CalendarDays,
    CreditCard,
    Home,
    Inbox,
    MessageCircle,
    Receipt,
    ShieldCheck,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

const iconMap: Record<string, ElementType> = {
    home: Home,
    'credit-card': CreditCard,
    'calendar-days': CalendarDays,
    inbox: Inbox,
    'message-circle': MessageCircle,
    receipt: Receipt,
    'shield-check': ShieldCheck,
};

interface HeaderSummary {
    renewalMessage?: string | null;
    conciergeName?: string | null;
}

interface PrimaryCard {
    label: string;
    value: string;
    helper?: string | null;
}

interface BillingCard {
    title: string;
    value: string;
    helper?: string | null;
    icon?: keyof typeof iconMap;
}

interface HospitalityMoment {
    title: string;
    detail: string;
}

interface SupportShortcut {
    label: string;
    description: string;
    icon?: keyof typeof iconMap;
}

type TenantDashboardProps = SharedData & {
    headerSummary?: HeaderSummary;
    primaryCards?: PrimaryCard[];
    billingOverview?: BillingCard[];
    hospitalityUpdates?: HospitalityMoment[];
    supportShortcuts?: SupportShortcut[];
};

function resolveIcon(name?: keyof typeof iconMap) {
    if (!name) {
        return Home;
    }

    return iconMap[name] ?? Home;
}

export default function TenantDashboard() {
    const {
        headerSummary = {},
        primaryCards = [],
        billingOverview = [],
        hospitalityUpdates = [],
        supportShortcuts = [],
    } = usePage<TenantDashboardProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenant Dashboard" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -left-24 bottom-10 h-72 w-72 stroke-emerald-200/50" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                    <Home className="h-4 w-4" /> Your residence
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Good day! Here is everything prepared for your stay</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Monitor your lease, stay current with concierge billing, and access lifestyle services curated for your home. Information is sourced directly from your tenant records.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200/70 bg-white/80 px-6 py-4 text-sm text-slate-600 shadow-lg">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Lease summary</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{headerSummary.renewalMessage ?? 'No lease end date on file'}</p>
                                <p>Concierge lead: {headerSummary.conciergeName ?? 'Not assigned'}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {primaryCards.length === 0 && (
                                <div className="md:col-span-3 rounded-2xl border border-dashed border-emerald-200 bg-white/90 p-4 text-sm text-slate-500">
                                    Billing, ticket, and guest information will appear here once records are added to your account.
                                </div>
                            )}
                            {primaryCards.map((card) => (
                                <div key={card.label} className="rounded-2xl border border-emerald-200/70 bg-white/90 p-5 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">{card.label}</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                                    {card.helper && <p className="text-sm text-slate-600">{card.helper}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Billing overview</h2>
                                <CreditCard className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {billingOverview.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500 md:col-span-3">
                                        Billing cards will populate once invoices or concierge visits are recorded.
                                    </div>
                                )}
                                {billingOverview.map((card) => {
                                    const Icon = resolveIcon(card.icon);
                                    return (
                                        <div key={card.title} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{card.title}</p>
                                                    <p className="mt-3 text-xl font-semibold text-slate-900">{card.value}</p>
                                                    {card.helper && <p className="text-sm text-slate-600">{card.helper}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Hospitality updates</h2>
                                <Inbox className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="mt-6 space-y-4">
                                {hospitalityUpdates.length === 0 && (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-4 text-sm text-slate-500">
                                        Concierge reservations or lifestyle appointments will appear here when scheduled.
                                    </p>
                                )}
                                {hospitalityUpdates.map((moment) => (
                                    <div key={moment.title} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
                                        <p className="text-sm font-semibold text-slate-900">{moment.title}</p>
                                        <p className="text-sm text-slate-600">{moment.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                <CalendarDays className="h-4 w-4 text-slate-400" /> Concierge quick links
                            </h2>
                            <div className="mt-4 space-y-3">
                                {supportShortcuts.length === 0 && (
                                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white/90 p-3 text-sm text-slate-500">
                                        Need help fast? Concierge tools will display here when services are configured for your account.
                                    </p>
                                )}
                                {supportShortcuts.map((shortcut) => {
                                    const Icon = resolveIcon(shortcut.icon);
                                    return (
                                        <div key={shortcut.label} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{shortcut.label}</p>
                                                    <p className="text-xs text-slate-600">{shortcut.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
