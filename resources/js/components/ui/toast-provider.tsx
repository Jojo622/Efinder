import { usePage } from '@inertiajs/react';
import { CheckCircle2, CircleAlert } from 'lucide-react';
import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

type SuccessToastState = {
    id: number;
    message: string;
    visible: boolean;
};

type ConfirmToastState = {
    id: number;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    resolve: (result: boolean) => void;
};

type ToastContextValue = {
    showSuccess: (message: string) => void;
    showConfirm: (options: {
        title?: string;
        message: string;
        confirmLabel?: string;
        cancelLabel?: string;
    }) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
    const [successToast, setSuccessToast] = useState<SuccessToastState | null>(null);
    const [confirmToast, setConfirmToast] = useState<ConfirmToastState | null>(null);
    const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

    const clearTimers = useCallback(() => {
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current = [];
    }, []);

    const showSuccess = useCallback((message: string) => {
        clearTimers();
        const id = Date.now();

        setSuccessToast({ id, message, visible: false });

        timersRef.current.push(
            setTimeout(() => {
                setSuccessToast((current) => (current && current.id === id ? { ...current, visible: true } : current));
            }, 20),
        );

        timersRef.current.push(
            setTimeout(() => {
                setSuccessToast((current) => (current && current.id === id ? { ...current, visible: false } : current));
            }, 2800),
        );

        timersRef.current.push(
            setTimeout(() => {
                setSuccessToast((current) => (current && current.id === id ? null : current));
            }, 3400),
        );
    }, [clearTimers]);

    const showConfirm = useCallback(
        ({
            title = 'Are you sure?',
            message,
            confirmLabel = 'Confirm',
            cancelLabel = 'Cancel',
        }: {
            title?: string;
            message: string;
            confirmLabel?: string;
            cancelLabel?: string;
        }) =>
            new Promise<boolean>((resolve) => {
                const id = Date.now();
                setConfirmToast({ id, title, message, confirmLabel, cancelLabel, resolve });
            }),
        [],
    );

    const contextValue = useMemo<ToastContextValue>(
        () => ({
            showSuccess,
            showConfirm,
        }),
        [showConfirm, showSuccess],
    );

    useEffect(() => clearTimers, [clearTimers]);

    const { props } = usePage<{ flash?: { success?: string } }>();
    const flashSuccess = props.flash?.success;

    useEffect(() => {
        if (flashSuccess) {
            showSuccess(flashSuccess);
        }
    }, [flashSuccess, showSuccess]);

    const handleConfirm = (result: boolean) => {
        if (!confirmToast) {
            return;
        }

        confirmToast.resolve(result);
        setConfirmToast(null);
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            <div className="pointer-events-none fixed inset-0 z-[120] flex flex-col items-center justify-center gap-4 px-4">
                {successToast && (
                    <div
                        className={cn(
                            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-emerald-200/70 bg-white/95 p-4 text-sm text-slate-700 shadow-2xl backdrop-blur transition-all duration-300 ease-out md:max-w-md transform-gpu',
                            successToast.visible
                                ? 'translate-y-0 scale-100 opacity-100'
                                : 'translate-y-4 scale-95 opacity-0',
                        )}
                        role="status"
                        aria-live="polite"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900">Success</p>
                            <p className="text-slate-600">{successToast.message}</p>
                        </div>
                    </div>
                )}
            </div>

            {confirmToast && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/40 px-6 py-8">
                    <div className="pointer-events-auto w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/95 p-8 text-center text-slate-700 shadow-2xl backdrop-blur">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <CircleAlert className="h-7 w-7" />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-slate-900">{confirmToast.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">{confirmToast.message}</p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-slate-300 px-6"
                                onClick={() => handleConfirm(false)}
                            >
                                {confirmToast.cancelLabel}
                            </Button>
                            <Button
                                type="button"
                                className="rounded-full bg-slate-900 px-6 text-white shadow-lg transition hover:bg-slate-800"
                                onClick={() => handleConfirm(true)}
                            >
                                {confirmToast.confirmLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}
