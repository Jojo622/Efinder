import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

interface PublicFooterProps {
    className?: string;
}

const footerNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Available Listings', href: '/available-listings' },
    { label: 'Map Tracker', href: '/map-tracker' },
];

export function PublicFooter({ className }: PublicFooterProps) {
    return (
        <footer className={cn('border-t border-slate-200 bg-white', className)}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-12">
                <div className="max-w-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-900">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                            <Sparkles className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-lg font-semibold tracking-tight">Dagupan E-Finder</p>
                            <p className="text-xs text-slate-500">Curated luxury rentals with concierge-level leasing support.</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">
                        Explore move-in ready apartments, lofts, and condos with guided tours, pricing insights, and trusted relocation experts.
                    </p>
                </div>

                <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:justify-end">
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Discover</h4>
                        <nav className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                            {footerNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="transition-colors duration-200 hover:text-slate-900"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Contact</h4>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <p>Concierge team: concierge@bluehaven.com</p>
                            <p>Leasing inquiries: (555) 214-9087</p>
                            <p>Weekdays 9am – 7pm CT</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-12">
                    <p>© {new Date().getFullYear()} Dagupan E-Finder. All rights reserved.</p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/privacy" className="transition-colors duration-200 hover:text-slate-700">
                            Privacy
                        </Link>
                        <Link href="/terms" className="transition-colors duration-200 hover:text-slate-700">
                            Terms
                        </Link>
                        <Link href="/support" className="transition-colors duration-200 hover:text-slate-700">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default PublicFooter;
