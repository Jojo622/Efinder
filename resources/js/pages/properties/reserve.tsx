import AppLayout from '@/layouts/app-layout';
import useGoogleMapsApi from '@/hooks/use-google-maps-api';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { type PublicProperty } from '@/types/property';
import { Head, useForm } from '@inertiajs/react';
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PropertyReserveProps {
    property: PublicProperty;
}

type GoogleMapInstance = {
    setOptions(options: { center?: { lat: number; lng: number }; zoom?: number; disableDefaultUI?: boolean; clickableIcons?: boolean }): void;
};

type GoogleMarker = {
    setMap(map: GoogleMapInstance | null): void;
};

const defaultPropertyImage = '/images/property-placeholder.svg';

const breadcrumbs = (property: PublicProperty): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Available Listings',
        href: '/available-listings',
    },
    {
        title: property.name,
        href: `/reservations/properties/${property.id}`,
    },
];

const resolveImage = (property: PublicProperty) =>
    property.hero_image ?? property.availability_photo_url ?? defaultPropertyImage;

const resolveLocation = (property: PublicProperty) => {
    if (property.location) {
        return property.location;
    }

    return [property.street_address, property.barangay, property.city].filter(Boolean).join(', ');
};

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

const formatAvailability = (property: PublicProperty) => {
    if (!property.availability_date) {
        return 'Availability upon request';
    }

    const date = new Date(property.availability_date);
    if (Number.isNaN(date.getTime())) {
        return 'Availability upon request';
    }

    return new Intl.DateTimeFormat('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

const generateReference = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const charactersLength = characters.length;

    return Array.from({ length: 10 }, () => characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
};

const formatDateTime = (value: string | null) => {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const reservationTypeOptions = [
    { value: 'Standard', label: 'Standard reservation' },
    { value: 'Private Tour', label: 'Private tour' },
    { value: 'Virtual Tour', label: 'Virtual tour' },
    { value: 'Self-Guided Tour', label: 'Self-guided tour' },
    { value: 'Concierge Stay', label: 'Concierge stay' },
    { value: 'Corporate Stay', label: 'Corporate stay' },
];

function PropertyLocationMap({ property }: { property: PublicProperty }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const status = useGoogleMapsApi({ apiKey, libraries: ['maps'] });
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
    const markerRef = useRef<GoogleMarker | null>(null);

    const hasCoordinates = useMemo(
        () => property.latitude !== null && property.longitude !== null,
        [property.latitude, property.longitude],
    );

    useEffect(() => {
        if (!hasCoordinates || status !== 'ready' || !mapContainerRef.current) {
            return;
        }

        const googleMaps = (window as typeof window & { google?: { maps?: { Map: new (element: HTMLElement, options?: unknown) => GoogleMapInstance; Marker: new (options: { position: { lat: number; lng: number }; map: GoogleMapInstance; title?: string }) => GoogleMarker } } }).google;
        if (!googleMaps?.maps) {
            return;
        }

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new googleMaps.maps.Map(mapContainerRef.current, {
                disableDefaultUI: true,
                clickableIcons: false,
            });
        }

        const map = mapInstanceRef.current;
        const position = { lat: Number(property.latitude), lng: Number(property.longitude) };

        map.setOptions({ center: position, zoom: 15, disableDefaultUI: true, clickableIcons: false });

        if (markerRef.current) {
            markerRef.current.setMap(null);
        }

        markerRef.current = new googleMaps.maps.Marker({
            position,
            map,
            title: property.name,
        });

        return () => {
            markerRef.current?.setMap(null);
        };
    }, [hasCoordinates, property.latitude, property.longitude, property.name, status]);

    if (!hasCoordinates) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                Latitude and longitude have not been provided for this property yet.
            </div>
        );
    }

    if (status === 'missing') {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                Add a valid <code className="font-medium">VITE_GOOGLE_MAPS_API_KEY</code> to visualize the property location.
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-red-600">
                Google Maps could not be loaded. Confirm that billing is enabled and the Maps JavaScript API is allowed.
            </div>
        );
    }

    return <div ref={mapContainerRef} className="h-full w-full rounded-3xl" />;
}

