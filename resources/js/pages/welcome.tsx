import FormSelect from '@/components/form-select';
import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { normalizeAmenities } from '@/lib/property';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { type PublicProperty } from '@/types/property';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Bath,
    BedDouble,
    Building2,
    Heart,
    MapPin,
    Ruler,
    Search,
    Star,
} from 'lucide-react';
import { type FormEvent } from 'react';

const residentStories = [
    {
        name: 'Evelyn Hart',
        location: 'Moved to Harborview Residences',
        quote:
            '“The Dagupan E-Finder concierge handled everything – from previewing the amenities to negotiating the move-in date. The views are unbelievable.”',
        image:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
        rating: 5,
    },
    {
        name: 'Marcus & Talia',
        location: 'Leasing at Midtown Skyline Lofts',
        quote:
            '“We wanted a modern downtown loft with a home office. Within 48 hours we had three virtual tours booked and signed the lease the same week.”',
        image:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        rating: 5,
    },
    {
        name: 'The Mercer Family',
        location: 'Residing at Aurora Park Condominiums',
        quote:
            '“The playground, pet spa, and school district made Aurora Park a perfect fit. Dagupan E-Finder made touring with our kids stress-free.”',
        image:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
        rating: 5,
    },
];

const metrics = [
    {
        label: 'Verified buildings',
        value: '180+',
        helper: 'Professionally managed and inspected',
    },
    {
        label: 'Tours scheduled this week',
        value: '320',
        helper: 'Hosted by local leasing experts',
    },
    {
        label: 'Resident satisfaction',
        value: '4.9/5',
        helper: 'Based on 1,400+ verified reviews',
    },
];

const propertyTypeOptions = [
    { value: 'Apartment', label: 'Luxury apartment' },
    { value: 'Condo', label: 'High-rise condo' },
    { value: 'Townhome', label: 'Townhome' },
    { value: 'Penthouse', label: 'Penthouse' },
];

const budgetOptions = [
    { value: '500-1000', label: '₱500 – ₱1,000' },
    { value: '1000-1500', label: '₱1,000 – ₱1,500' },
    { value: '1500-2000', label: '₱1,500 – ₱2,000' },
    { value: '2000-2500', label: '₱2,000 – ₱2,500' },
    { value: '2500-3000', label: '₱2,500 – ₱3,000' },
    { value: '3000-4000', label: '₱3,000 – ₱4,000' },
    { value: '4000+', label: '₱4,000+' },
];

const moveInOptions = [
    { value: 'within_30_days', label: 'Within 30 days' },
    { value: '60_90_days', label: '60 - 90 days' },
    { value: '3_6_months', label: '3 - 6 months' },
    { value: 'exploring', label: 'Exploring options' },
];

interface WelcomePageProps extends SharedData {
    featuredProperties: PublicProperty[];
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

    return [property.barangay, property.city].filter(Boolean).join(', ');
};

const resolveImage = (property: PublicProperty) =>
    property.hero_image ?? property.availability_photo_url ?? defaultPropertyImage;

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

