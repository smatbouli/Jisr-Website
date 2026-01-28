"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I will use clsx/tailwind-merge directly or create utils.

const DialogContext = React.createContext({});

export function Dialog({ children, open, onOpenChange }) {
    const [isOpen, setIsOpen] = React.useState(open || false);

    React.useEffect(() => {
        if (open !== undefined) setIsOpen(open);
    }, [open]);

    const handleOpenChange = (value) => {
        setIsOpen(value);
        onOpenChange?.(value);
    };

    return (
        <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({ children, asChild, className, ...props }) {
    const { setIsOpen } = React.useContext(DialogContext);

    if (asChild) {
        return React.cloneElement(children, {
            onClick: () => setIsOpen(true),
            ...props
        });
    }

    return (
        <button
            className={className}
            onClick={() => setIsOpen(true)}
            {...props}
        >
            {children}
        </button>
    );
}

export function DialogContent({ children, className }) {
    const { isOpen, setIsOpen } = React.useContext(DialogContext);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <div className={`relative z-50 w-full max-w-lg bg-white p-6 rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200 ${className}`}>
                {children}
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </div>
    );
}

export function DialogHeader({ className, ...props }) {
    return (
        <div
            className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
            {...props}
        />
    );
}

export function DialogTitle({ className, ...props }) {
    return (
        <h2
            className={`text-lg font-semibold leading-none tracking-tight ${className}`}
            {...props}
        />
    );
}
