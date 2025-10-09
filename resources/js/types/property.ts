export interface PublicProperty {
    id: number;
    name: string;
    type: string | null;
    status: string | null;
    active_reservation: ActiveReservation | null;
    monthly_rent: string | number | null;
    security_deposit: string | number | null;
    location: string | null;
    street_address: string | null;
    city: string | null;
    barangay: string | null;
    latitude: number | null;
    longitude: number | null;
    bedrooms: string | number | null;
    bathrooms: string | number | null;
    square_footage: string | null;
    parking_spaces: string | null;
    availability_date: string | null;
    lease_term: string | null;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    amenities: string[];
    description: string | null;
    hero_image: string | null;
    availability_photo_url: string | null;
    pet_policy: string | null;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
    owner: {
        name: string;
        email: string;
        role: string;
    } | null;
}

export interface ActiveReservation {
    id: number;
    status: string;
    reservation_type: string;
    reference: string | null;
    starts_at: string | null;
    ends_at: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    per_page: number;
}

export interface PaginatedPublicProperties {
    data: PublicProperty[];
    links: PaginationLink[];
    meta: PaginationMeta;
}
