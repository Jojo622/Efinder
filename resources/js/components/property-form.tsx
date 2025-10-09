import FormSelect from '@/components/form-select';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import useGoogleMapsApi from '@/hooks/use-google-maps-api';
import { Save } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface PropertyFormValues {
    name: string;
    type: string;
    status: string;
    monthly_rent: string;
    security_deposit?: string;
    location?: string;
    street_address: string;
    city: string;
    barangay: string;
    latitude?: string | number | null;
    longitude?: string | number | null;
    bedrooms?: string;
    bathrooms?: string;
    square_footage?: string;
    parking_spaces?: string;
    availability_date?: string;
    lease_term?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    amenities?: string;
    description?: string;
    gallery_images?: string[];
    pet_policy?: string;
    notes?: string;
    availability_photo_path?: string | null;
}

export interface PropertyFormOptions {
    types: string[];
    statuses: string[];
}

interface PropertyFormProps {
    errors: Record<string, string | undefined>;
    processing: boolean;
    formOptions: PropertyFormOptions;
    submitLabel?: string;
    property?: Partial<PropertyFormValues> | null;
}

export default function PropertyForm({
    errors,
    processing,
    formOptions,
    submitLabel = 'Save property',
    property,
}: PropertyFormProps) {
    const initialGalleryImages = useMemo<string[]>(() => {
        const images = property?.gallery_images;

        if (!images || !Array.isArray(images)) {
            return [];
        }

        return images;
    }, [property?.gallery_images]);
    const [currentImages, setCurrentImages] = useState<string[]>(initialGalleryImages);
    const [selectedGalleryNames, setSelectedGalleryNames] = useState<string[]>([]);
    const propertyImagesError = errors.property_images ?? errors['property_images.0'];

    const initialType = useMemo(
        () => property?.type ?? formOptions.types[0] ?? 'Apartment',
        [property?.type, formOptions.types],
    );

    const initialStatus = useMemo(
        () => property?.status ?? formOptions.statuses[0] ?? 'Now Leasing',
        [property?.status, formOptions.statuses],
    );

    const [leaseTerm, setLeaseTerm] = useState(property?.lease_term ?? '');

    const [typeValue, setTypeValue] = useState(initialType);
    const [statusValue, setStatusValue] = useState(initialStatus);
    const [streetAddress, setStreetAddress] = useState(property?.street_address ?? '');
    const [city, setCity] = useState(property?.city ?? '');
    const [barangay, setBarangay] = useState(property?.barangay ?? '');
    const [availabilityDate, setAvailabilityDate] = useState<string | null>(property?.availability_date ?? null);
    const [latitude, setLatitude] = useState(
        property?.latitude !== undefined && property?.latitude !== null
            ? String(property.latitude)
            : '',
    );
    const [longitude, setLongitude] = useState(
        property?.longitude !== undefined && property?.longitude !== null
            ? String(property.longitude)
            : '',
    );
    const [addressFeedback, setAddressFeedback] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const googleStatus = useGoogleMapsApi({ apiKey, libraries: ['maps', 'marker', 'places'] });
    const streetInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setStreetAddress(property?.street_address ?? '');
        setCity(property?.city ?? '');
        setBarangay(property?.barangay ?? '');
        setAvailabilityDate(property?.availability_date ?? null);
        setLatitude(
            property?.latitude !== undefined && property?.latitude !== null
                ? String(property.latitude)
                : '',
        );
        setLongitude(
            property?.longitude !== undefined && property?.longitude !== null
                ? String(property.longitude)
                : '',
        );
    }, [
        property?.street_address,
        property?.city,
        property?.barangay,
        property?.availability_date,
        property?.latitude,
        property?.longitude,
    ]);

    useEffect(() => {
        setTypeValue(initialType);
    }, [initialType]);

    useEffect(() => {
        setStatusValue(initialStatus);
    }, [initialStatus]);

    useEffect(() => {
        setCurrentImages(initialGalleryImages);
    }, [initialGalleryImages]);

    useEffect(() => {
        setLeaseTerm(property?.lease_term ?? '');
    }, [property?.lease_term]);

    useEffect(() => {
        if (googleStatus !== 'ready' || !streetInputRef.current) {
            return;
        }

        type AddressComponent = {
            long_name: string;
            short_name?: string;
            types: string[];
        };

        type LatLngLiteral = { lat: number; lng: number };

        type AutocompletePlace = {
            address_components?: AddressComponent[];
            formatted_address?: string;
            name?: string;
            geometry?: {
                location?:
                    | { lat: () => number; lng: () => number }
                    | LatLngLiteral;
            };
        };

        type GoogleAutocomplete = {
            addListener: (event: string, handler: () => void) => { remove?: () => void };
            getPlace: () => AutocompletePlace;
            setBounds?: (bounds: unknown) => void;
        };

        type GoogleMapsLibrary = {
            maps?: {
                places?: {
                    Autocomplete: new (
                        inputField: HTMLInputElement,
                        options?: {
                            componentRestrictions?: { country?: string | string[] };
                            fields?: string[];
                            bounds?: unknown;
                            strictBounds?: boolean;
                            types?: string[];
                        },
                    ) => GoogleAutocomplete;
                };
                LatLngBounds: new (
                    southwest?: LatLngLiteral,
                    northeast?: LatLngLiteral,
                ) => unknown;
            };
        };

        const win = window as typeof window & { google?: GoogleMapsLibrary };
        const googleMaps = win.google;

        if (!googleMaps?.maps?.places?.Autocomplete || !googleMaps.maps.LatLngBounds) {
            return;
        }

        const pangasinanBounds = {
            north: 16.495,
            south: 15.6,
            east: 121.1,
            west: 119.7,
        };

        const bounds = new googleMaps.maps.LatLngBounds(
            { lat: pangasinanBounds.south, lng: pangasinanBounds.west },
            { lat: pangasinanBounds.north, lng: pangasinanBounds.east },
        );

        const autocomplete = new googleMaps.maps.places.Autocomplete(streetInputRef.current, {
            componentRestrictions: { country: ['ph'] },
            fields: ['address_components', 'formatted_address', 'name', 'geometry'],
            bounds,
            strictBounds: true,
            types: ['geocode'],
        });

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place) {
                return;
            }

            const components = place.address_components ?? [];
            const findComponent = (type: string) =>
                components.find((component) => component.types.includes(type))?.long_name ?? null;
            const findAnyComponent = (candidates: string[]) => {
                for (const candidate of candidates) {
                    const match = components.find((component) => component.types.includes(candidate));
                    if (match) {
                        return match.long_name;
                    }
                }
                return null;
            };

            const province = findComponent('administrative_area_level_2');
            const formattedAddress = place.formatted_address ?? '';
            const isInPangasinan =
                province?.toLowerCase() === 'pangasinan' || formattedAddress.toLowerCase().includes('pangasinan');

            if (!isInPangasinan) {
                setAddressFeedback('Please choose an address located in Pangasinan, Philippines.');
                setStreetAddress('');
                setCity('');
                setBarangay('');
                setLatitude('');
                setLongitude('');
                return;
            }

            const streetNumber = findComponent('street_number');
            const route = findComponent('route');
            const resolvedStreet = [streetNumber, route].filter(Boolean).join(' ');
            const resolvedCity =
                findAnyComponent(['locality', 'administrative_area_level_3', 'administrative_area_level_2']) ?? '';
            const resolvedBarangay =
                findAnyComponent([
                    'sublocality_level_1',
                    'sublocality_level_2',
                    'neighborhood',
                    'administrative_area_level_4',
                ]) ?? '';

            setStreetAddress(resolvedStreet || place.name || formattedAddress || '');
            setCity(resolvedCity);
            setBarangay(resolvedBarangay);
            setAddressFeedback(null);

            const location = place.geometry?.location;
            let resolvedLatitude: string | null = null;
            let resolvedLongitude: string | null = null;

            if (location) {
                const candidate = location as { lat?: () => number; lng?: () => number };
                if (typeof candidate.lat === 'function' && typeof candidate.lng === 'function') {
                    resolvedLatitude = candidate.lat().toFixed(6);
                    resolvedLongitude = candidate.lng().toFixed(6);
                } else {
                    const literal = location as LatLngLiteral;
                    if (typeof literal.lat === 'number' && typeof literal.lng === 'number') {
                        resolvedLatitude = literal.lat.toFixed(6);
                        resolvedLongitude = literal.lng.toFixed(6);
                    }
                }
            }

            setLatitude(resolvedLatitude ?? '');
            setLongitude(resolvedLongitude ?? '');
        });

        return () => {
            listener?.remove?.();
        };
    }, [googleStatus]);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Identity</h2>
                <div className="space-y-4 text-sm text-slate-600">
                    <label className="flex flex-col gap-2">
                        <span className="font-medium text-slate-900">Property name</span>
                        <Input
                            name="name"
                            defaultValue={property?.name ?? ''}
                            required
                            placeholder="Azure Heights – Sky Collection"
                        />
                        <InputError message={errors.name} />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Residence type</span>
                            <FormSelect
                                name="type"
                                value={typeValue}
                                onValueChange={setTypeValue}
                                options={formOptions.types.map((type) => ({
                                    value: type,
                                    label: type,
                                }))}
                                className="mt-1"
                                triggerClassName="rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            />
                            <InputError message={errors.type} className="mt-1" />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Status</span>
                            <FormSelect
                                name="status"
                                value={statusValue}
                                onValueChange={setStatusValue}
                                options={formOptions.statuses.map((status) => ({
                                    value: status,
                                    label: status,
                                }))}
                                className="mt-1"
                                triggerClassName="rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            />
                            <InputError message={errors.status} className="mt-1" />
                        </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Monthly rent</span>
                            <Input
                                name="monthly_rent"
                                required
                                defaultValue={property?.monthly_rent ?? ''}
                                placeholder="35000"
                                inputMode="decimal"
                            />
                            <InputError message={errors.monthly_rent} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Security deposit</span>
                            <Input
                                name="security_deposit"
                                defaultValue={property?.security_deposit ?? ''}
                                placeholder="10000"
                                inputMode="decimal"
                            />
                            <InputError message={errors.security_deposit} />
                        </label>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Property images</span>
                            <input
                                type="file"
                                name="property_images[]"
                                accept="image/*"
                                multiple
                                onChange={(event) => {
                                    const files = Array.from(event.target.files ?? []);
                                    setSelectedGalleryNames(files.map((file) => file.name));
                                }}
                                className="w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-white px-2 py-0 text-xs text-slate-600 shadow-sm transition focus:border-blue-500 focus:outline-none file:my-1 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-[5px] file:text-xs file:font-semibold file:text-white hover:border-slate-400"
                            />
                            <p className="text-xs text-slate-500">
                                Upload multiple photos (JPG or PNG, up to 5MB each) to build the property gallery.
                            </p>
                            <InputError message={propertyImagesError} />
                        </label>
                        {selectedGalleryNames.length > 0 && (
                            <ul className="space-y-2 rounded-xl bg-slate-50/70 p-4 text-xs text-slate-600">
                                {selectedGalleryNames.map((fileName) => (
                                    <li key={fileName} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                        <span>{fileName}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {currentImages.length > 0 && (
                            <div className="space-y-3 rounded-xl border border-slate-200 bg-white/70 p-4">
                                <p className="text-sm font-semibold text-slate-800">Existing gallery</p>
                                <ul className="space-y-3">
                                    {currentImages.map((image) => {
                                        const resolvedImage = image.startsWith('http') ? image : `/storage/${image}`;

                                        return (
                                            <li
                                                key={image}
                                                className="flex items-center justify-between gap-4 rounded-lg bg-slate-50/80 p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={resolvedImage}
                                                        alt="Property gallery preview"
                                                        className="h-14 w-14 rounded-lg object-cover"
                                                    />
                                                    <span className="text-xs text-slate-600">{image}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="hidden" name="existing_images[]" value={image} />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCurrentImages((images) =>
                                                                images.filter((item) => item !== image),
                                                            );
                                                        }}
                                                        className="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Location</h2>
                <div className="space-y-4 text-sm text-slate-600">
                    <label className="flex flex-col gap-2">
                        <span className="font-medium text-slate-900">Street address</span>
                        <Input
                            name="street_address"
                            required
                            ref={(element) => {
                                streetInputRef.current = element;
                            }}
                            value={streetAddress}
                            onChange={(event) => {
                                setStreetAddress(event.target.value);
                                setAddressFeedback(null);
                            }}
                            placeholder="128 Perez Boulevard"
                            autoComplete="street-address"
                        />
                        {googleStatus === 'missing' && (
                            <p className="text-xs text-slate-400">
                                Add a Google Maps API key to enable address suggestions.
                            </p>
                        )}
                        {addressFeedback && <p className="text-xs text-rose-500">{addressFeedback}</p>}
                        <InputError message={errors.street_address} />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">City / Municipality</span>
                            <Input
                                name="city"
                                required
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                                placeholder="Dagupan City"
                                autoComplete="address-level2"
                            />
                            <InputError message={errors.city} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Barangay</span>
                            <Input
                                name="barangay"
                                required
                                value={barangay}
                                onChange={(event) => setBarangay(event.target.value)}
                                placeholder="Barangay I"
                                autoComplete="address-level4"
                            />
                            <InputError message={errors.barangay} className="mt-1" />
                        </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Latitude</span>
                            <Input
                                name="latitude"
                                value={latitude}
                                onChange={(event) => setLatitude(event.target.value)}
                                placeholder="15.980000"
                                inputMode="decimal"
                                step="any"
                            />
                            <InputError message={errors.latitude} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Longitude</span>
                            <Input
                                name="longitude"
                                value={longitude}
                                onChange={(event) => setLongitude(event.target.value)}
                                placeholder="120.340000"
                                inputMode="decimal"
                                step="any"
                            />
                            <InputError message={errors.longitude} />
                        </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Bedrooms</span>
                            <Input
                                name="bedrooms"
                                defaultValue={property?.bedrooms ?? ''}
                                placeholder="3"
                            />
                            <InputError message={errors.bedrooms} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Bathrooms</span>
                            <Input
                                name="bathrooms"
                                defaultValue={property?.bathrooms ?? ''}
                                placeholder="2.5"
                            />
                            <InputError message={errors.bathrooms} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Square footage</span>
                            <Input
                                name="square_footage"
                                defaultValue={property?.square_footage ?? ''}
                                placeholder="1,980"
                            />
                            <InputError message={errors.square_footage} />
                        </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Parking availability</span>
                            <Input
                                name="parking_spaces"
                                defaultValue={property?.parking_spaces ?? ''}
                                placeholder="2 reserved spaces + EV"
                            />
                            <InputError message={errors.parking_spaces} />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Lease term</span>
                            <FormSelect
                                name="lease_term"
                                value={leaseTerm}
                                onValueChange={setLeaseTerm}
                                options={[
                                    { value: '6 months', label: '6 months' },
                                    { value: '12 months', label: '12 months' },
                                ]}
                                placeholder="Select lease term"
                                className="mt-0"
                                triggerClassName="rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                            />
                            <InputError message={errors.lease_term} />
                        </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-2">
                            <span className="font-medium text-slate-900">Availability date</span>
                            <DatePicker
                                name="availability_date"
                                value={availabilityDate}
                                onChange={setAvailabilityDate}
                                placeholder="Select availability"
                            />
                            <InputError message={errors.availability_date} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm lg:col-span-2">
                <div className="grid gap-6">
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Storytelling</h2>
                        <label className="flex flex-col gap-2 text-sm text-slate-600">
                            <span className="font-medium text-slate-900">Lifestyle description</span>
                            <textarea
                                name="description"
                                defaultValue={property?.description ?? ''}
                                rows={6}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Highlight the hospitality story, curated finishes, skyline views, and neighborhood perks."
                            />
                            <InputError message={errors.description} />
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-slate-600">
                            <span className="font-medium text-slate-900">Amenity highlights</span>
                            <textarea
                                name="amenities"
                                defaultValue={property?.amenities ?? ''}
                                rows={5}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Heated plunge pool, private elevator access, Peloton studio, bespoke concierge..."
                            />
                            <InputError message={errors.amenities} />
                        </label>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">Ready to publish?</span>
                        <span>Submitting stores the property in your internal catalog for your leasing and marketing teams.</span>
                    </div>
                    <Button type="submit" className="inline-flex items-center gap-2" disabled={processing}>
                        <Save className="h-4 w-4" />
                        {submitLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
