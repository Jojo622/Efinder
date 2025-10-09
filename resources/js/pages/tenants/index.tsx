import TenantController from '@/actions/App/Http/Controllers/Client/TenantController';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useToast } from '@/components/ui/toast-provider';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Trash2, Users2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Tenants',
        href: '/tenants',
    },
];

const statusStyles: Record<string, string> = {
    Current: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Expiring Soon': 'bg-amber-50 text-amber-600 border-amber-200',
    Overdue: 'bg-rose-50 text-rose-600 border-rose-200',
    'Notice Given': 'bg-indigo-50 text-indigo-600 border-indigo-200',
};

interface TenantRecord {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    mobile_number: string | null;
    property_name: string | null;
    unit_number: string | null;
    lease_start: string | null;
    lease_end: string | null;
    monthly_rent: number | null;
    balance_due: number | null;
    tenant_status: string | null;
    concierge_name: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
}

interface PaginatedTenants {
    data: TenantRecord[];
    links: PaginationLink[];
    meta: PaginationMeta;
}

interface TenantMetrics {
    activeTenants: number;
    expiringSoon: number;
    overdueBalance: number;
    uniqueProperties: number;
}

interface TenantsPageProps {
    tenants: PaginatedTenants;
    metrics: TenantMetrics;
}

function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return '—';
    }

    return `₱${value.toLocaleString('en-PH', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

function TenantsContent({ tenants, metrics }: TenantsPageProps) {
    const { showConfirm } = useToast();
    const hasTenants = tenants.data.length > 0;

    const handleDelete = async (tenant: TenantRecord) => {
        const confirmed = await showConfirm({
            title: 'Remove tenant',
            message: `Are you sure you want to remove ${tenant.name} from your roster?`,
            confirmLabel: 'Remove',
            cancelLabel: 'Keep tenant',
        });

        if (!confirmed) {
            return;
        }

        router.delete(TenantController.destroy.url(tenant.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
            <section className="relative rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.65)]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 opacity-95" />
                <PlaceholderPattern className="absolute -right-24 top-0 h-72 w-72 stroke-white/15" />
                <div className="relative z-10 flex flex-col gap-8 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                                <Users2 className="h-4 w-4" /> Resident success
                            </span>
                            <h1 className="mt-3 text-3xl font-semibold">Active tenant roster</h1>
                            <p className="mt-2 max-w-2xl text-sm text-white/80">
                                Monitor lease milestones, outstanding balances, and concierge assignments across every property. Use the quick actions to update records or coordinate departures.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm text-white/80 shadow-lg backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">This week</p>
                            <p className="mt-2 text-lg font-semibold text-white">{metrics.activeTenants} residents on hospitality plans</p>
                            <p>Concierge response time: 42 minutes avg.</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Active tenants</p>
                            <p className="mt-3 text-3xl font-semibold">{metrics.activeTenants}</p>
                            <p className="text-sm text-white/70">Across {metrics.uniqueProperties} signature properties</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Renewals to nurture</p>
                            <p className="mt-3 text-3xl font-semibold">{metrics.expiringSoon}</p>
                            <p className="text-sm text-white/70">Personalized renewal offers recommended</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Outstanding balance</p>
                            <p className="mt-3 text-3xl font-semibold">{formatCurrency(metrics.overdueBalance)}</p>
                            <p className="text-sm text-white/70">Coordinate with concierge billing desk</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                <div className="overflow-x-auto">
                    {hasTenants ? (
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                            <thead>
                                <tr className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Resident
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Property
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Lease timeline
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Monthly rent
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Balance
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Concierge
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Status
                                    </th>
                                    <th scope="col" className="py-3 pr-4 text-right font-semibold text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white/95">
                                {tenants.data.map((tenant) => {
                                    const status = tenant.tenant_status ?? 'Current';

                                    return (
                                        <tr key={tenant.id} className="transition-colors duration-150 hover:bg-slate-50/80">
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{tenant.name}</span>
                                                    <span className="text-xs text-slate-400">{tenant.email}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">
                                                        {tenant.property_name ?? 'Unassigned property'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {tenant.unit_number ? `Suite ${tenant.unit_number}` : 'Awaiting move-in details'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{formatDate(tenant.lease_start)}</span>
                                                    <span className="text-xs text-slate-400">to {formatDate(tenant.lease_end)}</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 font-semibold text-slate-900">
                                                {formatCurrency(tenant.monthly_rent)}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 font-semibold text-slate-900">
                                                {formatCurrency(tenant.balance_due)}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">
                                                        {tenant.concierge_name ?? 'Concierge unassigned'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">Hospitality desk</span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status] ?? statusStyles.Current}`}
                                                >
                                                    <span className="h-2 w-2 rounded-full bg-current" aria-hidden />
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/tenants/${tenant.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        Manage
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => void handleDelete(tenant)}
                                                        className="inline-flex items-center gap-1 rounded-full border border-rose-200/70 bg-rose-50/80 px-3 py-1 text-xs font-semibold text-rose-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center text-slate-500">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-400">
                                <Users2 className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900">No tenants found</h3>
                                <p className="text-sm text-slate-500">
                                    Start onboarding residents to unlock concierge coordination, renewal playbooks, and billing insights.
                                </p>
                            </div>
                            <Link
                                href="/properties"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300"
                            >
                                Explore available units
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-slate-50/70 p-6 text-slate-600 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.35)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Resident experience insights
                    </h2>
                    <span className="rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                        Concierge certified
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                    Tailor your hospitality playbook based on resident behavior signals. Renew proactive check-ins for suites trending toward renewal, and coordinate move-out experiences for those preparing transitions.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Renewal health</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">72% favorable</p>
                        <p className="text-xs text-slate-400">Residents likely to renew with concierge engagement</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Concierge velocity</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">Under 1 hour</p>
                        <p className="text-xs text-slate-400">Average response from hospitality desk</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Referral signals</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">18 new advocates</p>
                        <p className="text-xs text-slate-400">Residents ready to share signature experiences</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function Tenants() {
    const { tenants, metrics } = usePage<{ tenants: PaginatedTenants; metrics: TenantMetrics }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenants" />
            <TenantsContent tenants={tenants} metrics={metrics} />
        </AppLayout>
    );
}
