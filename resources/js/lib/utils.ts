import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface PaginationMetaLike {
    from?: number | null;
    to?: number | null;
    total?: number | null;
    current_page?: number | null;
    per_page?: number | null;
    last_page?: number | null;
}

export function resolvePaginationSummary(
    meta: PaginationMetaLike | undefined,
    itemCount: number,
): { from: number; to: number; total: number } {
    const safeMeta = meta ?? {};
    const hasItems = itemCount > 0;

    const perPageCandidate = safeMeta.per_page ?? null;
    const perPage =
        perPageCandidate !== null && perPageCandidate !== undefined && perPageCandidate > 0
            ? perPageCandidate
            : hasItems
                ? itemCount
                : 0;

    const currentPageCandidate = safeMeta.current_page ?? null;
    const currentPage =
        currentPageCandidate !== null && currentPageCandidate !== undefined && currentPageCandidate > 0
            ? currentPageCandidate
            : 1;

    const calculatedFrom = hasItems && perPage > 0 ? (currentPage - 1) * perPage + 1 : hasItems ? 1 : 0;
    const calculatedTo = hasItems && perPage > 0 ? (currentPage - 1) * perPage + itemCount : hasItems ? itemCount : 0;

    const from = safeMeta.from ?? calculatedFrom;
    const to = safeMeta.to ?? calculatedTo;

    const totalFromMeta = safeMeta.total ?? null;
    const lastPage = safeMeta.last_page ?? null;
    const estimatedTotal =
        totalFromMeta !== null && totalFromMeta !== undefined && totalFromMeta > 0
            ? totalFromMeta
            : lastPage !== null && lastPage !== undefined && lastPage > 0 && perPage > 0
                ? lastPage * perPage
                : itemCount;

    const total = hasItems ? Math.max(estimatedTotal, to) : estimatedTotal;

    return {
        from: hasItems ? from : 0,
        to: hasItems ? to : 0,
        total,
    };
}
