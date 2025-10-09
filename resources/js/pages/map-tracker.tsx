import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import useGoogleMapsApi from '@/hooks/use-google-maps-api';
import { normalizeAmenities } from '@/lib/property';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { type PublicProperty } from '@/types/property';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react';

type GoogleMarkerIcon = {
    path: string;
    fillColor: string;
    fillOpacity: number;
    strokeWeight: number;
    strokeColor: string;
    scale: number;
    anchor?: unknown;
};

type GoogleLatLngBounds = {
    extend(position: { lat: number; lng: number }): void;
    isEmpty(): boolean;
};

type GoogleMapInstance = {
    setOptions(options: { disableDefaultUI?: boolean; clickableIcons?: boolean; styles?: unknown }): void;
    fitBounds(bounds: GoogleLatLngBounds, padding?: number): void;
};

type GoogleMarker = {
    setMap(map: GoogleMapInstance | null): void;
    addListener(event: string, handler: () => void): void;
};

type GoogleMapsLibrary = {
    maps: {
        Map: new (element: HTMLElement, options?: { disableDefaultUI?: boolean; clickableIcons?: boolean; styles?: unknown }) => GoogleMapInstance;
        Marker: new (options: {
            position: { lat: number; lng: number };
            map: GoogleMapInstance;
            title?: string;
            icon?: GoogleMarkerIcon;
        }) => GoogleMarker;
        LatLngBounds: new () => GoogleLatLngBounds;
        Point: new (x: number, y: number) => unknown;
    };
};

interface PropertyWithCoordinates extends PublicProperty {
    coordinates: { lat: number; lng: number };
}

interface PropertyMapProps {
    properties: PropertyWithCoordinates[];
    selectedPropertyId: number | null;
    onSelect: (propertyId: number) => void;
}

function PropertyMap({ properties, selectedPropertyId, onSelect }: PropertyMapProps) {
    // Google Cloud setup: enable billing and the "Maps JavaScript API" for the key below, then allow HTTP referrers for this app.
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const status = useGoogleMapsApi({ apiKey, libraries: ['maps', 'marker', 'places'] });
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<GoogleMapInstance | null>(null);
    const markersRef = useRef<GoogleMarker[]>([]);

    const mapStyles = useMemo(
        () => [
            { elementType: 'geometry', stylers: [{ color: '#e5f1ff' }] },
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'road', stylers: [{ saturation: -20 }] },
        ],
        [],
    );

    useEffect(() => {
        if (status !== 'ready' || !mapContainerRef.current) {
            return;
        }

        const googleMaps = (window as typeof window & { google?: GoogleMapsLibrary }).google;
        if (!googleMaps?.maps) {
            return;
        }

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new googleMaps.maps.Map(mapContainerRef.current, {
                disableDefaultUI: true,
                clickableIcons: false,
                styles: mapStyles,
            });
        }

        const map = mapInstanceRef.current;
        map.setOptions({ disableDefaultUI: true, clickableIcons: false, styles: mapStyles });

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new googleMaps.maps.LatLngBounds();

        properties.forEach((property) => {
            const iconColor = property.id === selectedPropertyId ? '#2563eb' : '#0ea5e9';
            const icon: GoogleMarkerIcon = {
                path: 'M12 2L2 11h3v9h6v-5h2v5h6v-9h3L12 2z',
                fillColor: iconColor,
                fillOpacity: 0.95,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: property.id === selectedPropertyId ? 1.4 : 1.2,
                anchor: new googleMaps.maps.Point(12, 20),
            };

            const marker = new googleMaps.maps.Marker({
                position: property.coordinates,
                map,
                title: property.name,
                icon,
            });

            marker.addListener('click', () => onSelect(property.id));
            markersRef.current.push(marker);
            bounds.extend(property.coordinates);
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, 80);
        }

        return () => {
            markersRef.current.forEach((marker) => marker.setMap(null));
        };
    }, [mapStyles, onSelect, properties, selectedPropertyId, status]);

    if (status === 'missing') {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white text-center text-sm text-slate-600">
                Add a valid <code className="font-medium">VITE_GOOGLE_MAPS_API_KEY</code> environment variable to enable the interactive map.
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm text-red-600">
                Google Maps could not be loaded. Confirm that billing is enabled for your project and that the
                Maps JavaScript API is allowed for this key.
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            <div ref={mapContainerRef} className="h-full w-full rounded-3xl" />
            {status !== 'ready' && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-500">
                    Loading map…
                </div>
            )}
        </div>
    );
}

interface MapTrackerPageProps extends SharedData {
    properties: PublicProperty[];
}

const defaultPropertyImage = '/images/property-placeholder.svg';

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

