import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import { useMemo } from 'react';

interface Party {
    name?: string | null;
    email?: string | null;
    property_name?: string | null;
    unit_number?: string | null;
}

interface PropertySummary {
    name?: string | null;
    street_address?: string | null;
    city?: string | null;
    barangay?: string | null;
}

interface InvoiceDetail {
    id: number;
    invoice_number: string;
    status: string;
    issue_date?: string | null;
    due_date?: string | null;
    billing_period_start?: string | null;
    billing_period_end?: string | null;
    rent_amount: number;
    utilities_amount: number;
    additional_fees: number;
    late_fee: number;
    subtotal: number;
    tax_amount: number;
    total: number;
    amount_paid: number;
    balance_due: number;
    notes?: string | null;
    tenant?: Party | null;
    owner?: Party | null;
    property?: PropertySummary | null;
}

interface InvoiceShowProps {
    invoice: InvoiceDetail;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Payments & Invoices',
        href: '/payments-invoices',
    },
    {
        title: 'Invoice Details',
        href: '#',
    },
];

const statusColors: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
    Draft: 'bg-slate-100 text-slate-600 border-slate-200',
    Cancelled: 'bg-slate-50 text-slate-400 border-slate-200 line-through',
    'Partially Paid': 'bg-blue-50 text-blue-700 border-blue-200',
};

const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatAddress = (property?: PropertySummary | null) => {
    if (!property) {
        return '—';
    }

    const segments = [property.street_address, property.barangay, property.city].filter(
        (segment) => segment && segment.length > 0,
    );

    if (segments.length === 0) {
        return property.name ?? '—';
    }

    return `${property.name ?? 'Residence'} · ${segments.join(', ')}`;
};

export default function InvoiceShow({ invoice }: InvoiceShowProps) {
    const statusStyle = statusColors[invoice.status] ?? 'bg-slate-100 text-slate-600 border-slate-200';

    const chargeBreakdown = useMemo(
        () => [
            { label: 'Monthly rent', value: invoice.rent_amount },
            { label: 'Utilities', value: invoice.utilities_amount },
            { label: 'Additional fees', value: invoice.additional_fees },
            { label: 'Late fee', value: invoice.late_fee },
            { label: 'Tax amount', value: invoice.tax_amount },
        ],
        [invoice.additional_fees, invoice.late_fee, invoice.rent_amount, invoice.tax_amount, invoice.utilities_amount],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-95" />
                    <PlaceholderPattern className="absolute -right-16 top-8 h-72 w-72 stroke-white/10" />
                    <div className="relative z-10 flex flex-wrap items-start justify-between gap-6 text-white">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                                <FileText className="h-4 w-4" /> Concierge invoice
                            </span>
                            <div>
                                <h1 className="text-3xl font-semibold">Invoice {invoice.invoice_number}</h1>
                                <p className="mt-2 text-sm text-white/75">
                                    Issued {invoice.issue_date ?? '—'} · Due {invoice.due_date ?? '—'}
                                </p>
                            </div>
                            <span className={`inline-flex w-fit items-center rounded-full border px-4 py-1 text-xs font-semibold ${statusStyle}`}>
                                {invoice.status}
                            </span>
                        </div>
                        <div className="flex flex-col items-end gap-3 text-sm text-white/80">
                            <Link
                                href="/payments-invoices"
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 font-semibold transition-colors duration-200 hover:border-white/60"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to list
                            </Link>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-white/30 bg-white/10 text-white hover:border-white/60"
                                onClick={() => window.print()}
                            >
                                <Printer className="h-4 w-4" /> Print invoice
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Billed to</h2>
                            <p className="mt-4 text-lg font-semibold text-slate-900">{invoice.tenant?.name ?? '—'}</p>
                            <p className="text-sm text-slate-600">{invoice.tenant?.email ?? '—'}</p>
                            <p className="mt-2 text-xs text-slate-500">
                                {invoice.tenant?.property_name ?? 'Residence'}{' '}
                                {invoice.tenant?.unit_number ? `· ${invoice.tenant?.unit_number}` : ''}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Property</h2>
                            <p className="mt-4 text-sm text-slate-600">{formatAddress(invoice.property)}</p>
                            <p className="mt-4 text-xs text-slate-500">
                                Billing period: {invoice.billing_period_start ?? '—'} → {invoice.billing_period_end ?? '—'}
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Concierge owner</h2>
                            <p className="mt-4 text-lg font-semibold text-slate-900">{invoice.owner?.name ?? '—'}</p>
                            <p className="text-sm text-slate-600">{invoice.owner?.email ?? '—'}</p>
                            <p className="mt-4 text-sm font-semibold text-slate-900">Balance due</p>
                            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(invoice.balance_due)}</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                        <div className="border-b border-slate-200/70 bg-slate-50/60 px-6 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Charge summary</h2>
                        </div>
                        <div className="px-6 py-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {chargeBreakdown.map((item) => (
                                    <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3">
                                        <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                        <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.value)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Subtotal</p>
                                    <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(invoice.subtotal)}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Total due</p>
                                    <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(invoice.total)}</p>
                                </div>
                                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Amount paid</p>
                                    <p className="mt-2 text-xl font-semibold text-emerald-700">{formatCurrency(invoice.amount_paid)}</p>
                                </div>
                                <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">Balance remaining</p>
                                    <p className="mt-2 text-xl font-semibold text-rose-700">{formatCurrency(invoice.balance_due)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Concierge notes</h2>
                            <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">{invoice.notes}</p>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
