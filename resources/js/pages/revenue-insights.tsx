import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowUpRight, BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Revenue Insights',
        href: '/revenue-insights',
    },
];

const propertyPerformance = [
    {
        id: 1,
        property: 'Azure Heights',
        occupancy: '97%',
        adr: '$3,420',
        yoy: '+6.2%',
        contribution: '28% portfolio revenue',
    },
    {
        id: 2,
        property: 'Harbor Residences',
        occupancy: '93%',
        adr: '$4,050',
        yoy: '+4.9%',
        contribution: '24% portfolio revenue',
    },
    {
        id: 3,
        property: 'Riverfront Lofts',
        occupancy: '91%',
        adr: '$2,880',
        yoy: '+7.4%',
        contribution: '18% portfolio revenue',
    },
    {
        id: 4,
        property: 'Lakeside Residences',
        occupancy: '95%',
        adr: '$3,120',
        yoy: '+5.1%',
        contribution: '15% portfolio revenue',
    },
];

export default function RevenueInsights() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue Insights" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-900 opacity-95" />
                    <PlaceholderPattern className="absolute -left-24 top-4 h-80 w-80 stroke-white/10" />
                    <div className="relative z-10 flex flex-col gap-8 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                                    <PieChart className="h-4 w-4" /> Portfolio intelligence
                                </span>
                                <h1 className="text-3xl font-semibold">Revenue pulse across the collection</h1>
                                <p className="max-w-2xl text-sm text-white/75">
                                    Track occupancy, ADR, and year-over-year momentum at a glance. Forecasting models factor in concierge demand patterns and premium amenity upsells.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm text-white/80 shadow-lg backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Quarter snapshot</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-lg font-semibold text-white">$4.8M gross revenue</p>
                                    <p>+8.5% vs prior quarter · Forecast variance ±1.2%</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Occupancy</p>
                                <p className="mt-3 text-3xl font-semibold">94.2%</p>
                                <p className="text-sm text-white/70">Weighted across all hospitality suites</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">ADR</p>
                                <p className="mt-3 text-3xl font-semibold">$3,345</p>
                                <p className="text-sm text-white/70">Average daily revenue per occupied residence</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Renewal uplift</p>
                                <p className="mt-3 text-3xl font-semibold">+5.8%</p>
                                <p className="text-sm text-white/70">Premium secured during concierge negotiations</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Ancillary</p>
                                <p className="mt-3 text-3xl font-semibold">$420K</p>
                                <p className="text-sm text-white/70">Spa, valet & private dining upsells</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                        <div className="border-b border-slate-200/70 bg-slate-50/60 px-6 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Property performance</h2>
                        </div>
                        <div className="overflow-x-auto px-2">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                <thead>
                                    <tr className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                        <th scope="col" className="py-3 pl-4 pr-4 font-semibold">Property</th>
                                        <th scope="col" className="py-3 pr-4 font-semibold">Occupancy</th>
                                        <th scope="col" className="py-3 pr-4 font-semibold">ADR</th>
                                        <th scope="col" className="py-3 pr-4 font-semibold">YoY lift</th>
                                        <th scope="col" className="py-3 pr-4 font-semibold">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {propertyPerformance.map((property) => (
                                        <tr key={property.id} className="transition-colors duration-200 hover:bg-slate-50/70">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-4">
                                                <div className="font-semibold text-slate-900">{property.property}</div>
                                                <div className="text-xs text-slate-500">Luxury hospitality collection</div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 font-medium text-slate-700">{property.occupancy}</td>
                                            <td className="whitespace-nowrap py-4 pr-4 font-semibold text-slate-900">{property.adr}</td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-sm text-emerald-600">{property.yoy}</td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">{property.contribution}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Forecast drivers</h3>
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 text-sm text-slate-600">
                                <TrendingUp className="mt-1 h-4 w-4 text-slate-500" />
                                <div>
                                    <p className="font-semibold text-slate-900">Demand pacing</p>
                                    <p className="text-xs text-slate-500">Lead volume tracking 12% ahead of last quarter from relocation partners.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 text-sm text-slate-600">
                                <LineChart className="mt-1 h-4 w-4 text-slate-500" />
                                <div>
                                    <p className="font-semibold text-slate-900">ADR optimization</p>
                                    <p className="text-xs text-slate-500">Dynamic pricing model recommends +3.2% nightly rate lift for waterfront units.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-3 text-sm text-slate-600">
                                <BarChart3 className="mt-1 h-4 w-4 text-slate-500" />
                                <div>
                                    <p className="font-semibold text-slate-900">Amenity revenue</p>
                                    <p className="text-xs text-slate-500">Private dining & spa programs pacing +18% with loyalty packaging.</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm text-slate-600">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Executive insight</p>
                            <p className="mt-3 font-semibold text-slate-900">Next focus: launch predictive renewal dashboard</p>
                            <p className="mt-2 text-xs text-slate-500">Model will surface concierge interventions needed 90 days before lease maturity.</p>
                            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                <ArrowUpRight className="h-3.5 w-3.5" /> Beta pilot begins May 2025
                            </p>
                        </div>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
