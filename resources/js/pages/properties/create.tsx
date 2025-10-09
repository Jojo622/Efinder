import PropertyController from '@/actions/App/Http/Controllers/Client/PropertyController';
import PropertyForm, { type PropertyFormOptions, type PropertyFormValues } from '@/components/property-form';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { CalendarDays, Home, MapPin, Sparkles } from 'lucide-react';

interface CreatePropertyProps {
    formOptions: PropertyFormOptions;
    property: PropertyFormValues | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Property Portfolio',
        href: '/properties',
    },
    {
        title: 'Add New Property',
        href: '/properties/create',
    },
];

export default function CreateProperty({ formOptions, property }: CreatePropertyProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Property" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.65)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-white to-transparent" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                                    <Sparkles className="h-4 w-4" /> New listing intake
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Add a boutique residence to your portfolio</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Capture the story behind each home, from the precise location to the curated amenities and resident highlights. This intake sheet keeps your data consistent before publishing to marketing or leasing teams.
                                </p>
                            </div>
                            <Link
                                href="/properties"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300"
                            >
                                <Home className="h-4 w-4" /> Back to portfolio
                            </Link>
                        </div>
                        <Form
                            {...PropertyController.store.form()}
                            encType="multipart/form-data"
                            className="space-y-8"
                        >
                            {({ processing, errors }) => (
                                <PropertyForm
                                    errors={errors}
                                    processing={processing}
                                    formOptions={formOptions}
                                    property={property ?? undefined}
                                    submitLabel="Save property"
                                />
                            )}
                        </Form>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                            <MapPin className="h-4 w-4 text-slate-400" /> Location checklist
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>• Confirm walkability scores and commute notes</li>
                            <li>• Upload transportation and lifestyle highlights</li>
                            <li>• Cross-check zoning and pet policy guidelines</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                            <CalendarDays className="h-4 w-4 text-slate-400" /> Launch timeline
                        </h3>
                        <p className="mt-4 text-sm text-slate-600">
                            Align the availability date with your marketing cadence. Leasing teams can schedule pre-listing walkthroughs 48 hours after the form is submitted.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                            <Sparkles className="h-4 w-4 text-slate-400" /> Hospitality promise
                        </h3>
                        <p className="mt-4 text-sm text-slate-600">
                            Every new property receives a bespoke welcome kit, refreshed linens, and a hospitality-grade inspection to maintain the effortless elegance residents expect from your portfolio.
                        </p>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
