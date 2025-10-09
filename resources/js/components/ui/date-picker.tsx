import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    name: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

interface CalendarDay {
    date: Date;
    inMonth: boolean;
    key: string;
}

function formatIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplay(value: string | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

function createCalendar(month: Date): CalendarDay[] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const startDay = firstDay.getDay();
    const gridStart = new Date(year, monthIndex, 1 - startDay);
    const days: CalendarDay[] = [];

    for (let index = 0; index < 42; index++) {
        const current = new Date(gridStart);
        current.setDate(gridStart.getDate() + index);
        days.push({
            date: current,
            inMonth: current.getMonth() === monthIndex,
            key: formatIso(current) + index,
        });
    }

    return days;
}

export function DatePicker({
    name,
    value: controlledValue,
    onChange,
    placeholder = 'Select date',
    disabled = false,
    className,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(controlledValue ?? null);
    const [month, setMonth] = useState(() => {
        if (controlledValue) {
            const date = new Date(controlledValue);
            if (!Number.isNaN(date.getTime())) {
                return date;
            }
        }

        return new Date();
    });
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (controlledValue === selectedValue) {
            return;
        }

        setSelectedValue(controlledValue ?? null);

        if (controlledValue) {
            const date = new Date(controlledValue);
            if (!Number.isNaN(date.getTime())) {
                setMonth(date);
            }
        }
    }, [controlledValue, selectedValue]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const calendarDays = useMemo(() => createCalendar(month), [month]);

    const handleSelect = (date: Date) => {
        const iso = formatIso(date);
        setSelectedValue(iso);
        onChange?.(iso);
        setOpen(false);
    };

    const handleClear = () => {
        setSelectedValue(null);
        onChange?.(null);
    };

    const displayValue = formatDisplay(selectedValue);

    return (
        <div className={cn('relative', className)} ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((previous) => !previous)}
                className={cn(
                    'flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0',
                    disabled && 'cursor-not-allowed opacity-70',
                )}
            >
                <span className={displayValue ? 'text-slate-900' : 'text-slate-400'}>
                    {displayValue || placeholder}
                </span>
                <CalendarDays className="h-4 w-4 text-slate-400" />
            </button>

            <input type="hidden" name={name} value={selectedValue ?? ''} />

            {selectedValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-9 top-1/2 -translate-y-1/2 rounded-full border border-transparent p-1 text-slate-400 transition hover:text-slate-600"
                    aria-label="Clear date"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}

            {open && (
                <div className="absolute left-1/2 bottom-[calc(100%+0.75rem)] z-50 w-80 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-2xl outline outline-1 outline-slate-100/60">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="rounded-full border border-slate-200 p-1 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                            onClick={() =>
                                setMonth((current) => {
                                    const next = new Date(current);
                                    next.setMonth(current.getMonth() - 1);
                                    return next;
                                })
                            }
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="text-sm font-semibold text-slate-900">
                            {new Intl.DateTimeFormat('en-US', {
                                year: 'numeric',
                                month: 'long',
                            }).format(month)}
                        </div>
                        <button
                            type="button"
                            className="rounded-full border border-slate-200 p-1 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                            onClick={() =>
                                setMonth((current) => {
                                    const next = new Date(current);
                                    next.setMonth(current.getMonth() + 1);
                                    return next;
                                })
                            }
                            aria-label="Next month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <span key={day}>{day}</span>
                        ))}
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-1">
                        {calendarDays.map(({ date, inMonth, key }) => {
                            const iso = formatIso(date);
                            const isSelected = selectedValue === iso;

                            return (
                                <button
                                    type="button"
                                    key={key}
                                    className={cn(
                                        'flex h-9 items-center justify-center rounded-full text-sm transition',
                                        inMonth ? 'text-slate-700 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-100/70',
                                        isSelected && 'bg-blue-500 text-white hover:bg-blue-600 shadow-md',
                                    )}
                                    onClick={() => handleSelect(date)}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatePicker;
