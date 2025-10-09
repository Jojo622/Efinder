import InputError from '@/components/input-error';
import FormSelect from '@/components/form-select';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardCheck, LifeBuoy } from 'lucide-react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Ticket Concerns',
        href: '/ticket-concerns',
    },
    {
        title: 'Submit a Ticket',
        href: '/ticket-concerns/create',
    },
];

interface TicketDefaults {
    property_name?: string | null;
    unit_number?: string | null;
    contact_number?: string | null;
}

interface TicketConcernsCreateProps extends SharedData {
    defaults?: TicketDefaults;
}

const categoryOptions = [
    { value: 'Maintenance', label: 'Maintenance & Repairs' },
    { value: 'Housekeeping', label: 'Housekeeping & Turnover' },
    { value: 'Billing', label: 'Billing & Payments' },
    { value: 'Amenities', label: 'Amenities & Access' },
    { value: 'Concierge', label: 'Concierge Request' },
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export default function TicketConcernsCreate({ defaults }: TicketConcernsCreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        property_name: defaults?.property_name ?? '',
        unit_number: defaults?.unit_number ?? '',
        category: categoryOptions[0]?.value ?? 'Maintenance',
        priority: 'normal',
        subject: '',
        description: '',
        contact_number: defaults?.contact_number ?? '',
        preferred_visit_date: '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/ticket-concerns', {
            preserveScroll: true,
            onSuccess: () => {
                reset('subject', 'description', 'preferred_visit_date');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submit a Ticket" />
            <div className="relative flex min-h-full flex-1 flex-col gap-8 px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.55)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -right-28 top-8 h-72 w-72 stroke-sky-200/50" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                                    <LifeBuoy className="h-4 w-4" /> Concierge assistance
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Submit a new service ticket</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Tell us what you need and our concierge team will coordinate the right specialists for your property. Provide as much detail as possible so we can respond quickly.
                                </p>
                            </div>
                            <Button asChild variant="outline" className="rounded-full border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">
                                <Link href="/ticket-concerns">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to tickets
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.55)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-sky-50/80" />
                    <PlaceholderPattern className="absolute -left-28 bottom-4 h-64 w-64 stroke-slate-200/50" />
                    <div className="relative z-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="property_name" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Property name
                                    </Label>
                                    <Input
                                        id="property_name"
                                        name="property_name"
                                        value={data.property_name}
                                        onChange={(event) => setData('property_name', event.target.value)}
                                        placeholder="Ayala Heights Residence"
                                        aria-invalid={Boolean(errors.property_name)}
                                    />
                                    <InputError message={errors.property_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit_number" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Unit or room number
                                    </Label>
                                    <Input
                                        id="unit_number"
                                        name="unit_number"
                                        value={data.unit_number}
                                        onChange={(event) => setData('unit_number', event.target.value)}
                                        placeholder="Unit 1203"
                                        aria-invalid={Boolean(errors.unit_number)}
                                    />
                                    <InputError message={errors.unit_number} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Ticket category
                                    </Label>
                                    <FormSelect
                                        name="category"
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                        options={categoryOptions}
                                        triggerClassName="rounded-xl border-slate-200 bg-white/90 text-sm font-medium text-slate-700"
                                    />
                                    <InputError message={errors.category} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Priority level
                                    </Label>
                                    <FormSelect
                                        name="priority"
                                        value={data.priority}
                                        onValueChange={(value) => setData('priority', value)}
                                        options={priorityOptions}
                                        triggerClassName="rounded-xl border-slate-200 bg-white/90 text-sm font-medium text-slate-700"
                                    />
                                    <InputError message={errors.priority} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                    Ticket subject
                                </Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    value={data.subject}
                                    onChange={(event) => setData('subject', event.target.value)}
                                    placeholder="Air-conditioning maintenance request"
                                    aria-invalid={Boolean(errors.subject)}
                                />
                                <InputError message={errors.subject} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                    Describe the concern
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(event) => setData('description', event.target.value)}
                                    className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                    placeholder="Share relevant timelines, access instructions, or previous fixes."
                                    aria-invalid={Boolean(errors.description)}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="preferred_visit_date" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Preferred visit date
                                    </Label>
                                    <DatePicker
                                        name="preferred_visit_date"
                                        value={data.preferred_visit_date || null}
                                        onChange={(value) => setData('preferred_visit_date', value ?? '')}
                                        placeholder="Select preferred date"
                                    />
                                    <InputError message={errors.preferred_visit_date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_number" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                                        Best contact number
                                    </Label>
                                    <Input
                                        id="contact_number"
                                        name="contact_number"
                                        value={data.contact_number}
                                        onChange={(event) => setData('contact_number', event.target.value)}
                                        placeholder="+63 917 123 4567"
                                        aria-invalid={Boolean(errors.contact_number)}
                                    />
                                    <InputError message={errors.contact_number} />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <ClipboardCheck className="h-5 w-5 text-slate-400" />
                                    Our concierge will acknowledge your ticket within 2 business hours.
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="rounded-full border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
                                        onClick={() => reset()}
                                        disabled={processing}
                                    >
                                        Clear form
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700"
                                        disabled={processing}
                                    >
                                        {processing ? 'Submitting...' : 'Submit ticket'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
