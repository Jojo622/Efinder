import TenantController from '@/actions/App/Http/Controllers/Client/TenantController';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useToast } from '@/components/ui/toast-provider';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Trash2, Users2 } from 'lucide-react';

import { resolvePaginationSummary } from '@/lib/utils';

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

export default function Tenants() {
    const { tenants, metrics } = usePage<{ tenants: PaginatedTenants; metrics: TenantMetrics }>().props;
    const { showConfirm } = useToast();

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

    const hasTenants = tenants.data.length > 0;
    const paginationSummary = resolvePaginationSummary(tenants.meta, tenants.data.length);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenants" />
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
                                        <th scope="col" className="py-3 text-right font-semibold text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {tenants.data.map((tenant) => {
                                        const balanceValue = tenant.balance_due ?? 0;
                                        const isSettled = balanceValue <= 0;
                                        const statusClass = statusStyles[tenant.tenant_status ?? ''] ??
                                            'border-slate-200 bg-slate-100 text-slate-600';

                                        return (
                                            <tr key={tenant.id} className="transition-colors duration-200 hover:bg-slate-50/70">
                                                <td className="whitespace-nowrap py-4 pr-4">
                                                    <div className="font-semibold text-slate-900">{tenant.name}</div>
                                                    <div className="text-xs text-slate-500">{tenant.email}</div>
                                                    <div className="text-xs text-slate-400">{tenant.mobile_number ?? '—'}</div>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4">
                                                    <div className="font-medium text-slate-900">{tenant.property_name ?? '—'}</div>
                                                    <div className="text-xs text-slate-500">{tenant.unit_number ?? '—'}</div>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4 text-xs text-slate-500">
                                                    <div>{formatDate(tenant.lease_start)}</div>
                                                    <div>{formatDate(tenant.lease_end)}</div>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-900">
                                                    {formatCurrency(tenant.monthly_rent)}
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                            isSettled
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                                                : 'border-rose-200 bg-rose-50 text-rose-600'
                                                        }`}
                                                    >
                                                        {isSettled ? 'Settled' : formatCurrency(balanceValue)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4 text-sm font-medium text-slate-700">
                                                    {tenant.concierge_name ?? '—'}
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-4">
                                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
                                                        {tenant.tenant_status ?? 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link
                                                            href={TenantController.edit.url(tenant.id)}
                                                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" /> Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(tenant)}
                                                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors duration-200 hover:border-rose-300 hover:text-rose-700"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                                <div className="rounded-full bg-slate-100 p-4 text-slate-500">
                                    <Users2 className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">No tenants found</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Add tenant profiles to keep concierge, billing, and renewal teams aligned.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                            Showing {paginationSummary.from} to {paginationSummary.to} of {paginationSummary.total} tenants
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            {tenants.links.map((link, index) => {
                                const baseClass = `rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                    link.active
                                        ? 'border-slate-900 bg-slate-900 text-white shadow'
                                        : link.url
                                            ? 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                            : 'cursor-not-allowed border-slate-100 text-slate-300'
                                }`;

                                if (!link.url) {
                                    return (
                                        <span
                                            key={`${link.label}-${index}`}
                                            className={baseClass}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                }

                                return (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url}
                                        className={baseClass}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                    />
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
