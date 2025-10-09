import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type Auth, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    CalendarClock,
    CreditCard,
    LayoutGrid,
    LifeBuoy,
    Settings,
    Signal,
    UserCog,
    Users2,
} from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Property Portfolio',
        href: '/properties',
        icon: Building2,
    },
    {
        title: 'Tenants',
        href: '/tenants',
        icon: Users2,
    },
    {
        title: 'Reservations',
        href: '/reservations',
        icon: CalendarClock,
    },
    {
        title: 'Payments & Invoices',
        href: '/payments-invoices',
        icon: CreditCard,
    },
    {
        title: 'Ticket Concerns',
        href: '/ticket-concerns',
        icon: LifeBuoy,
    },
    {
        title: 'Owners',
        href: '/owners',
        icon: UserCog,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Support Center',
        href: '#',
        icon: LifeBuoy,
    },
    {
        title: 'Knowledge Base',
        href: '#',
        icon: BookOpen,
    },
    {
        title: 'System Status',
        href: '#',
        icon: Signal,
    },
];

export function AppSidebar() {
    const { props } = usePage<{ auth: Auth }>();
    const role = (props.auth?.user?.role ?? '').toLowerCase();

    const allowedTitles = useMemo(() => {
        const roleMenu: Record<string, string[]> = {
            admin: mainNavItems.map((item) => item.title),
            owner: [
                'Dashboard',
                'Property Portfolio',
                'Tenants',
                'Reservations',
                'Payments & Invoices',
                'Settings',
            ],
            tenant: ['Dashboard', 'Payments & Invoices', 'Settings', 'Ticket Concerns'],
        };

        return roleMenu[role] ?? roleMenu.admin;
    }, [role]);

    const filteredNavItems = useMemo(
        () => mainNavItems.filter((item) => allowedTitles.includes(item.title)),
        [allowedTitles],
    );

    return (
        <Sidebar
            collapsible="icon"
            className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl"
        >
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -left-16 top-20 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />
                <div className="absolute bottom-10 right-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
            </div>
            <SidebarHeader className="relative z-10 pb-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="relative z-10">
                <NavMain items={filteredNavItems} label="Rental Intelligence" />
            </SidebarContent>

            <SidebarFooter className="relative z-10 pb-4">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