export default function ReserveProperty({ property }: PropertyReserveProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        property_id: property.id,
        reservation_type: reservationTypeOptions[0]?.value ?? 'Standard',
        notes: '',
        reference: '',
        starts_at: '',
        ends_at: '',
        reservation: '',
    });

    const activeReservation = property.active_reservation;

    const isCurrentlyReserved = useMemo(() => {
        if (!activeReservation) {
            return false;
        }

        const now = Date.now();
        const startsAtValue = activeReservation.starts_at ? new Date(activeReservation.starts_at).getTime() : Number.NaN;
        const endsAtValue = activeReservation.ends_at
            ? new Date(activeReservation.ends_at).getTime()
            : Number.POSITIVE_INFINITY;

        if (Number.isNaN(startsAtValue) || startsAtValue > now) {
            return false;
        }

        if (!Number.isFinite(endsAtValue)) {
            return true;
        }

        return now < endsAtValue;
    }, [activeReservation]);

    const reservedUntilLabel = useMemo(() => {
        if (!isCurrentlyReserved || !activeReservation?.ends_at) {
            return null;
        }

        return formatDateTime(activeReservation.ends_at);
    }, [activeReservation, isCurrentlyReserved]);

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);

        if (open) {
            const startsAt = new Date();
            const endsAt = new Date(startsAt.getTime() + 24 * 60 * 60 * 1000);

            setData('reference', generateReference());
            setData('starts_at', startsAt.toISOString());
            setData('ends_at', endsAt.toISOString());
        } else {
            reset('reservation_type', 'notes', 'reference', 'starts_at', 'ends_at', 'reservation');
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/reservations', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
            },
        });
    };

    const amenitiesList = useMemo(
        () =>
            property.amenities
                .flatMap((amenity) =>
                    amenity
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                ),
        [property.amenities],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs(property)}>
            <Head title={`${property.name} · Reserve`} />
            <div className="flex flex-1 flex-col gap-8 px-6 pb-12 pt-6 lg:px-12">
                <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(400px,520px)]">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                                Reserve this residence
                            </span>
                            <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">{property.name}</h1>
                            <p className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="h-4 w-4" /> {resolveLocation(property) || 'Location details coming soon'}
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow">
                            <img
                                src={resolveImage(property)}
                                alt={property.name}
                                className="h-72 w-full object-cover"
                                loading="lazy"
                            />
                        </div>

                        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
                                <ul className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                                    {amenitiesList.length > 0 ? (
                                        amenitiesList.map((amenity, index) => (
                                            <li key={`${amenity}-${index}`} className="rounded-full bg-slate-100 px-3 py-1">
                                                {amenity}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="rounded-full bg-slate-100 px-3 py-1 text-slate-400">
                                            Amenity details will be provided soon.
                                        </li>
                                    )}
                                </ul>
                                <p className="text-sm text-slate-600">
                                    {property.description ?? 'A concierge will share a detailed lifestyle description shortly.'}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold text-slate-900">Key Details</h2>
                                <dl className="grid gap-3 text-sm text-slate-600">
                                    <div className="flex items-center justify-between">
                                        <dt className="font-semibold text-slate-800">Monthly rent</dt>
                                        <dd>{formatCurrency(property.monthly_rent)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="font-semibold text-slate-800">Security deposit</dt>
                                        <dd>{formatCurrency(property.security_deposit)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="font-semibold text-slate-800">Availability</dt>
                                        <dd>{formatAvailability(property)}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="font-semibold text-slate-800">Lease term</dt>
                                        <dd>{property.lease_term ?? 'To be discussed'}</dd>
                                    </div>
                                </dl>
                                <div className="flex flex-wrap gap-4 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
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
                            </div>
                        </div>

                        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,360px)]">
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold text-slate-900">Concierge Notes</h2>
                                <p className="text-sm text-slate-600">
                                    {property.pet_policy ?? 'Pet policies and concierge guidance will appear here once shared.'}
                                </p>
                                {property.notes && (
                                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                                        <strong className="block font-semibold text-slate-800">Additional notes</strong>
                                        <span className="mt-1 block whitespace-pre-line">{property.notes}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold text-slate-900">Primary Contact</h2>
                                <dl className="space-y-2 text-sm text-slate-600">
                                    <div>
                                        <dt className="font-semibold text-slate-800">Name</dt>
                                        <dd>{property.contact_name ?? '—'}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-800">Email</dt>
                                        <dd>{property.contact_email ?? '—'}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-slate-800">Phone</dt>
                                        <dd>{property.contact_phone ?? '—'}</dd>
                                    </div>
                                </dl>
                                {property.owner && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Managed by</p>
                                        <p className="mt-2 font-semibold text-slate-800">{property.owner.name}</p>
                                        <p className="text-xs text-slate-500">{property.owner.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow">
                        <PropertyLocationMap property={property} />
                    </div>
                </section>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-6">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Ready to reserve?</p>
                        <p className="text-sm text-blue-700">
                            Coordinate schedules with our concierge team to finalize your reservation and onboarding timeline.
                        </p>
                        {isCurrentlyReserved && (
                            <p className="text-sm font-medium text-blue-700">
                                This residence is currently reserved{reservedUntilLabel ? ` until ${reservedUntilLabel}` : ''}.
                            </p>
                        )}
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                disabled={isCurrentlyReserved}
                                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-blue-600"
                            >
                                Reserve this Property
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Reserve this Property</DialogTitle>
                                <DialogDescription>
                                    Submit your reservation request and our concierge team will confirm the details shortly.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
                                    <div className="space-y-1 text-sm text-slate-600">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            Reservation details
                                        </p>
                                        <p className="text-base font-semibold text-slate-900">{property.name}</p>
                                        <p>{resolveLocation(property) || 'Location details coming soon'}</p>
                                    </div>
                                    <dl className="grid gap-2 text-sm text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <dt className="font-medium text-slate-700">Monthly rent</dt>
                                            <dd>{formatCurrency(property.monthly_rent)}</dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="font-medium text-slate-700">Reference</dt>
                                            <dd className="font-mono text-slate-900">{data.reference || 'Generating…'}</dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="font-medium text-slate-700">Starts at</dt>
                                            <dd>{formatDateTime(data.starts_at)}</dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="font-medium text-slate-700">Ends at</dt>
                                            <dd>{formatDateTime(data.ends_at)}</dd>
                                        </div>
                                    </dl>
                                </div>
                                {errors.reservation && (
                                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                                        {errors.reservation}
                                    </p>
                                )}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="reservation_type">Reservation type</Label>
                                        <Select
                                            value={data.reservation_type}
                                            onValueChange={(value) => setData('reservation_type', value)}
                                        >
                                            <SelectTrigger
                                                id="reservation_type"
                                                aria-invalid={Boolean(errors.reservation_type)}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                                            >
                                                <SelectValue placeholder="Select a reservation type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border border-slate-100 bg-white shadow-xl">
                                                {reservationTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.reservation_type && (
                                            <p className="text-xs text-rose-600">{errors.reservation_type}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="notes">Notes</Label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(event) => setData('notes', event.target.value)}
                                            rows={4}
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
                                            placeholder="Share preferred schedules, concierge needs, or guest details."
                                        />
                                        {errors.notes && <p className="text-xs text-rose-600">{errors.notes}</p>}
                                    </div>
                                </div>
                                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-full border-slate-300 sm:w-auto"
                                        onClick={() => handleDialogChange(false)}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-full bg-blue-600 text-white shadow transition-colors duration-200 hover:bg-blue-700 sm:w-auto"
                                        disabled={processing}
                                    >
                                        {processing ? 'Submitting…' : 'Confirm reservation'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
