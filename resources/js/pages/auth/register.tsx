import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import FormSelect from '@/components/form-select';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [selectedRole, setSelectedRole] = useState('owner');
    const businessPermitInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const hiddenRoleInput = document.querySelector<HTMLInputElement>('input[name="role"]');

        if (hiddenRoleInput?.value) {
            setSelectedRole(hiddenRoleInput.value);
        }
    }, []);

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);

        if (value !== 'owner' && businessPermitInputRef.current) {
            businessPermitInputRef.current.value = '';
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                encType="multipart/form-data"
                resetOnSuccess={['password', 'password_confirmation', 'business_permit']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">First name</Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="given-name"
                                        name="first_name"
                                        placeholder="First name"
                                    />
                                    <InputError
                                        message={errors.first_name}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        required
                                        tabIndex={2}
                                        autoComplete="family-name"
                                        name="last_name"
                                        placeholder="Last name"
                                    />
                                    <InputError
                                        message={errors.last_name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="mobile_number">Mobile number</Label>
                                <Input
                                    id="mobile_number"
                                    type="tel"
                                    tabIndex={3}
                                    autoComplete="tel"
                                    name="mobile_number"
                                    placeholder="09XX XXX XXXX"
                                />
                                <InputError
                                    message={errors.mobile_number}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <FormSelect
                                    id="role"
                                    name="role"
                                    value={selectedRole}
                                    options={[
                                        { value: 'owner', label: 'Owner' },
                                        { value: 'tenant', label: 'Tenant' },
                                    ]}
                                    placeholder="Select role"
                                    onValueChange={handleRoleChange}
                                    triggerClassName="rounded-md border border-input bg-background px-3 text-sm font-normal text-foreground focus-visible:ring-ring"
                                    contentClassName="border-slate-200 bg-white"
                                />
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>

                            {selectedRole === 'owner' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="business_permit">Business permit</Label>
                                    <input
                                        id="business_permit"
                                        name="business_permit"
                                        ref={businessPermitInputRef}
                                        type="file"
                                        accept=".pdf,image/*"
                                        required
                                        className="w-full cursor-pointer rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition focus:border-blue-500 focus:outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:border-slate-400"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload a valid business permit to activate owner verification.
                                    </p>
                                    <InputError
                                        message={errors.business_permit}
                                        className="mt-1"
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={5}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={8}
                                data-test="register-user-button"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
