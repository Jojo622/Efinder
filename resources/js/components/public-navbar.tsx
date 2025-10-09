import { dashboard, login, register } from '@/routes';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

type PublicNavKey = 'home' | 'listings' | 'map';

interface PublicNavbarProps {
    active?: PublicNavKey;
    className?: string;
}

const navItems: { key: PublicNavKey; label: string; href: string }[] = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'listings', label: 'Available Listings', href: '/available-listings' },
    { key: 'map', label: 'Map Tracker', href: '/map-tracker' },
];

export function PublicNavbar({ active, className }: PublicNavbarProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className={cn('border-b border-slate-200 bg-white/90 backdrop-blur', className)}>
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-6 lg:px-12">
                <Link href="/" className="flex items-center gap-3 text-slate-900">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                        <Sparkles className="h-5 w-5" />
                    </span>
                    <span className="text-xl font-semibold tracking-tight">Dagupan E-Finder</span>
                </Link>

                <nav className="flex flex-1 flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-600 lg:justify-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={cn(
                                'transition-colors duration-200 hover:text-slate-900',
                                active === item.key ? 'text-slate-900' : undefined,
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3 text-sm font-medium">
                    {auth.user ? (
                        <Link
                            href={dashboard()}
                            className="rounded-full border border-blue-600/20 bg-blue-600/10 px-5 py-2 text-blue-700 transition-colors duration-200 hover:border-blue-600/40 hover:bg-blue-600/20"
                        >
                            Go to dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="rounded-full px-4 py-2 text-slate-600 transition-colors duration-200 hover:text-slate-900"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                Create account
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default PublicNavbar;
