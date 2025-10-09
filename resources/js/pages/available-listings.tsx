import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { normalizeAmenities } from '@/lib/property';
import { resolvePaginationSummary } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { type PaginatedPublicProperties, type PublicProperty } from '@/types/property';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface AvailableListingsPageProps extends SharedData {
    properties: PaginatedPublicProperties;
    filters: string[];
    activeType: string;
    searchCriteria?: {
        location?: string | null;
        budget?: string | null;
        move_in?: string | null;
        type?: string | null;
    };
}

const defaultPropertyImage = '/images/property-placeholder.svg';

const formatCurrency = (value?: string | number | null) => {
    if (value === undefined || value === null || value === '') {
        return '—';
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return String(value);
    }

    return `₱${numeric.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`;
};

const resolveLocation = (property: PublicProperty) => {
    if (property.location) {
        return property.location;
    }

    return [property.street_address, property.barangay, property.city].filter(Boolean).join(', ');
};

const resolveImage = (property: PublicProperty) =>
    property.hero_image ?? property.availability_photo_url ?? defaultPropertyImage;

const formatAvailability = (property: PublicProperty) => {
    if (!property.availability_date) {
        return 'Availability upon request';
    }

    const date = new Date(property.availability_date);
    if (Number.isNaN(date.getTime())) {
        return 'Availability upon request';
    }

    return `Available from ${new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)}`;
};

const reserveProperty = (propertyId: number, auth: SharedData['auth']) => {
    const role = auth.user?.role?.toLowerCase();

    if (!auth.user) {
        router.visit(login());
        return;
    }

    if (role === 'tenant') {
        router.visit(`/reservations/properties/${propertyId}`);
        return;
    }

    router.visit(dashboard());
};

export default function AvailableListings() {
    const page = usePage<AvailableListingsPageProps>();
    const { auth, properties, filters, activeType, searchCriteria } = page.props;

    const propertyList = properties?.data ?? [];
    const paginationMeta = properties?.meta;
    const paginationLinks = properties?.links ?? [];
    const paginationSummary = resolvePaginationSummary(paginationMeta, propertyList.length);
    const totalResidences = paginationSummary.total;

    const handleFilterChange = (filter: string) => {
        if (filter === activeType) {
            return;
        }

        const url = page.url ?? '';
        const queryString = url.includes('?') ? url.split('?')[1] ?? '' : '';
        const params = new URLSearchParams(queryString);

        params.delete('page');

        if (filter === 'All') {
            params.delete('type');
        } else {
            params.set('type', filter);
        }

        const query = Object.fromEntries(params.entries());

        router.get('/available-listings', query, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const activeSearchCriteria = useMemo(() => {
        if (!searchCriteria) {
            return [] as string[];
        }

        const criteria: string[] = [];

        if (searchCriteria.location) {
            criteria.push(`Location: ${searchCriteria.location}`);
        }

        if (searchCriteria.budget) {
            criteria.push(`Budget: ${searchCriteria.budget}`);
        }

        if (searchCriteria.move_in) {
            criteria.push(`Move-in: ${searchCriteria.move_in}`);
        }

        if (searchCriteria.type && searchCriteria.type !== 'All') {
            criteria.push(`Property type: ${searchCriteria.type}`);
        }

        return criteria;
    }, [searchCriteria]);

    return (
        <>
            <Head title="Available Listings" />
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <PublicNavbar active="listings" />

                <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:px-12 lg:py-16">
                    <section className="space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                            Browse availability
                        </span>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold text-slate-900">Available apartments, condos, and lofts</h1>
                            <p className="max-w-3xl text-sm text-slate-600">
                                Compare verified listings with real-time pricing, tour availability, and amenity highlights. Request a concierge walkthrough or book a self-guided tour in minutes.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => handleFilterChange(filter)}
                                    className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                        activeType === filter
                                            ? 'border-blue-600 bg-blue-600/10 text-blue-700'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                    }`}
                                >
                                    {filter === 'All' ? 'All residences' : filter}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>Verified pricing and incentives updated every hour</span>
                            <span>Virtual and in-person tours coordinated by our concierge team</span>
                            <span>Pet-friendly and furnished options available on request</span>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    {totalResidences} curated residences
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Select a home to request a personalized tour itinerary or compare incentives side by side.
                                </p>
                                {activeSearchCriteria.length > 0 ? (
                                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white/95 p-4 text-xs text-slate-600 shadow-sm">
                                        <p className="font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            Search filters
                                        </p>
                                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-slate-600">
                                            {activeSearchCriteria.map((item) => (
                                                <li key={item} className="rounded-full bg-slate-100 px-3 py-1">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                                <Link
                                    href="/map-tracker"
                                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-slate-700 transition-colors duration-200 hover:border-slate-400"
                                >
                                    View these homes on the map
                                </Link>
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                    Build my shortlist
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {propertyList.length > 0 ? (
                                propertyList.map((property) => {
                                    const amenities = normalizeAmenities(property.amenities);

                                    return (
                                        <article
                                            key={property.id}
                                            className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 transition-transform duration-200 hover:-translate-y-1"
                                        >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={resolveImage(property)}
                                                alt={property.name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                                                {property.type ?? 'Residence'}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col gap-4 p-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h3 className="text-xl font-semibold text-slate-900">{property.name}</h3>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {formatCurrency(property.monthly_rent)}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-slate-500">{resolveLocation(property)}</p>
                                                <p className="text-sm text-slate-600">
                                                    {property.description ?? 'Concierge notes will be added soon.'}
                                                </p>
                                            </div>
                                            <ul className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                                                {amenities.length > 0 ? (
                                                    amenities.map((amenity, index) => (
                                                        <li
                                                            key={`${amenity}-${index}`}
                                                            className="rounded-full bg-slate-100 px-3 py-1"
                                                        >
                                                            {amenity}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="rounded-full bg-slate-100 px-3 py-1 text-slate-400">
                                                        Amenities coming soon
                                                    </li>
                                                )}
                                            </ul>
                                            <div className="mt-auto space-y-3 text-sm text-slate-600">
                                                <div className="flex flex-wrap gap-4 font-medium text-slate-700">
                                                    <span>{property.bedrooms ?? '—'} bedrooms</span>
                                                    <span>{property.bathrooms ?? '—'} baths</span>
                                                    <span>{property.square_footage ?? 'Size TBA'}</span>
                                                </div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                                    {formatAvailability(property)}
                                                </p>
                                                <div className="flex flex-wrap gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => reserveProperty(property.id, auth)}
                                                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition-colors duration-200 hover:bg-blue-700"
                                                    >
                                                        Reserve this Property
                                                    </button>
                                                    <Link
                                                        href={auth.user ? dashboard() : login()}
                                                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-400 hover:text-slate-900"
                                                    >
                                                        Save to compare
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                    );
                                })
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                                    <p className="text-base font-semibold text-slate-700">
                                        No residences match your filters yet.
                                    </p>
                                    <p>Adjust the property type or explore all listings to see more options.</p>
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange('All')}
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow transition-transform duration-200 hover:-translate-y-0.5"
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">
                                Showing {paginationSummary.from} to {paginationSummary.to} of {paginationSummary.total} properties
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
                                            preserveState
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </main>

                <PublicFooter className="mt-12" />
            </div>
        </>
    );
}
