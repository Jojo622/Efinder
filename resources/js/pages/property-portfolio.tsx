import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Bath, BedDouble, Building2, Filter, MapPinned, MoveRight, Ruler } from 'lucide-react';

type Property = {
    id: number;
    user_id: number;
    name: string;
    type: string;
    status: string;
    monthly_rent?: string | number | null;
    security_deposit?: string | number | null;
    location?: string | null;
    street_address: string;
    city: string;
    barangay: string;
    latitude?: string | number | null;
    longitude?: string | number | null;
    bedrooms?: string | null;
    bathrooms?: string | null;
    square_footage?: string | null;
    parking_spaces?: string | null;
    availability_date?: string | null;
    lease_term?: string | null;
    contact_name?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    amenities?: string | null;
    description?: string | null;
    hero_image?: string | null;
    gallery_images?: string[] | null;
    pet_policy?: string | null;
    notes?: string | null;
    availability_photo_path?: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        name: string;
        email: string;
        role: string;
    } | null;
};

type PropertyPortfolioProps = {
    properties: Property[];
    filters: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Property Portfolio',
        href: '/properties',
    },
];

const PLACEHOLDER_IMAGE =
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80';

type FilterValue = 'All' | string;

export default function PropertyPortfolio({ properties, filters }: PropertyPortfolioProps) {
    const [activeFilter, setActiveFilter] = useState<FilterValue>('All');

    const propertyTypes = useMemo(
        () => ['All', ...Array.from(new Set(filters))] as FilterValue[],
        [filters],
    );

    const totalUnits = properties.length;
    const averageRentValue =
        totalUnits === 0
            ? 0
            : properties.reduce((sum, listing) => {
                  const numeric = Number(listing.monthly_rent ?? 0);
                  return sum + (Number.isFinite(numeric) ? numeric : 0);
              }, 0) / totalUnits;
    const averageRent =
        totalUnits === 0
            ? '—'
            : `₱${Number(averageRentValue).toLocaleString('en-PH', {
                  minimumFractionDigits: 0,
              })}`;

    const groupedByType = useMemo(() => {
        return properties.reduce<Record<string, number>>((acc, listing) => {
            acc[listing.type] = (acc[listing.type] ?? 0) + 1;
            return acc;
        }, {});
    }, [properties]);

    const filteredListings = useMemo(() => {
        if (activeFilter === 'All') {
            return properties;
        }

        return properties.filter((listing) => listing.type === activeFilter);
    }, [activeFilter, properties]);

    const formatCurrency = (value?: string | number | null) => {
        if (value === undefined || value === null || value === '') {
            return '—';
        }

        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
            return String(value);
        }

        return `₱${numeric.toLocaleString('en-PH', {
            minimumFractionDigits: 0,
        })}`;
    };

    const extractHighlights = (value?: string | null, limit?: number) => {
        if (!value) {
            return [];
        }

        const highlights = value
            .split(/[\r\n,]+/)
            .map((highlight) => highlight.trim())
            .filter((highlight) => highlight.length > 0);

        if (typeof limit === 'number') {
            return highlights.slice(0, limit);
        }

        return highlights;
    };

    const resolveImage = (listing: Property) => {
        const galleryImages = Array.isArray(listing.gallery_images) ? listing.gallery_images : [];

        if (galleryImages.length > 0) {
            const firstImage = galleryImages[0];
            return firstImage.startsWith('http') ? firstImage : `/storage/${firstImage}`;
        }

        if (listing.availability_photo_path) {
            return `/storage/${listing.availability_photo_path}`;
        }

        if (listing.hero_image) {
            return listing.hero_image;
        }

        return PLACEHOLDER_IMAGE;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Property Portfolio" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.65)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -left-32 top-12 h-72 w-72 stroke-sky-200/40" />
                    <div className="relative z-10 flex flex-col gap-8">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                                    Property portfolio
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                                    Curated residences under active management
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                    Track performance, availability, and experience standards across your luxury rentals. Filter by
                                    residence type or jump into a listing to review amenities before your leasing team shares it with
                                    prospects.
                                </p>
                            </div>
                            <Link
                                href="/properties/create"
                                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-500 hover:-translate-y-0.5 hover:shadow-2xl"
                            >
                                <MoveRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                                Add New Property
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-sky-200/60 bg-sky-50/80 p-6 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Managed homes
                                </p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">{totalUnits}</p>
                                <p className="text-sm text-slate-500">Across {Object.keys(groupedByType).length} distinct collections</p>
                            </div>
                            <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/80 p-6 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Average monthly rent
                                </p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">{averageRent}</p>
                                <p className="text-sm text-slate-500">Premium positioning across metro micro-markets</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Concierge team
                                </p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">24/7</p>
                                <p className="text-sm text-slate-500">Full-service coordination for tours and move-ins</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-6 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Occupancy outlook</p>
                                <p className="mt-3 text-3xl font-semibold text-emerald-600">92%</p>
                                <p className="text-sm text-emerald-500">Healthy pipeline and strong retention rates</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm">
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                <Filter className="h-4 w-4 text-slate-400" />
                                Filter by residence type
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {propertyTypes.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                                            activeFilter === filter
                                                ? 'border-blue-600 bg-blue-600/10 text-blue-700'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                        }`}
                                    >
                                        {filter === 'All' ? 'All residences' : filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    {filteredListings.length} active {activeFilter === 'All' ? 'homes' : activeFilter.toLowerCase() + 's'}
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Each residence includes verified amenities, curated photography, and concierge notes for private tours.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                                <Link
                                    href="/map-tracker"
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition-colors duration-200 hover:border-slate-400"
                                >
                                    <MapPinned className="h-4 w-4" /> View on smart map
                                </Link>
                                <Link
                                    href="/available-listings"
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800"
                                >
                                    <Building2 className="h-4 w-4" /> Public facing gallery
                                </Link>
                            </div>
                        </div>

                        {filteredListings.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center text-sm text-slate-500">
                                No properties found for this collection yet. Add a new residence to get started.
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {filteredListings.map((listing) => {
                                    const locationLabel = listing.location
                                        ? listing.location
                                        : `${listing.barangay}, ${listing.city}`;
                                    const highlights = extractHighlights(listing.amenities);
                                    const description =
                                        listing.description && listing.description.length > 0
                                            ? listing.description
                                            : 'This property is ready for onboarding. Add lifestyle notes and concierge details to complete the listing profile.';
                                    const toursLabel = listing.status;

                                    return (
                                        <article
                                            key={listing.id}
                                            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.6)] transition-transform duration-300 hover:-translate-y-1"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={resolveImage(listing)}
                                                    alt={listing.name}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                                                    {listing.type}
                                                </span>
                                            </div>
                                            <div className="flex flex-1 flex-col gap-5 p-6">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-slate-900">{listing.name}</h3>
                                                        <p className="text-sm text-slate-500">{locationLabel}</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(listing.monthly_rent)} / month
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-600">{description}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                                                    <span className="inline-flex items-center gap-1">
                                                        <BedDouble className="h-4 w-4 text-slate-400" />
                                                        {listing.bedrooms && listing.bedrooms.length > 0
                                                            ? `${listing.bedrooms} bedrooms`
                                                            : 'Bedrooms TBD'}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Bath className="h-4 w-4 text-slate-400" />
                                                        {listing.bathrooms && listing.bathrooms.length > 0
                                                            ? `${listing.bathrooms} baths`
                                                            : 'Baths TBD'}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Ruler className="h-4 w-4 text-slate-400" />
                                                        {listing.square_footage && listing.square_footage.length > 0
                                                            ? listing.square_footage
                                                            : 'Floor area TBD'}
                                                    </span>
                                                </div>
                                                <ul className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                    {highlights.length > 0 ? (
                                                        highlights.map((highlight, index) => (
                                                            <li
                                                                key={`${highlight}-${index}`}
                                                                className="rounded-full bg-slate-100 px-3 py-1 font-medium"
                                                            >
                                                                {highlight}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-400">
                                                            Add amenity highlights
                                                        </li>
                                                    )}
                                                </ul>
                                                <div className="mt-auto flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                                    <span>{toursLabel}</span>
                                                    <span>Concierge ready</span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <aside className="relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_35px_80px_-60px_rgba(15,23,42,0.6)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-sky-100/50" />
                        <div className="relative z-10 space-y-6">
                            <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">Collections</p>
                                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                                    {Object.entries(groupedByType).map(([type, count]) => (
                                        <li key={type} className="flex items-center justify-between">
                                            <span className="font-medium text-slate-900">{type}</span>
                                            <span>{count} homes</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/80 p-5 text-slate-700">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">Leasing Rhythm</p>
                                <p className="mt-3 text-lg font-semibold text-slate-900">12 curated tours scheduled this week</p>
                                <p className="mt-2 text-sm text-slate-600">
                                    Agents have concierge briefs for every showing, including floor plans, staging notes, and neighborhood highlights.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/80 p-5 text-slate-700">
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Quality Assurance</p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li>• Weekly inspections on hospitality-ready suites</li>
                                    <li>• Smart-home diagnostics synced every 12 hours</li>
                                    <li>• Hospitality-grade housekeeping after each tour</li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </AppLayout>
    );
}
