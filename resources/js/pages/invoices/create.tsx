import FormSelect from '@/components/form-select';
import InputError from '@/components/input-error';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, NotebookPen, Receipt, Undo2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SelectOption {
    id: number;
    name: string;
    [key: string]: unknown;
}

interface PropertyOption extends SelectOption {
    owner_id: number;
    location: string;
}

interface TenantOption extends SelectOption {
    property_name?: string | null;
    unit_number?: string | null;
}

interface InvoiceFormOptions {
    owners: SelectOption[];
    tenants: TenantOption[];
    properties: PropertyOption[];
    statuses: string[];
}

interface InvoiceDefaults {
    owner_id: number | null;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    billing_period_start: string;
    billing_period_end: string;
    status: string;
}

interface InvoiceCreateProps {
    formOptions: InvoiceFormOptions;
    defaults: InvoiceDefaults;
    canSelectOwner: boolean;
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
        title: 'Create Invoice',
        href: '/invoices/create',
    },
];

export default function InvoiceCreate({ formOptions, defaults, canSelectOwner }: InvoiceCreateProps) {
    const [ownerId, setOwnerId] = useState<string>(defaults.owner_id ? String(defaults.owner_id) : '');
    const [propertyId, setPropertyId] = useState<string>('');
    const [tenantId, setTenantId] = useState<string>('');
    const [issueDate, setIssueDate] = useState<string | null>(defaults.issue_date ?? null);
    const [dueDate, setDueDate] = useState<string | null>(defaults.due_date ?? null);
    const [billingStart, setBillingStart] = useState<string | null>(defaults.billing_period_start ?? null);
    const [billingEnd, setBillingEnd] = useState<string | null>(defaults.billing_period_end ?? null);
    const [status, setStatus] = useState<string>(defaults.status);

    const filteredProperties = useMemo(() => {
        if (!ownerId) {
            return formOptions.properties;
        }

        const ownerNumeric = Number(ownerId);
        return formOptions.properties.filter((property) => property.owner_id === ownerNumeric);
    }, [formOptions.properties, ownerId]);

    useEffect(() => {
        if (!propertyId) {
            return;
        }

        const exists = filteredProperties.some((property) => String(property.id) === propertyId);
        if (!exists) {
            setPropertyId('');
        }
    }, [filteredProperties, propertyId]);

    useEffect(() => {
        if (!tenantId) {
            return;
        }

        const tenant = formOptions.tenants.find((candidate) => String(candidate.id) === tenantId);
        if (tenant?.property_name) {
            const matchingProperty = formOptions.properties.find(
                (property) => property.name === tenant.property_name,
            );
            if (matchingProperty) {
                setOwnerId(String(matchingProperty.owner_id));
                setPropertyId(String(matchingProperty.id));
            }
        }
    }, [tenantId, formOptions.tenants, formOptions.properties]);

    const activeOwner = useMemo(
        () => formOptions.owners.find((owner) => String(owner.id) === ownerId)?.name ?? null,
        [formOptions.owners, ownerId],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/70 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -left-28 bottom-6 h-72 w-72 stroke-emerald-200/50" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                                    <Receipt className="h-4 w-4" /> Concierge billing
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Create a bespoke invoice for your resident</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Capture lease charges, concierge services, and billing periods in one elegant summary. Once saved, your concierge team can share the invoice instantly.
                                </p>
                            </div>
                            <Link
                                href="/payments-invoices"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300"
                            >
                                <Undo2 className="h-4 w-4" /> Back to invoices
                            </Link>
                        </div>
                    </div>
                </section>

                <Form method="post" action="/invoices" className="space-y-8">
                    {({ processing, errors }) => (
                        <>
                            <section className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Billing details</h2>
                                    <NotebookPen className="h-5 w-5 text-slate-400" />
                                </div>

                                <div className="mt-6 grid gap-6 md:grid-cols-2">
                                    {canSelectOwner ? (
                                        <div>
                                            <Label htmlFor="owner_id">Owner</Label>
                                            <FormSelect
                                                id="owner_id"
                                                name="owner_id"
                                                value={ownerId}
                                                onValueChange={setOwnerId}
                                                options={[
                                                    { value: '', label: 'Select owner' },
                                                    ...formOptions.owners.map((owner) => ({
                                                        value: String(owner.id),
                                                        label: owner.name,
                                                    })),
                                                ]}
                                                placeholder="Select owner"
                                                className="mt-2"
                                                triggerClassName="rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                            />
                                            <InputError message={errors.owner_id} className="mt-2" />
                                        </div>
                                    ) : (
                                        <div>
                                            <Label>Owner</Label>
                                            <Input value={activeOwner ?? 'Current owner'} readOnly className="mt-2 bg-slate-50" />
                                            <input type="hidden" name="owner_id" value={ownerId} />
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="tenant_id">Tenant</Label>
                                        <FormSelect
                                            id="tenant_id"
                                            name="tenant_id"
                                            value={tenantId}
                                            onValueChange={setTenantId}
                                            options={[
                                                { value: '', label: 'Select tenant' },
                                                ...formOptions.tenants.map((tenant) => ({
                                                    value: String(tenant.id),
                                                    label: tenant.name,
                                                })),
                                            ]}
                                            placeholder="Select tenant"
                                            className="mt-2"
                                            triggerClassName="rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                        />
                                        <InputError message={errors.tenant_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label htmlFor="property_id">Property</Label>
                                        <FormSelect
                                            id="property_id"
                                            name="property_id"
                                            value={propertyId}
                                            onValueChange={setPropertyId}
                                            options={[
                                                { value: '', label: 'Select property' },
                                                ...filteredProperties.map((property) => ({
                                                    value: String(property.id),
                                                    label: property.location
                                                        ? `${property.name} · ${property.location}`
                                                        : property.name,
                                                })),
                                            ]}
                                            placeholder="Select property"
                                            className="mt-2"
                                            triggerClassName="rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                        />
                                        <InputError message={errors.property_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label htmlFor="invoice_number">Invoice number</Label>
                                        <Input
                                            id="invoice_number"
                                            name="invoice_number"
                                            defaultValue={defaults.invoice_number}
                                            className="mt-2"
                                        />
                                        <InputError message={errors.invoice_number} className="mt-2" />
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <FormSelect
                                            id="status"
                                            name="status"
                                            value={status}
                                            onValueChange={setStatus}
                                            options={formOptions.statuses.map((option) => ({
                                                value: option,
                                                label: option,
                                            }))}
                                            className="mt-2"
                                            triggerClassName="rounded-xl border border-slate-200 bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                        />
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Schedule</h2>
                                    <LoaderCircle className="h-5 w-5 text-slate-400" />
                                </div>

                                <div className="mt-6 grid gap-6 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="issue_date">Issue date</Label>
                                        <DatePicker
                                            name="issue_date"
                                            value={issueDate}
                                            onChange={setIssueDate}
                                            placeholder="Select issue date"
                                            className="mt-2"
                                        />
                                        <InputError message={errors.issue_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="due_date">Due date</Label>
                                        <DatePicker
                                            name="due_date"
                                            value={dueDate}
                                            onChange={setDueDate}
                                            placeholder="Select due date"
                                            className="mt-2"
                                        />
                                        <InputError message={errors.due_date} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="billing_period_start">Billing period start</Label>
                                        <DatePicker
                                            name="billing_period_start"
                                            value={billingStart}
                                            onChange={setBillingStart}
                                            placeholder="Select start date"
                                            className="mt-2"
                                        />
                                        <InputError message={errors.billing_period_start} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="billing_period_end">Billing period end</Label>
                                        <DatePicker
                                            name="billing_period_end"
                                            value={billingEnd}
                                            onChange={setBillingEnd}
                                            placeholder="Select end date"
                                            className="mt-2"
                                        />
                                        <InputError message={errors.billing_period_end} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Charges</h2>
                                    <Receipt className="h-5 w-5 text-slate-400" />
                                </div>

                                <div className="mt-6 grid gap-6 md:grid-cols-3">
                                    <div>
                                        <Label htmlFor="rent_amount">Monthly rent</Label>
                                        <Input id="rent_amount" name="rent_amount" type="number" step="0.01" min="0" className="mt-2" />
                                        <InputError message={errors.rent_amount} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="utilities_amount">Utilities</Label>
                                        <Input id="utilities_amount" name="utilities_amount" type="number" step="0.01" min="0" className="mt-2" />
                                        <InputError message={errors.utilities_amount} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="additional_fees">Additional fees</Label>
                                        <Input id="additional_fees" name="additional_fees" type="number" step="0.01" min="0" className="mt-2" />
                                        <InputError message={errors.additional_fees} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="late_fee">Late fee</Label>
                                        <Input id="late_fee" name="late_fee" type="number" step="0.01" min="0" className="mt-2" />
                                        <InputError message={errors.late_fee} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="tax_amount">Tax amount</Label>
                                        <Input id="tax_amount" name="tax_amount" type="number" step="0.01" min="0" className="mt-2" />
                                        <InputError message={errors.tax_amount} className="mt-2" />
                                    </div>
                                    <div>
                                        <Label htmlFor="amount_paid">Amount paid</Label>
                                        <Input id="amount_paid" name="amount_paid" type="number" step="0.01" min="0" className="mt-2" />
                                        <InputError message={errors.amount_paid} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="notes">Concierge notes</Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={4}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0"
                                        placeholder="Add hospitality services, bespoke requests, or payment instructions."
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing} className="inline-flex items-center gap-2">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Save invoice
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
