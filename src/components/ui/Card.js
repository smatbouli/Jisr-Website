import { cn } from "@/lib/utils";

export function Card({ className, children, variant = "default", ...props }) {
    const variants = {
        default: "bg-white border border-gray-100 shadow-sm hover:shadow-md",
        glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-lg",
        flat: "bg-surface-50 border border-transparent"
    };

    return (
        <div
            className={cn("rounded-xl overflow-hidden transition-all duration-300", variants[variant], className)}
            {...props}
        >
            {children}
        </div>
    );
}
