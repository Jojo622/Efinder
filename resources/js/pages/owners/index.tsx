import OwnerController from '@/actions/App/Http/Controllers/Client/OwnerController';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useToast } from '@/components/ui/toast-provider';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { resolvePaginationSummary } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Trash2, UserCog } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Owners',
        href: '/owners',
    },
];

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

interface OwnerRecord {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    mobile_number: string | null;
    role: string;
    status: string | null;
    business_permit: {
        url: string;
        filename: string;
    } | null;
    properties_count: number;
    created_at: string | null;
    updated_at: string | null;
}

interface PaginatedOwners {
    data: OwnerRecord[];
    links: PaginationLink[];
    meta: PaginationMeta;
}

interface OwnersPageProps extends SharedData {
    owners?: PaginatedOwners | null;
}

interface OwnersContentProps {
    owners?: PaginatedOwners | null;
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

function OwnersContent({ owners }: OwnersContentProps) {
    const { showConfirm } = useToast();
    const ownerRecords = owners?.data ?? [];
    const paginationMeta: PaginationMeta =
        owners?.meta ?? {
            current_page: 1,
            last_page: 1,
            from: 0,
            to: 0,
            total: 0,
            per_page: 0,
        };
    const paginationLinks = owners?.links ?? [];

    const hasOwners = ownerRecords.length > 0;
    const paginationSummary = resolvePaginationSummary(paginationMeta, ownerRecords.length);
    const totalOwners = paginationSummary.total;

    const handleDelete = async (owner: OwnerRecord) => {
        const confirmed = await showConfirm({
            title: 'Remove owner',
            message: `Are you sure you want to remove ${owner.name} from your owner directory?`,
            confirmLabel: 'Remove',
            cancelLabel: 'Keep owner',
        });

        if (!confirmed) {
            return;
        }

        router.delete(OwnerController.destroy.url(owner.id), {
            preserveScroll: true,
        });
    };

    const handleActivate = (owner: OwnerRecord) => {
        router.patch(OwnerController.updateUser.url(owner.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
            <section className="relative rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.65)]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 opacity-95" />
                <PlaceholderPattern className="absolute -left-24 top-0 h-72 w-72 stroke-white/10" />
                <div className="relative z-10 flex flex-col gap-8 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                                <UserCog className="h-4 w-4" /> Owner relations
                            </span>
                            <h1 className="text-3xl font-semibold">Owner stewardship directory</h1>
                            <p className="max-w-2xl text-sm text-white/80">
                                Review your active property partners, update contact information, and coordinate outreach before upcoming portfolio strategy sessions.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm text-white/80 shadow-lg backdrop-blur">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Active partners</p>
                            <p className="mt-2 text-lg font-semibold text-white">{totalOwners} owners on record</p>
                            <p>Maintain concierge-grade relationships across every estate.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                <div className="overflow-x-auto">
                    {hasOwners ? (
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                            <thead>
                                <tr className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Owner
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Email
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Mobile
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Properties
                                    </th>
                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                        Joined
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
                                {ownerRecords.map((owner) => (
                                    <tr key={owner.id} className="transition-colors duration-200 hover:bg-slate-50/70">
                                        <td className="whitespace-nowrap py-4 pr-4 align-top">
                                            <div className="font-semibold text-slate-900">{owner.name}</div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                <span className="font-medium text-slate-600">Business permit:</span>{' '}
                                                {owner.business_permit ? (
                                                    <a
                                                        href={owner.business_permit.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
                                                    >
                                                        {owner.business_permit.filename}
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">Pending submission</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">{owner.email}</td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">{owner.mobile_number ?? '—'}</td>
                                        <td className="whitespace-nowrap py-4 pr-4 font-semibold text-slate-900">
                                            {owner.properties_count}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">{formatDate(owner.created_at)}</td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                    owner.status?.toLowerCase() === 'active'
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                                                        : 'border-amber-200 bg-amber-50 text-amber-600'
                                                }`}
                                            >
                                                {owner.status ?? 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={OwnerController.edit.url(owner.id)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900"
                                                >
                                                    <Edit className="h-3.5 w-3.5" /> Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleActivate(owner)}
                                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200 ${
                                                        owner.status?.toLowerCase() === 'active'
                                                            ? 'cursor-not-allowed border-slate-200 text-slate-400'
                                                            : 'border-emerald-200 text-emerald-600 hover:border-emerald-300 hover:text-emerald-700'
                                                    }`}
                                                    disabled={owner.status?.toLowerCase() === 'active'}
                                                >
                                                    Activate
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => void handleDelete(owner)}
                                                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition-colors duration-200 hover:border-rose-300 hover:text-rose-700"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                            <div className="rounded-full bg-slate-100 p-4 text-slate-500">
                                <UserCog className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">No owners found</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Once owners are onboarded, their contact details and property counts will appear here for quick collaboration.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        Showing {paginationSummary.from} to {paginationSummary.to} of {paginationSummary.total} owners
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {paginationLinks.map((link, index) => {
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
    );
}

export default function Owners() {
    const { owners } = usePage<OwnersPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owners" />
            <OwnersContent owners={owners} />
        </AppLayout>
    );
}
