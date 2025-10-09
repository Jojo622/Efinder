import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { MessageCircle, PlusCircle, Ticket } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Ticket Concerns',
        href: '/ticket-concerns',
    },
];

interface TicketRecord {
    id: number;
    property_name: string;
    unit_number?: string | null;
    category: string;
    priority: string;
    subject: string;
    description: string;
    contact_number?: string | null;
    preferred_visit_date?: string | null;
    status: string;
    created_at?: string | null;
}

interface TicketConcernsProps extends SharedData {
    tickets?: TicketRecord[];
    canManageTickets?: boolean;
    statusOptions?: string[];
}

function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

function formatPriority(value: string): string {
    const labels: Record<string, string> = {
        low: 'Low',
        normal: 'Normal',
        high: 'High',
        urgent: 'Urgent',
    };

    return labels[value.toLowerCase()] ?? value;
}

function formatStatus(value: string): string {
    const status = value.trim();

    if (!status) {
        return '—';
    }

    return status
        .split(/[_\s-]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
}

export default function TicketConcerns({ tickets = [], auth, canManageTickets = false, statusOptions = [] }: TicketConcernsProps) {
    const hasTickets = tickets.length > 0;
    const [updatingTicketId, setUpdatingTicketId] = useState<number | null>(null);
    const normalizedStatusOptions = useMemo(
        () => {
            const values = new Set<string>();

            statusOptions.forEach((option) => {
                if (option) {
                    values.add(option);
                }
            });

            tickets.forEach((ticket) => {
                if (ticket.status) {
                    values.add(ticket.status);
                }
            });

            return Array.from(values);
        },
        [statusOptions, tickets],
    );

    const isAdmin = auth?.user?.role?.toLowerCase() === 'admin';

    const handleStatusChange = (ticketId: number, currentStatus: string | null | undefined) => (value: string) => {
        if (value === currentStatus) {
            return;
        }

        setUpdatingTicketId(ticketId);

        router.patch(
            `/ticket-concerns/${ticketId}`,
            { status: value },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingTicketId((previous) => (previous === ticketId ? null : previous)),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ticket Concerns" />
            <div className="relative flex h-full flex-1 flex-col gap-8 overflow-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.55)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/70 via-white to-transparent" />
                    <PlaceholderPattern className="absolute -right-28 top-10 h-72 w-72 stroke-sky-200/50" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                                    <Ticket className="h-4 w-4" /> Concierge support
                                </span>
                                <h1 className="text-3xl font-semibold text-slate-900">Manage your service tickets with ease</h1>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    Submit new requests, review updates from your concierge team, and keep a history of resolutions for your home. We&rsquo;re here to make every stay effortless.
                                </p>
                            </div>
                            {!isAdmin && (
                                <Button
                                    asChild
                                    className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700"
                                >
                                    <Link href="/ticket-concerns/create">
                                        <PlusCircle className="h-4 w-4" />
                                        New ticket
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                <section className="relative rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_45px_90px_-60px_rgba(15,23,42,0.55)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-sky-50/80" />
                    <PlaceholderPattern className="absolute -left-28 bottom-4 h-64 w-64 stroke-slate-200/50" />
                    <div className="relative z-10">
                        {hasTickets ? (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        {isAdmin ? 'All concierge tickets' : 'Your submitted tickets'}
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        {isAdmin
                                            ? 'Monitor, update, and prioritize tickets submitted by residents across all properties.'
                                            : 'Track every request you&rsquo;ve raised with our concierge team.'}
                                    </p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
                                        <thead>
                                            <tr className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                                <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                    Ticket
                                                </th>
                                                <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                    Category
                                                </th>
                                                <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                    Priority
                                                </th>
                                                <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                    Property
                                                </th>
                                                <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                    Preferred visit
                                                </th>
                                                <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                    Status
                                                </th>
                                                {canManageTickets && (
                                                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-500">
                                                        Update status
                                                    </th>
                                                )}
                                                <th scope="col" className="py-3 text-right font-semibold text-slate-500">
                                                    Submitted
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {tickets.map((ticket) => (
                                                <tr key={ticket.id} className="transition-colors hover:bg-slate-50/80">
                                                    <td className="py-4 pr-4 font-medium text-slate-800">
                                                        <div className="flex flex-col">
                                                            <span>{ticket.subject}</span>
                                                            <span className="text-xs text-slate-400">#{ticket.id.toString().padStart(5, '0')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 pr-4 text-slate-700">{ticket.category}</td>
                                                    <td className="py-4 pr-4">
                                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                                            {formatPriority(ticket.priority)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 pr-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-700">{ticket.property_name}</span>
                                                            <span className="text-xs text-slate-400">{ticket.unit_number ?? '—'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 pr-4">{formatDate(ticket.preferred_visit_date ?? null)}</td>
                                                    <td className="py-4 pr-4">
                                                        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                                                            {formatStatus(ticket.status)}
                                                        </span>
                                                    </td>
                                                    {canManageTickets && (
                                                        <td className="py-4 pr-4">
                                                            <Select
                                                                value={ticket.status ?? undefined}
                                                                onValueChange={handleStatusChange(ticket.id, ticket.status)}
                                                                disabled={updatingTicketId === ticket.id}
                                                            >
                                                                <SelectTrigger className="w-[190px] rounded-full border-slate-200">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-2xl border border-slate-100 bg-white shadow-xl">
                                                                    {normalizedStatusOptions.map((option) => (
                                                                        <SelectItem key={option} value={option}>
                                                                            {formatStatus(option)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                    )}
                                                    <td className="py-4 text-right text-slate-500">{formatDate(ticket.created_at ?? null)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <MessageCircle className="h-10 w-10 text-slate-400" />
                                <h2 className="text-xl font-semibold text-slate-900">No tickets yet</h2>
                                <p className="max-w-2xl text-sm text-slate-600">
                                    When you submit a maintenance request or concierge inquiry, it will appear here with real-time status updates. Start by creating your first ticket.
                                </p>
                                {!isAdmin && (
                                    <Button asChild variant="outline" className="rounded-full border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300">
                                        <Link href="/ticket-concerns/create">Create ticket</Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
