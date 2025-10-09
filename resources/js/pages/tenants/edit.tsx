import TenantController from '@/actions/App/Http/Controllers/Client/TenantController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface TenantFormProps {
    tenant: {
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
    };
}

const breadcrumbs = (tenant: TenantFormProps['tenant']): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Tenants',
        href: '/tenants',
    },
    {
        title: tenant.name,
        href: `/tenants/${tenant.id}/edit`,
    },
];

export default function EditTenant({ tenant }: TenantFormProps) {
    const [leaseStart, setLeaseStart] = useState<string | null>(tenant.lease_start ?? null);
    const [leaseEnd, setLeaseEnd] = useState<string | null>(tenant.lease_end ?? null);

    return (
        <AppLayout breadcrumbs={breadcrumbs(tenant)}>
            <Head title={`Edit ${tenant.name}`} />
            <div className="relative flex h-full flex-1 flex-col gap-10 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] p-8 text-white shadow-[0_35px_90px_-60px_rgba(15,23,42,0.85)]">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative z-10 flex flex-col gap-8">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                                    <Sparkles className="h-4 w-4" /> Concierge profile
                                </span>
                                <h1 className="text-3xl font-semibold">Refine {tenant.first_name}'s resident story</h1>
                                <p className="max-w-2xl text-sm text-white/80">
                                    Update leasing milestones, concierge assignments, and billing status so every hospitality touchpoint stays perfectly in sync.
                                </p>
                            </div>
                            <Link
                                href="/tenants"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to roster
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-white/60">
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Hospitality grade data capture</span>
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Seamless concierge handoffs</span>
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">Renewal readiness toolkit</span>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.35)]">
                    <Form {...TenantController.update.form(tenant.id)} className="space-y-8">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Resident identity</h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                These details surface in concierge dashboards and renewal checklists—keep them polished.
                                            </p>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">First name</span>
                                                <Input name="first_name" defaultValue={tenant.first_name} placeholder="Avery" required />
                                                <InputError message={errors.first_name} />
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Last name</span>
                                                <Input name="last_name" defaultValue={tenant.last_name} placeholder="Chen" required />
                                                <InputError message={errors.last_name} />
                                            </label>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Email address</span>
                                                <Input
                                                    name="email"
                                                    type="email"
                                                    defaultValue={tenant.email}
                                                    placeholder="avery@example.com"
                                                    required
                                                />
                                                <InputError message={errors.email} />
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Mobile number</span>
                                                <Input
                                                    name="mobile_number"
                                                    defaultValue={tenant.mobile_number ?? ''}
                                                    placeholder="0917 123 4567"
                                                />
                                                <InputError message={errors.mobile_number} />
                                            </label>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Property name</span>
                                                <Input
                                                    name="property_name"
                                                    defaultValue={tenant.property_name ?? ''}
                                                    placeholder="Azure Heights"
                                                />
                                                <InputError message={errors.property_name} />
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Unit / Residence</span>
                                                <Input name="unit_number" defaultValue={tenant.unit_number ?? ''} placeholder="Suite 1203" />
                                                <InputError message={errors.unit_number} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm">
                                        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Lease vitals</h2>
                                        <p className="text-sm text-slate-500">
                                            Align marketing, billing, and concierge teams with accurate lease start and completion dates.
                                        </p>
                                        <div className="grid gap-4">
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Lease start</span>
                                                <DatePicker
                                                    name="lease_start"
                                                    value={leaseStart}
                                                    onChange={setLeaseStart}
                                                    placeholder="Select start date"
                                                />
                                                <InputError message={errors.lease_start} />
                                            </label>
                                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                                <span className="font-medium text-slate-900">Lease end</span>
                                                <DatePicker
                                                    name="lease_end"
                                                    value={leaseEnd}
                                                    onChange={setLeaseEnd}
                                                    placeholder="Select end date"
                                                />
                                                <InputError message={errors.lease_end} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Monthly rent</span>
                                        <Input
                                            name="monthly_rent"
                                            defaultValue={tenant.monthly_rent ?? ''}
                                            placeholder="35000"
                                            inputMode="decimal"
                                        />
                                        <InputError message={errors.monthly_rent} />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Outstanding balance</span>
                                        <Input
                                            name="balance_due"
                                            defaultValue={tenant.balance_due ?? ''}
                                            placeholder="0"
                                            inputMode="decimal"
                                        />
                                        <InputError message={errors.balance_due} />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Resident status</span>
                                        <Input
                                            name="tenant_status"
                                            defaultValue={tenant.tenant_status ?? ''}
                                            placeholder="Current"
                                        />
                                        <InputError message={errors.tenant_status} />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Concierge partner</span>
                                        <Input
                                            name="concierge_name"
                                            defaultValue={tenant.concierge_name ?? ''}
                                            placeholder="Jonah Pierce"
                                        />
                                        <InputError message={errors.concierge_name} />
                                    </label>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        <span>Saving updates triggers concierge alerts and billing sync in real-time.</span>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                                    >
                                        {processing ? 'Updating…' : 'Save tenant profile'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </AppLayout>
    );
}
