import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PropertyShowProps {
    property: {
        id: number;
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
        user?: {
            name: string;
            email: string;
            role: string;
        } | null;
    };
}

const breadcrumbs = (property: PropertyShowProps['property']): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Property Portfolio',
        href: '/properties',
    },
    {
        title: property.name,
        href: `/properties/${property.id}`,
    },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80';

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

export default function ShowProperty({ property }: PropertyShowProps) {
    const galleryImages = useMemo<string[]>(() => {
        const storedImages = Array.isArray(property.gallery_images) ? property.gallery_images : [];

        const normalised = storedImages
            .map((image) => image?.trim())
            .filter((image): image is string => Boolean(image))
            .map((image) => (image.startsWith('http') ? image : `/storage/${image}`));

        if (normalised.length > 0) {
            return normalised;
        }

        const fallback: string[] = [];

        if (property.availability_photo_path) {
            fallback.push(`/storage/${property.availability_photo_path}`);
        }

        if (property.hero_image) {
            fallback.push(property.hero_image);
        }

        return fallback.length > 0 ? fallback : [FALLBACK_IMAGE];
    }, [property.gallery_images, property.availability_photo_path, property.hero_image]);

    const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);

    useEffect(() => {
        setActiveImage(galleryImages[0]);
    }, [galleryImages]);

    return (
        <AppLayout breadcrumbs={breadcrumbs(property)}>
            <Head title={property.name} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-12 pt-6 lg:px-12">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">{property.name}</h1>
                        <p className="text-sm text-slate-600">{property.type} • {property.city}</p>
                    </div>
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to portfolio
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Gallery</h2>
                            <div className="mt-4 space-y-4">
                                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                    <img
                                        src={activeImage}
                                        alt={`Primary gallery image for ${property.name}`}
                                        className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                {galleryImages.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {galleryImages.map((image) => (
                                            <button
                                                key={image}
                                                type="button"
                                                onClick={() => setActiveImage(image)}
                                                className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                                                    activeImage === image
                                                        ? 'border-slate-900 shadow-sm'
                                                        : 'border-transparent hover:border-slate-300'
                                                }`}
                                                aria-pressed={activeImage === image}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Gallery thumbnail for ${property.name}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
                            <dl className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                                <div>
                                    <dt className="font-semibold text-slate-800">Monthly rent</dt>
                                    <dd>{formatCurrency(property.monthly_rent)}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-800">Security deposit</dt>
                                    <dd>{formatCurrency(property.security_deposit)}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-800">Location</dt>
                                    <dd>
                                        {property.street_address}, {property.barangay}, {property.city}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-800">Availability</dt>
                                    <dd>{property.availability_date ?? 'TBD'}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-800">Lease term</dt>
                                    <dd>{property.lease_term ?? '—'}</dd>
                                </div>
                                <div>
                                    <dt className="font-semibold text-slate-800">Bedrooms / Bathrooms</dt>
                                    <dd>
                                        {property.bedrooms ?? '—'} / {property.bathrooms ?? '—'}
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                            <p className="mt-4 text-sm text-slate-600">
                                {property.description ?? 'No lifestyle description provided yet.'}
                            </p>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900">Amenities & Policies</h2>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800">Amenity highlights</h3>
                                    <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                                        {property.amenities ?? 'Add amenity notes to highlight the experience.'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800">Pet policy</h3>
                                    <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                                        {property.pet_policy ?? 'Share any pet inclusions, restrictions, or additional fees.'}
                                    </p>
                                </div>
                            </div>
                            {property.notes && (
                                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                                    <strong className="block font-semibold text-slate-800">Internal notes</strong>
                                    <span className="whitespace-pre-line">{property.notes}</span>
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-6">
                        {property.user && (
                            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-slate-900">Property owner</h2>
                                <p className="mt-2 text-sm text-slate-600">{property.user.name}</p>
                                <p className="text-xs text-slate-500">{property.user.email}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">{property.user.role}</p>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
