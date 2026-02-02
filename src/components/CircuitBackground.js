'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CircuitBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Animated Lines */}
                <motion.path
                    d="M 0 100 H 1000"
                    stroke="url(#line-gradient)"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* Floating Orbs */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl mix-blend-screen"
            />
            <motion.div
                animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen"
            />
        </div>
    );
}
