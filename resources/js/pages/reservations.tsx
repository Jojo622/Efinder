import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import { CalendarClock, CalendarDays, Clock3, Mail, MapPin, Phone, Users2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface PartyDetails {
    id: number;
    name: string;
    email?: string | null;
}

type TenantStatus = 'Current' | 'Expiring Soon' | 'Overdue' | 'Notice Given' | 'Pending';

interface TenantDetails extends PartyDetails {
    mobile_number?: string | null;
    property_name?: string | null;
    unit_number?: string | null;
    lease_start?: string | null;
    lease_end?: string | null;
    monthly_rent?: number | null;
    tenant_status?: TenantStatus | null;
    concierge_name?: string | null;
    address?: string | null;
}

interface PropertyDetails {
    id: number;
    name: string;
    location?: string | null;
    street_address?: string | null;
    barangay?: string | null;
    city?: string | null;
    monthly_rent?: number | null;
}

interface ReservationRecord {
    id: number;
    status: string;
    type: string;
    starts_at: string | null;
    ends_at: string | null;
    reference?: string | null;
    tenant: TenantDetails | null;
    owner: PartyDetails | null;
    property: PropertyDetails | null;
}

interface ReservationsPageProps {
    reservations: ReservationRecord[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Reservations',
        href: '/reservations',
    },
];

const statusStyles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-100',
    completed: 'bg-slate-50 text-slate-600 ring-slate-200',
};

const tenantStatusOptions: TenantStatus[] = ['Current', 'Expiring Soon', 'Overdue', 'Notice Given', 'Pending'];

function formatDate(value: string | null): string {
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
}

function formatStatus(status: string): string {
    return status
        .split(/[_\s]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
        return '₱0.00';
    }

    const numeric = typeof value === 'string' ? Number.parseFloat(value) : value;

    if (!Number.isFinite(numeric)) {
        return '₱0.00';
    }

    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numeric);
}

function getLocation(property: PropertyDetails | null): string {
    if (!property) {
        return '—';
    }

    return property.location ?? 'Location pending';
}

function resolveTenantAddress(tenant: TenantDetails | null, property: PropertyDetails | null): string {
    const segments = [
        tenant?.address,
        tenant?.property_name,
        tenant?.unit_number ? `Unit ${tenant.unit_number}` : null,
        property?.street_address,
        property?.barangay,
        property?.city,
        property?.location,
    ].filter((segment): segment is string => Boolean(segment));

    const uniqueSegments = segments.filter((segment, index) => segments.indexOf(segment) === index);

    if (uniqueSegments.length === 0) {
        return 'Address not available';
    }

    return uniqueSegments.join(', ');
}

function normaliseNumericInput(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    return Number.isFinite(value) ? value.toString() : '';
}