export default function Welcome() {
    const { auth, featuredProperties } = usePage<WelcomePageProps>().props;
    const { data, setData, post, processing } = useForm({
        location: '',
        property_type: propertyTypeOptions[0]?.value ?? '',
        monthly_budget: budgetOptions[0]?.value ?? '',
        move_in: moveInOptions[0]?.value ?? '',
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/availability-request');
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.bunny.net/css?family=manrope:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <PublicNavbar active="home" />

                <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12 lg:px-12 lg:py-16">
                    <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                                <Building2 className="h-4 w-4" /> Premium rentals, ready when you are
                            </div>
                            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                                Discover apartments and condos curated for modern city living.
                            </h1>
                            <p className="max-w-xl text-lg text-slate-600">
                                From waterfront penthouses to downtown lofts, Dagupan E-Finder connects you with residences that fit your lifestyle, commute, and wish list — all backed by local leasing specialists.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href="/available-listings"
                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                    Browse available homes
                                </Link>
                                <Link
                                    href={auth.user ? dashboard() : register()}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400"
                                >
                                    Talk to a concierge
                                </Link>
                            </div>
                            <dl className="grid gap-6 sm:grid-cols-3">
                                {metrics.map((metric) => (
                                    <div key={metric.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                                        <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            {metric.label}
                                        </dt>
                                        <dd className="mt-3 text-2xl font-semibold text-slate-900">{metric.value}</dd>
                                        <p className="text-sm text-slate-500">{metric.helper}</p>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
                                alt="Modern apartment interior"
                                className="absolute inset-0 h-full w-full object-cover opacity-80"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-800/70" />
                            <div className="relative flex h-full flex-col justify-between p-8">
                                <div className="space-y-3">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                                        Now leasing
                                    </span>
                                    <p className="text-sm uppercase tracking-[0.4em] text-white/50">Featured residence</p>
                                    <h3 className="text-2xl font-semibold">Skyline Terrace Penthouse</h3>
                                    <p className="flex items-center gap-2 text-sm text-white/70">
                                        <MapPin className="h-4 w-4" /> Financial District, San Francisco
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                                        <span className="flex items-center gap-2">
                                            <BedDouble className="h-4 w-4" /> 3 beds
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Bath className="h-4 w-4" /> 2.5 baths
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Ruler className="h-4 w-4" /> 1,860 sq ft
                                        </span>
                                    </div>
                                    <p className="mt-4 text-lg font-semibold text-white">
                                        $5,450 <span className="text-sm font-medium text-white/70">/ month</span>
                                    </p>
                                    <p className="text-sm text-white/70">Private rooftop lounge • Valet parking • Smart home technology</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="availability" className="space-y-6 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                                <Search className="h-4 w-4" /> Check availability
                            </span>
                            <h2 className="text-3xl font-semibold text-slate-900">Begin your rental search in minutes.</h2>
                            <p className="max-w-3xl text-sm text-slate-600">
                                Select your preferred neighborhood, monthly budget, and move-in timeline. A concierge will confirm current availability and schedule a private tour for you.
                            </p>
                        </div>
                        <form className="grid gap-5 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                <span className="font-semibold text-slate-800">Neighborhood or city</span>
                                <input
                                    type="text"
                                    placeholder="Capitol Hill, Seattle"
                                    value={data.location}
                                    onChange={(event) => setData('location', event.target.value)}
                                    className="h-12 rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                <span className="font-semibold text-slate-800">Property type</span>
                                <FormSelect
                                    value={data.property_type}
                                    onValueChange={(value) => setData('property_type', value)}
                                    options={propertyTypeOptions}
                                    triggerClassName="rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                    contentClassName="border-slate-200 bg-white"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                <span className="font-semibold text-slate-800">Monthly budget</span>
                                <FormSelect
                                    value={data.monthly_budget}
                                    onValueChange={(value) => setData('monthly_budget', value)}
                                    options={budgetOptions}
                                    triggerClassName="rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                    contentClassName="border-slate-200 bg-white"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-600">
                                <span className="font-semibold text-slate-800">Move-in timeframe</span>
                                <FormSelect
                                    value={data.move_in}
                                    onValueChange={(value) => setData('move_in', value)}
                                    options={moveInOptions}
                                    triggerClassName="rounded-2xl border border-slate-200/80 bg-white/90 px-4 text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                                    contentClassName="border-slate-200 bg-white"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={processing}
                                className="md:col-span-2 lg:col-span-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {processing ? 'Submitting request…' : 'Request availability report'}
                            </button>
                        </form>
                        <p className="text-xs text-slate-500">
                            Availability updates every hour. We’ll confirm pricing, incentives, and pet policies for every home you select.
                        </p>
                    </section>

                    <section id="featured" className="space-y-8">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                                    Featured apartments this week
                                </span>
                                <h2 className="text-3xl font-semibold text-slate-900">
                                    Explore residences ready for immediate move-in.
                                </h2>
                                <p className="max-w-3xl text-sm text-slate-600">
                                    Each listing includes transparent pricing, verified photography, amenity highlights, and upcoming tour availability so you can compare options confidently.
                                </p>
                            </div>
                            <Link
                                href="/map-tracker"
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400"
                            >
                                Explore on the map
                            </Link>
                        </div>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {featuredProperties.length > 0 ? (
                                featuredProperties.map((property) => {
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
                                                {property.status ?? 'Available now'}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col gap-4 p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-slate-900">{property.name}</h3>
                                                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                                        <MapPin className="h-4 w-4" /> {resolveLocation(property) || 'Location to be announced'}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition-colors duration-200 hover:border-blue-200 hover:text-blue-600"
                                                    aria-label="Save residence"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
                                                <span className="flex items-center gap-2">
                                                    <BedDouble className="h-4 w-4" /> {property.bedrooms ?? '—'} beds
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Bath className="h-4 w-4" /> {property.bathrooms ?? '—'} baths
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Ruler className="h-4 w-4" /> {property.square_footage ?? 'Size TBA'}
                                                </span>
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
                                            <div className="mt-auto space-y-2">
                                                <p className="text-lg font-semibold text-slate-900">{formatCurrency(property.monthly_rent)}</p>
                                                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                                    {property.availability_date
                                                        ? `Available from ${new Intl.DateTimeFormat('en-PH', {
                                                              month: 'short',
                                                              day: 'numeric',
                                                              year: 'numeric',
                                                          }).format(new Date(property.availability_date))}`
                                                        : 'Availability upon request'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => reserveProperty(property.id, auth)}
                                                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow transition-transform duration-200 hover:-translate-y-0.5"
                                                >
                                                    Reserve this Property
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                    );
                                })
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                                    <p className="text-base font-semibold text-slate-700">No new residences published this week yet.</p>
                                    <p>Check back soon or explore our full availability list.</p>
                                    <Link
                                        href="/available-listings"
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow transition-transform duration-200 hover:-translate-y-0.5"
                                    >
                                        Browse all listings
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>

                    <section id="stories" className="space-y-8">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                                Resident stories
                            </span>
                            <h2 className="text-3xl font-semibold text-slate-900">What our residents love about living with Dagupan E-Finder.</h2>
                            <p className="max-w-3xl text-sm text-slate-600">
                                Hear from residents who recently leased apartments and condos through our concierge team.
                            </p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            {residentStories.map((story) => (
                                <article
                                    key={story.name}
                                    className="flex h-full flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={story.image}
                                            alt={story.name}
                                            className="h-14 w-14 rounded-full object-cover"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{story.name}</p>
                                            <p className="text-xs text-slate-500">{story.location}</p>
                                            <div className="mt-1 flex items-center gap-1 text-amber-400">
                                                {Array.from({ length: story.rating }).map((_, index) => (
                                                    <Star key={index} className="h-4 w-4 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-600">{story.quote}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-3xl bg-white p-10 shadow-lg ring-1 ring-slate-200">
                        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-4">
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                                    Ready to move?
                                </span>
                                <h2 className="text-3xl font-semibold text-slate-900">We’ll prepare a personalized move-in plan.</h2>
                                <p className="text-sm text-slate-600">
                                    Share your desired neighborhoods, commute preferences, and amenity must-haves. Within 24 hours a Dagupan E-Finder concierge will deliver three tailored options with transparent pricing and move-in incentives.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={auth.user ? dashboard() : register()}
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                                    >
                                        Create my rental profile
                                    </Link>
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-400"
                                    >
                                        View concierge packages
                                    </Link>
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80"
                                    alt="Concierge team assisting residents"
                                    className="absolute inset-0 h-full w-full object-cover opacity-90"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/70" />
                                <div className="relative flex h-full flex-col justify-end gap-3 p-8">
                                    <p className="text-sm uppercase tracking-[0.4em] text-white/60">Concierge snapshot</p>
                                    <h3 className="text-2xl font-semibold">92% of residents renew with us</h3>
                                    <p className="text-sm text-white/80">
                                        Trusted by relocating professionals, executives, and families seeking flexible luxury rentals across premier U.S. cities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <PublicFooter className="mt-12" />
            </div>
        </>
    );
}