export default function MapTracker() {
    const { auth, properties } = usePage<MapTrackerPageProps>().props;
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [isClient, setIsClient] = useState(false);

    const propertiesWithCoordinates = useMemo<PropertyWithCoordinates[]>(
        () =>
            properties
                .filter((property) => property.latitude !== null && property.longitude !== null)
                .map((property) => ({
                    ...property,
                    coordinates: { lat: Number(property.latitude), lng: Number(property.longitude) },
                })),
        [properties],
    );

    const selectedProperty = useMemo(() => {
        if (selectedPropertyId === null) {
            return properties[0] ?? null;
        }

        return properties.find((property) => property.id === selectedPropertyId) ?? properties[0] ?? null;
    }, [properties, selectedPropertyId]);

    const selectedAmenities = normalizeAmenities(selectedProperty?.amenities);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (selectedPropertyId === null && properties.length > 0) {
            setSelectedPropertyId(properties[0].id);
        }
    }, [properties, selectedPropertyId]);

    const handleSelectProperty = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
    };

    return (
        <>
            <Head title="Map Tracker" />
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <PublicNavbar active="map" />

                <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:px-12 lg:py-16">
                    <section className="space-y-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
                            Map tracker
                        </span>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-semibold text-slate-900">Discover boutique residences across Pangasinan</h1>
                            <p className="max-w-3xl text-sm text-slate-600">
                                Explore coastal towns, pilgrimage hubs, and bustling city centers throughout Pangasinan. Click a marker to uncover each home’s story, highlights, and viewing schedules.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm font-medium">
                            <Link
                                href="/available-listings"
                                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-slate-700 transition-colors duration-200 hover:border-slate-400"
                            >
                                View full availability list
                            </Link>
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                Book a guided tour
                            </Link>
                        </div>
                    </section>

                    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
                        <div className="h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-lg">
                            {isClient ? (
                                propertiesWithCoordinates.length > 0 ? (
                                    <PropertyMap
                                        properties={propertiesWithCoordinates}
                                        selectedPropertyId={selectedProperty?.id ?? null}
                                        onSelect={handleSelectProperty}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
                                        Add latitude and longitude to your listings to display them on the interactive map.
                                    </div>
                                )
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-slate-500">Preparing map…</div>
                            )}
                        </div>

                        <aside className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                            {selectedProperty ? (
                                <>
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                                            {selectedProperty.type ?? 'Residence'}
                                        </p>
                                        <h2 className="text-2xl font-semibold text-slate-900">{selectedProperty.name}</h2>
                                        <p className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4" /> {resolveLocation(selectedProperty)}
                                        </p>
                                    </div>
                                    <div className="space-y-4 text-sm text-slate-600">
                                        <img
                                            src={resolveImage(selectedProperty)}
                                            alt={selectedProperty.name}
                                            className="h-40 w-full rounded-2xl object-cover"
                                            loading="lazy"
                                        />
                                        <p>{selectedProperty.description ?? 'Lifestyle highlights will be shared soon.'}</p>
                                        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700">
                                            <span className="flex items-center gap-2">
                                                <BedDouble className="h-4 w-4" /> {selectedProperty.bedrooms ?? '—'} beds
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Bath className="h-4 w-4" /> {selectedProperty.bathrooms ?? '—'} baths
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Ruler className="h-4 w-4" /> {selectedProperty.square_footage ?? 'Size TBA'}
                                            </span>
                                        </div>
                                        <ul className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                                            {selectedAmenities.length > 0 ? (
                                                selectedAmenities.map((amenity, index) => (
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
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatCurrency(selectedProperty.monthly_rent)}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                            {formatAvailability(selectedProperty)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <button
                                            type="button"
                                            onClick={() => reserveProperty(selectedProperty.id, auth)}
                                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow transition-colors duration-200 hover:bg-blue-700"
                                        >
                                            Reserve this Property
                                        </button>
                                        <Link
                                            href={auth.user ? dashboard() : login()}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors duration-200 hover:border-slate-400 hover:text-slate-900"
                                        >
                                            Save for later
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            Quick select
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {properties.map((property) => (
                                                <button
                                                    key={property.id}
                                                    type="button"
                                                    onClick={() => handleSelectProperty(property.id)}
                                                    className={`flex items-center justify-between rounded-2xl border px-4 py-2 text-left text-sm transition-colors duration-200 ${
                                                        property.id === selectedProperty.id
                                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <span>{property.name}</span>
                                                    <span className="text-xs font-semibold">
                                                        {formatCurrency(property.monthly_rent)}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
                                    <p className="text-base font-semibold text-slate-700">No residences available yet.</p>
                                    <p>Add a property to begin tracking it on the interactive map.</p>
                                </div>
                            )}
                        </aside>
                    </section>
                </main>

                <PublicFooter className="mt-12" />
            </div>
        </>
    );
}
