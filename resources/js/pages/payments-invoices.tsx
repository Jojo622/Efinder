import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CreditCard, FileText, PlusCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Payments & Invoices',
        href: '/payments-invoices',
    },
];

type InvoiceListItem = {
    id: number;
    invoice_number: string;
    status: string;
    issue_date?: string | null;
    due_date?: string | null;
    total: number;
    balance_due: number;
    tenant?: {
        name?: string | null;
        property_name?: string | null;
        unit_number?: string | null;
    } | null;
    property?: {
        name?: string | null;
        street_address?: string | null;
        city?: string | null;
        barangay?: string | null;
    } | null;
};

interface PaymentsInvoicesProps {
    invoices: InvoiceListItem[];
    canCreate: boolean;
}

const statusStyles: Record<string, string> = {
    Paid: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    Pending: 'border-amber-200 bg-amber-50 text-amber-600',
    Draft: 'border-slate-200 bg-slate-50 text-slate-500',
    Overdue: 'border-rose-200 bg-rose-50 text-rose-600',
    Cancelled: 'border-slate-200 bg-slate-100 text-slate-500 line-through',
    'Partially Paid': 'border-blue-200 bg-blue-50 text-blue-600',
};

const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatProperty = (invoice: InvoiceListItem) => {
    if (invoice.property?.name) {
        const location = [
            invoice.property.street_address,
            invoice.property.barangay,
            invoice.property.city,
        ]
            .filter((segment) => segment && segment.length > 0)
            .join(', ');

        return location.length > 0 ? `${invoice.property.name} · ${location}` : invoice.property.name;
    }

    if (invoice.tenant?.property_name) {
        const unit = invoice.tenant.unit_number ? ` – ${invoice.tenant.unit_number}` : '';
        return `${invoice.tenant.property_name}${unit}`;
    }

    return '—';
};

const statusLabel = (status: string) => statusStyles[status] ?? 'border-slate-200 bg-slate-50 text-slate-500';

export default function PaymentsInvoices({ invoices, canCreate }: PaymentsInvoicesProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments & Invoices" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 opacity-95" />
                    <PlaceholderPattern className="absolute -right-16 top-6 h-72 w-72 stroke-white/10" />
                    <div className="relative z-10 flex flex-col gap-8 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                                    <CreditCard className="h-4 w-4" /> Treasury desk
                                </span>
                                <h1 className="text-3xl font-semibold">Payments & invoice lifecycle</h1>
                                <p className="max-w-2xl text-sm text-white/75">
                                    Monitor billing status, reconcile concierge collections, and surface follow-ups before a balance falls behind. Automated reminders are running for outstanding accounts.
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-4 text-sm text-white/80">
                                <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 shadow-lg backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Week-to-date</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-lg font-semibold text-white">₱1.2M collected</p>
                                        <p>92% of invoices paid on or before due date</p>
                                    </div>
                                </div>
                                {canCreate && (
                                    <Link
                                        href="/invoices/create"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:border-white/60"
                                    >
                                        <PlusCircle className="h-4 w-4" /> Create new invoice
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Outstanding balance</p>
                                <p className="mt-3 text-3xl font-semibold">{formatCurrency(
                                    invoices.reduce((total, invoice) => total + invoice.balance_due, 0),
                                )}</p>
                                <p className="text-sm text-white/70">Across concierge managed residences</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Open invoices</p>
                                <p className="mt-3 text-3xl font-semibold">{invoices.length}</p>
                                <p className="text-sm text-white/70">Including scheduled billing cycles</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Paid this month</p>
                                <p className="mt-3 text-3xl font-semibold">{formatCurrency(
                                    invoices.reduce(
                                        (total, invoice) => (invoice.balance_due <= 0 ? total + invoice.total : total),
                                        0,
                                    ),
                                )}</p>
                                <p className="text-sm text-white/70">Marking concierge verified payments</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="border-b border-slate-200/70 bg-slate-50/60 px-6 py-4">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Invoice status</h2>
                    </div>
                    <div className="overflow-x-auto px-2">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                            <thead>
                                <tr className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    <th scope="col" className="py-3 pl-4 pr-4 font-semibold">Resident</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Property</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Invoice</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Amount</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Due date</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {invoices.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-sm text-slate-500">
                                            There are no invoices yet. Create one to begin tracking concierge billing.
                                        </td>
                                    </tr>
                                )}

                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="transition-colors duration-200 hover:bg-slate-50/70">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-4">
                                            <div className="font-semibold text-slate-900">{invoice.tenant?.name ?? '—'}</div>
                                            <div className="text-xs text-slate-500">Issued {invoice.issue_date ?? '—'}</div>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">
                                            {formatProperty(invoice)}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm font-semibold text-slate-900">
                                            {invoice.invoice_number}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 font-semibold text-slate-900">
                                            {formatCurrency(invoice.total)}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">
                                            {invoice.due_date ?? '—'}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4">
                                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusLabel(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-4">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <Link
                                                    href={`/invoices/${invoice.id}`}
                                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900"
                                                >
                                                    <FileText className="h-3.5 w-3.5" /> View
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
