import { cn } from "@/lib/utils";
import React from "react";

const buttonVariants = {
    primary: "bg-primary-900 text-white hover:bg-primary-800 shadow-md hover:shadow-lg border-transparent",
    secondary: "bg-accent-600 text-white hover:bg-accent-700 shadow-sm hover:shadow-md border-transparent",
    outline: "bg-transparent border-2 border-primary-900 text-primary-900 hover:bg-primary-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 border-transparent hover:text-gray-900",
    white: "bg-white text-primary-900 hover:bg-gray-50 shadow-md border-transparent"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
};

export const Button = React.forwardRef(({
    className,
    variant = "primary",
    size = "md",
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                buttonVariants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";
