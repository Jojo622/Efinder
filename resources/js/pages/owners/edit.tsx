import OwnerController from '@/actions/App/Http/Controllers/Client/OwnerController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, UserCog } from 'lucide-react';

interface OwnerFormProps {
    owner: {
        id: number;
        first_name: string;
        last_name: string;
        name: string;
        email: string;
        mobile_number: string | null;
    };
}

const breadcrumbs = (owner: OwnerFormProps['owner']): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Owners',
        href: '/owners',
    },
    {
        title: owner.name,
        href: `/owners/${owner.id}/edit`,
    },
];

export default function EditOwner({ owner }: OwnerFormProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(owner)}>
            <Head title={`Edit ${owner.name}`} />
            <div className="relative flex h-full flex-1 flex-col gap-10 overflow-x-hidden px-6 pb-12 pt-6 lg:px-12">
                <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#4338ca] p-8 text-white shadow-[0_35px_90px_-60px_rgba(15,23,42,0.85)]">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                                    <UserCog className="h-4 w-4" /> Relationship profile
                                </span>
                                <h1 className="text-3xl font-semibold">Refine {owner.first_name}&rsquo;s partnership details</h1>
                                <p className="max-w-2xl text-sm text-white/80">
                                    Keep contact information polished so asset management, concierge, and finance teams can align effortlessly with each owner.
                                </p>
                            </div>
                            <Link
                                href="/owners"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to owners
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-[0_35px_90px_-60px_rgba(15,23,42,0.35)]">
                    <Form {...OwnerController.update.form(owner.id)} className="space-y-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">First name</span>
                                        <Input name="first_name" defaultValue={owner.first_name} placeholder="Avery" required />
                                        <InputError message={errors.first_name} />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Last name</span>
                                        <Input name="last_name" defaultValue={owner.last_name} placeholder="Santos" required />
                                        <InputError message={errors.last_name} />
                                    </label>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Email address</span>
                                        <Input
                                            name="email"
                                            type="email"
                                            defaultValue={owner.email}
                                            placeholder="owner@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-900">Mobile number</span>
                                        <Input
                                            name="mobile_number"
                                            defaultValue={owner.mobile_number ?? ''}
                                            placeholder="0917 123 4567"
                                        />
                                        <InputError message={errors.mobile_number} />
                                    </label>
                                </div>

                                <div className="flex items-center justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </AppLayout>
    );
}
