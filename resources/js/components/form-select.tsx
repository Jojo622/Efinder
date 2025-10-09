import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export type FormSelectOption =
    | string
    | {
          value: string;
          label: string;
      };

interface FormSelectProps {
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    options: FormSelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
}

const EMPTY_VALUE = '__FORM_SELECT_EMPTY__';

const toInternalValue = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    return value === '' ? EMPTY_VALUE : value;
};

const fromInternalValue = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    return value === EMPTY_VALUE ? '' : value;
};

export default function FormSelect({
    id,
    name,
    value,
    defaultValue,
    onValueChange,
    options,
    placeholder,
    disabled,
    className,
    triggerClassName,
    contentClassName,
}: FormSelectProps) {
    const normalizedOptions = useMemo(
        () =>
            options.map((option) =>
                typeof option === 'string'
                    ? { value: option, label: option }
                    : option,
            ),
        [options],
    );

    const isControlled = value !== undefined;

    const fallbackExternalValue = useMemo(() => {
        if (defaultValue !== undefined) {
            return defaultValue;
        }

        return normalizedOptions[0]?.value;
    }, [defaultValue, normalizedOptions]);

    const fallbackValue = useMemo(
        () => toInternalValue(fallbackExternalValue),
        [fallbackExternalValue],
    );

    const [internalValue, setInternalValue] = useState<string | undefined>(() =>
        isControlled ? undefined : fallbackValue,
    );

    useEffect(() => {
        if (!isControlled) {
            setInternalValue(fallbackValue);
        }
    }, [fallbackValue, isControlled]);

    const currentValue = isControlled ? toInternalValue(value) : internalValue;

    return (
        <div className={cn('relative', className)}>
            <Select
                value={isControlled ? currentValue : undefined}
                defaultValue={!isControlled ? currentValue : undefined}
                onValueChange={(nextValue) => {
                    if (!isControlled) {
                        setInternalValue(nextValue);
                    }
                    onValueChange?.(fromInternalValue(nextValue) ?? '');
                }}
                disabled={disabled}
            >
                <SelectTrigger
                    id={id}
                    className={cn(
                        'h-9 w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-1 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60',
                        triggerClassName,
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent
                    className={cn(
                        'rounded-xl border border-slate-100 bg-white/95 shadow-xl backdrop-blur-sm',
                        contentClassName,
                    )}
                >
                    {normalizedOptions.map((option) => {
                        const optionValue = toInternalValue(option.value)!;

                        return (
                            <SelectItem key={optionValue} value={optionValue}>
                                {option.label}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            {name ? (
                <input
                    type="hidden"
                    name={name}
                    value={fromInternalValue(currentValue) ?? ''}
                />
            ) : null}
        </div>
    );
}
