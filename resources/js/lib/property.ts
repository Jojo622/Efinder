export function normalizeAmenities(amenities?: string[] | null): string[] {
    if (!amenities) {
        return [];
    }

    return amenities
        .flatMap((amenity) => amenity.split(','))
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
}