export default function Reservations({ reservations }: ReservationsPageProps) {
    const activeReservations = reservations ?? [];
    const now = new Date();

    const [contactReservation, setContactReservation] = useState<ReservationRecord | null>(null);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    const [confirmReservation, setConfirmReservation] = useState<ReservationRecord | null>(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const {
        data: confirmData,
        setData: setConfirmData,
        post: submitConfirm,
        processing: confirmProcessing,
        errors: confirmErrors,
        reset: resetConfirm,
        clearErrors: clearConfirmErrors,
    } = useForm<{
        property_name: string;
        monthly_rent: string;
        tenant_status: TenantStatus;
        lease_start: string;
        lease_end: string;
        concierge_name: string;
    }>({
        property_name: '',
        monthly_rent: '',
        tenant_status: tenantStatusOptions[0],
        lease_start: '',
        lease_end: '',
        concierge_name: '',
    });

    const handleContactDialogChange = (open: boolean) => {
        setIsContactDialogOpen(open);

        if (!open) {
            setContactReservation(null);
        }
    };

    const openContactDialog = (reservation: ReservationRecord) => {
        setContactReservation(reservation);
        setIsContactDialogOpen(true);
    };

    const handleConfirmDialogChange = (open: boolean) => {
        setIsConfirmDialogOpen(open);

        if (!open) {
            setConfirmReservation(null);
            resetConfirm();
            clearConfirmErrors();
        }
    };

    const openConfirmDialog = (reservation: ReservationRecord) => {
        if (!reservation.tenant) {
            return;
        }

        const status = reservation.tenant.tenant_status;
        const resolvedStatus = status && tenantStatusOptions.includes(status as TenantStatus)
            ? (status as TenantStatus)
            : tenantStatusOptions[0];

        setConfirmReservation(reservation);
        clearConfirmErrors();
        setConfirmData('property_name', reservation.tenant.property_name ?? reservation.property?.name ?? '');
        setConfirmData(
            'monthly_rent',
            normaliseNumericInput(reservation.tenant.monthly_rent ?? reservation.property?.monthly_rent ?? null),
        );
        setConfirmData('tenant_status', resolvedStatus);
        setConfirmData('lease_start', reservation.tenant.lease_start ?? '');
        setConfirmData('lease_end', reservation.tenant.lease_end ?? '');
        setConfirmData('concierge_name', reservation.tenant.concierge_name ?? '');
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!confirmReservation) {
            return;
        }

        submitConfirm(`/reservations/${confirmReservation.id}/confirm-tenant`, {
            preserveScroll: true,
            onSuccess: () => {
                resetConfirm();
                clearConfirmErrors();
                setIsConfirmDialogOpen(false);
                setConfirmReservation(null);
            },
        });
    };

    const contactTenant = contactReservation?.tenant ?? null;
    const contactProperty = contactReservation?.property ?? null;
    const confirmTenantDetails = confirmReservation?.tenant ?? null;
    const confirmPropertyDetails = confirmReservation?.property ?? null;

    const upcomingReservations = activeReservations
        .filter((reservation) => {
            if (!reservation.starts_at) {
                return false;
            }

            const start = new Date(reservation.starts_at);

            return !Number.isNaN(start.getTime()) && start >= now;
        })
        .sort((a, b) => {
            const startA = a.starts_at ? new Date(a.starts_at).getTime() : Number.POSITIVE_INFINITY;
            const startB = b.starts_at ? new Date(b.starts_at).getTime() : Number.POSITIVE_INFINITY;

            return startA - startB;
        });

    const upcomingThisWeek = activeReservations.filter((reservation) => {
        if (!reservation.starts_at) {
            return false;
        }

        const start = new Date(reservation.starts_at);

        if (Number.isNaN(start.getTime())) {
            return false;
        }

        const diffInDays = (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        return diffInDays >= 0 && diffInDays <= 7;
    }).length;

    const currentlyInHouse = activeReservations.filter((reservation) => {
        if (!reservation.starts_at) {
            return false;
        }

        const start = new Date(reservation.starts_at).getTime();
        const end = reservation.ends_at ? new Date(reservation.ends_at).getTime() : Number.POSITIVE_INFINITY;

        if (Number.isNaN(start) || Number.isNaN(end)) {
            return false;
        }

        const current = now.getTime();

        return current >= start && current <= end;
    }).length;

    const nextReservation = upcomingReservations[0] ?? null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservations" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 opacity-95" />
                    <PlaceholderPattern className="absolute -left-24 top-16 h-72 w-72 stroke-white/10" />
                    <div className="relative z-10 flex flex-col gap-8 text-white">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                                    <CalendarDays className="h-4 w-4" /> Reservation operations
                                </span>
                                <h1 className="text-3xl font-semibold">Active reservations</h1>
                                <p className="max-w-2xl text-sm text-white/75">
                                    Monitor current stays, prepare for check-ins, and coordinate concierge activities across your portfolio.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm text-white/80 shadow-lg backdrop-blur">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">At a glance</p>
                                <div className="mt-3 space-y-2">
                                    <p className="text-lg font-semibold text-white">{activeReservations.length} active reservations</p>
                                    <p>{upcomingThisWeek} arriving within the next 7 days</p>
                                    <p>{currentlyInHouse} currently in-house guests</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Next arrival</p>
                                <p className="mt-3 text-lg font-semibold text-white">
                                    {nextReservation ? formatDate(nextReservation.starts_at) : 'No upcoming reservations'}
                                </p>
                                <p className="text-sm text-white/70">
                                    {nextReservation?.tenant?.name ?? 'Awaiting guest assignment'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Properties engaged</p>
                                <p className="mt-3 text-3xl font-semibold">{
                                    new Set(
                                        activeReservations
                                            .map((reservation) => reservation.property?.id)
                                            .filter((id): id is number => Boolean(id)),
                                    ).size
                                }</p>
                                <p className="text-sm text-white/70">Across active reservations</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-inner">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Upcoming departures</p>
                                <p className="mt-3 text-3xl font-semibold">{
                                    activeReservations.filter((reservation) => {
                                        if (!reservation.ends_at) {
                                            return false;
                                        }

                                        const end = new Date(reservation.ends_at);

                                        if (Number.isNaN(end.getTime())) {
                                            return false;
                                        }

                                        const diffInDays = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

                                        return diffInDays >= 0 && diffInDays <= 7;
                                    }).length
                                }</p>
                                <p className="text-sm text-white/70">Scheduled within seven days</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.6)]">
                    <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-50/60 px-6 py-4">
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Reservation schedule</h2>
                            <p className="text-xs text-slate-500">All active reservations pulled directly from the reservation ledger.</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CalendarClock className="h-4 w-4" />
                            Updated in real time
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                            <thead>
                                <tr className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    <th scope="col" className="py-3 pl-6 pr-4 font-semibold">Guest</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Property</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Schedule</th>
                                    <th scope="col" className="py-3 pr-4 font-semibold">Status</th>
                                    <th scope="col" className="py-3 pr-6 font-semibold">Owner</th>
                                    <th scope="col" className="py-3 pr-6 text-right font-semibold">Confirm</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {activeReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                                            There are no active reservations at the moment. New reservations will appear here as soon as they are scheduled.
                                        </td>
                                    </tr>
                                ) : (
                                    activeReservations.map((reservation) => (
                                        <tr key={reservation.id} className="transition-colors duration-200 hover:bg-slate-50/70">
                                            <td className="whitespace-nowrap py-4 pl-6 pr-4">
                                                <div className="font-semibold text-slate-900">
                                                    {reservation.tenant ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => openContactDialog(reservation)}
                                                            className="rounded-sm text-left text-slate-900 underline decoration-dotted decoration-slate-400 transition-colors duration-150 hover:text-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                                        >
                                                            {reservation.tenant.name}
                                                        </button>
                                                    ) : (
                                                        '—'
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500">{reservation.tenant?.email ?? 'Contact pending'}</div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="font-medium text-slate-900">{reservation.property?.name ?? '—'}</div>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin className="h-3 w-3" /> {getLocation(reservation.property)}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-2">
                                                        <CalendarDays className="h-4 w-4 text-slate-500" /> {formatDate(reservation.starts_at)}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                                                        Checkout: {reservation.ends_at ? formatDate(reservation.ends_at) : 'Flexible'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4">
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                                                        statusStyles[reservation.status.toLowerCase()] ?? statusStyles.pending,
                                                    )}
                                                >
                                                    <Users2 className="h-3.5 w-3.5" /> {formatStatus(reservation.status)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-4 text-sm text-slate-600">
                                                <div className="font-medium text-slate-900">{reservation.owner?.name ?? '—'}</div>
                                                <div className="text-xs text-slate-500">{reservation.owner?.email ?? '—'}</div>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pr-6 text-right">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-full border-slate-200 text-xs font-semibold text-slate-600"
                                                    onClick={() => openConfirmDialog(reservation)}
                                                    disabled={!reservation.tenant}
                                                >
                                                    Confirm tenant
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            <Dialog open={isContactDialogOpen} onOpenChange={handleContactDialogChange}>
                <DialogContent className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6">
                    <DialogHeader>
                        <DialogTitle>{contactTenant?.name ?? 'Guest information'}</DialogTitle>
                        <DialogDescription>
                            Concierge contact details for this guest reservation.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 text-sm text-slate-600">
                        <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Address</p>
                            <p className="text-slate-700">
                                {resolveTenantAddress(contactTenant, contactProperty)}
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span>{contactTenant?.email ?? 'No email on record'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span>{contactTenant?.mobile_number ?? 'No contact number available'}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {contactTenant?.email ? (
                                <Button variant="outline" className="rounded-full" asChild>
                                    <a href={`mailto:${contactTenant.email}`}>Send email</a>
                                </Button>
                            ) : (
                                <Button variant="outline" className="rounded-full" type="button" disabled>
                                    Send email
                                </Button>
                            )}
                            {contactTenant?.mobile_number ? (
                                <Button variant="outline" className="rounded-full" asChild>
                                    <a href={`tel:${contactTenant.mobile_number}`}>Call guest</a>
                                </Button>
                            ) : (
                                <Button variant="outline" className="rounded-full" type="button" disabled>
                                    Call guest
                                </Button>
                            )}
                            {contactTenant?.mobile_number ? (
                                <Button variant="outline" className="rounded-full" asChild>
                                    <a href={`sms:${contactTenant.mobile_number}`}>Send text</a>
                                </Button>
                            ) : (
                                <Button variant="outline" className="rounded-full" type="button" disabled>
                                    Send text
                                </Button>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-full sm:w-auto"
                            onClick={() => handleContactDialogChange(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmDialogOpen} onOpenChange={handleConfirmDialogChange}>
                <DialogContent className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6">
                    <DialogHeader>
                        <DialogTitle>Confirm tenant details</DialogTitle>
                        <DialogDescription>
                            Sync the reservation with the tenant record to keep lease information current.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleConfirmSubmit} className="space-y-5">
                        <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Reservation</p>
                            <p className="font-semibold text-slate-900">
                                {confirmPropertyDetails?.name ?? confirmTenantDetails?.property_name ?? 'Unassigned property'}
                            </p>
                            <p>{resolveTenantAddress(confirmTenantDetails, confirmPropertyDetails)}</p>
                            <p className="text-xs font-medium text-slate-500">
                                Monthly rent:{' '}
                                {formatCurrency(
                                    confirmPropertyDetails?.monthly_rent ?? confirmTenantDetails?.monthly_rent ?? null,
                                )}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="property_name">Property name</Label>
                                <Input
                                    id="property_name"
                                    value={confirmData.property_name}
                                    onChange={(event) => setConfirmData('property_name', event.target.value)}
                                    className="rounded-2xl border-slate-200"
                                    required
                                />
                                {confirmErrors.property_name && (
                                    <p className="text-xs text-rose-600">{confirmErrors.property_name}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="monthly_rent">Monthly rent</Label>
                                <Input
                                    id="monthly_rent"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={confirmData.monthly_rent}
                                    onChange={(event) => setConfirmData('monthly_rent', event.target.value)}
                                    className="rounded-2xl border-slate-200"
                                />
                                {confirmErrors.monthly_rent && (
                                    <p className="text-xs text-rose-600">{confirmErrors.monthly_rent}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="tenant_status">Tenant status</Label>
                                <Select
                                    value={confirmData.tenant_status}
                                    onValueChange={(value) => setConfirmData('tenant_status', value as TenantStatus)}
                                >
                                    <SelectTrigger id="tenant_status" className="rounded-2xl border-slate-200">
                                        <SelectValue placeholder="Select tenant status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-slate-100 bg-white shadow-xl">
                                        {tenantStatusOptions.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {confirmErrors.tenant_status && (
                                    <p className="text-xs text-rose-600">{confirmErrors.tenant_status}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Label>Lease start</Label>
                                    <DatePicker
                                        name="lease_start"
                                        value={confirmData.lease_start || null}
                                        onChange={(value) => setConfirmData('lease_start', value ?? '')}
                                        className="rounded-2xl"
                                        placeholder="Select lease start"
                                    />
                                    {confirmErrors.lease_start && (
                                        <p className="text-xs text-rose-600">{confirmErrors.lease_start}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label>Lease end</Label>
                                    <DatePicker
                                        name="lease_end"
                                        value={confirmData.lease_end || null}
                                        onChange={(value) => setConfirmData('lease_end', value ?? '')}
                                        className="rounded-2xl"
                                        placeholder="Select lease end"
                                    />
                                    {confirmErrors.lease_end && (
                                        <p className="text-xs text-rose-600">{confirmErrors.lease_end}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="concierge_name">Concierge name</Label>
                                <Input
                                    id="concierge_name"
                                    value={confirmData.concierge_name}
                                    onChange={(event) => setConfirmData('concierge_name', event.target.value)}
                                    className="rounded-2xl border-slate-200"
                                />
                                {confirmErrors.concierge_name && (
                                    <p className="text-xs text-rose-600">{confirmErrors.concierge_name}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full rounded-full border-slate-200 sm:w-auto"
                                onClick={() => handleConfirmDialogChange(false)}
                                disabled={confirmProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-full rounded-full bg-blue-600 text-white shadow transition-colors duration-200 hover:bg-blue-700 sm:w-auto"
                                disabled={confirmProcessing || !confirmReservation?.tenant}
                            >
                                {confirmProcessing ? 'Saving…' : 'Submit confirmation'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
