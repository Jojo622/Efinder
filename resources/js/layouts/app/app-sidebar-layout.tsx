import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { ToastProvider } from '@/components/ui/toast-provider';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <ToastProvider>
            <AppShell variant="sidebar">
                <div className="flex h-svh w-full flex-1 overflow-hidden">
                    <AppSidebar />
                    <AppContent
                        variant="sidebar"
                        className="min-h-svh overflow-hidden bg-gradient-to-br from-[#e6f0ff] via-white to-white"
                    >
                        <div className="flex min-h-0 flex-1 flex-col">
                            <div className="sticky top-0 z-20">
                                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                            </div>
                            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
                                {children}
                            </div>
                        </div>
                    </AppContent>
                </div>
            </AppShell>
        </ToastProvider>
    );
}
