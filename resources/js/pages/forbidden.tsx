import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Access Denied',
        href: '/forbidden',
    },
];

export default function Forbidden() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Access Denied" />
            <div className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 lg:px-12">
                <div className="absolute inset-0">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-slate-50" />
                    <PlaceholderPattern className="pointer-events-none absolute -left-24 top-12 h-72 w-72 stroke-rose-200/50" />
                    <PlaceholderPattern className="pointer-events-none absolute bottom-6 right-0 h-64 w-64 stroke-slate-200/60" />
                </div>
                <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-rose-100/80 bg-white/90 p-10 text-center shadow-[0_45px_90px_-60px_rgba(190,18,60,0.45)]">
                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">
                        <ShieldAlert className="h-4 w-4" /> Restricted area
                    </span>
                    <h1 className="text-3xl font-semibold text-slate-900">You don&rsquo;t have permission to view this page</h1>
                    <p className="text-sm leading-relaxed text-slate-600">
                        The section you&rsquo;re trying to access is limited based on your current role. If you believe this is a mistake,
                        please contact your platform administrator so they can adjust your access.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Button asChild className="rounded-full px-6 py-2.5 text-sm font-semibold">
                            <Link href={dashboard()}>Return to dashboard</Link>
                        </Button>
                        <Link
                            href="mailto:support@efinder.com"
                            className="text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
                        >
                            Contact support
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
