"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Option = {
    value: string;
    label: string;
    hint?: ReactNode;
};

export type SearchableSelectProps = {
    options: Option[];
    value?: string | null;
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    emptyMessage?: string;
    clearLabel?: string;
    id?: string;
    className?: string;
    inputClassName?: string;
    listClassName?: string;
    ariaLabel?: string;
};

export function SearchableSelect({
    options,
    value,
    onValueChange,
    placeholder,
    emptyMessage,
    clearLabel,
    id,
    className,
    inputClassName,
    listClassName,
    ariaLabel,
}: SearchableSelectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const selectedOption = useMemo(
        () =>
            value != null
                ? options.find((option) => option.value === value) ?? null
                : null,
        [options, value]
    );

    const filteredOptions = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) {
            return options;
        }
        return options.filter((option) =>
            option.label.toLowerCase().includes(trimmed)
        );
    }, [options, query]);

    useEffect(() => {
        if (!isOpen) {
            setQuery(selectedOption?.label ?? "");
            setActiveIndex(-1);
        }
    }, [isOpen, selectedOption]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const commitSelection = useCallback(
        (option: Option | null) => {
            onValueChange?.(option ? option.value : null);
            setIsOpen(false);
            if (option) {
                setQuery(option.label);
            }
        },
        [onValueChange]
    );

    const handleInputFocus = useCallback(() => {
        setIsOpen(true);
        setQuery(selectedOption?.label ?? "");
        setTimeout(() => {
            inputRef.current?.select();
        }, 0);
    }, [selectedOption]);

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex((index) => {
                    const nextIndex = Math.min(
                        index + 1,
                        filteredOptions.length - 1
                    );
                    return nextIndex < 0 ? 0 : nextIndex;
                });
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
                break;
            }
            case "Enter": {
                if (isOpen) {
                    event.preventDefault();
                    const option =
                        activeIndex >= 0
                            ? filteredOptions[activeIndex]
                            : filteredOptions[0];
                    if (option) {
                        commitSelection(option);
                    }
                }
                break;
            }
            case "Tab": {
                setIsOpen(false);
                break;
            }
        }
    };

    const handleOptionClick = (option: Option) => {
        commitSelection(option);
    };

    const handleClearSelection = () => {
        commitSelection(null);
        setQuery("");
        setIsOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <div
                className={cn(
                    "flex items-center gap-2 rounded-xl border border-[var(--emerald-200)] bg-white px-3 text-sm text-[var(--emerald-900)] transition focus-within:border-[var(--emerald-400)] focus-within:ring-2 focus-within:ring-[var(--emerald-200)]",
                    inputClassName
                )}
            >
                <input
                    ref={inputRef}
                    id={id}
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    aria-label={ariaLabel ?? placeholder}
                    className="h-11 w-full border-0 bg-transparent outline-none placeholder:text-[var(--emerald-400)]"
                />
                {selectedOption ? (
                    <button
                        type="button"
                        onClick={handleClearSelection}
                        aria-label={clearLabel ?? "Clear selection"}
                        className="text-xs font-semibold uppercase tracking-wide text-[var(--emerald-500)] transition hover:text-[var(--emerald-600)] focus:outline-none focus:ring-2 focus:ring-[var(--emerald-500)] focus:ring-offset-2 focus:ring-offset-white"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                ) : null}
            </div>
            <div
                className={cn(
                    "absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-[var(--emerald-100)] bg-white shadow-lg",
                    !isOpen && "hidden",
                    listClassName
                )}
                role="listbox"
            >
                {filteredOptions.length ? (
                    <ul className="max-h-60 overflow-auto py-2">
                        {filteredOptions.map((option, index) => {
                            const isSelected =
                                option.value === selectedOption?.value;
                            const isActive = index === activeIndex;
                            return (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        className={cn(
                                            "flex w-full flex-col gap-1 px-3 py-2 text-left text-sm transition",
                                            isActive &&
                                                "bg-[var(--emerald-50)] text-[var(--emerald-900)]",
                                            isSelected &&
                                                "font-medium text-[var(--emerald-700)]"
                                        )}
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onMouseLeave={() => setActiveIndex(-1)}
                                        onClick={() =>
                                            handleOptionClick(option)
                                        }
                                    >
                                        <span>{option.label}</span>
                                        {option.hint ? (
                                            <span className="text-xs text-[var(--emerald-500)]">
                                                {option.hint}
                                            </span>
                                        ) : null}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="px-3 py-4 text-sm text-[var(--emerald-500)]">
                        {emptyMessage ?? placeholder}
                    </div>
                )}
            </div>
            {!selectedOption && placeholder ? (
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-[var(--emerald-400)]">
                    {query ? null : placeholder}
                </div>
            ) : null}
        </div>
    );
}
