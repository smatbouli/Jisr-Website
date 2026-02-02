'use client';

import { motion } from "framer-motion";

export default function KSAMapBackground({ className = "" }) {
    // A high-fidelity simplified path for Saudi Arabia
    // This traces the Red Sea coast, the northern borders, the Gulf coast, and the southern borders.
    const ksaDetailedPath = "M125 60 L 180 55 L 240 60 L 300 70 L 330 90 L 360 140 L 400 160 L 410 200 L 450 220 L 440 300 L 500 320 L 550 350 L 520 450 L 350 480 L 220 460 L 150 420 L 120 350 L 100 250 L 130 150 L 125 60 Z";

    // Re-drawing a better approximation suitable for the hero background
    const finalPath = "M100,50 L250,60 L350,90 L400,150 L380,220 L420,250 L440,300 L420,350 L500,380 L520,450 L350,480 L200,470 L150,440 L80,350 L90,200 L110,100 L100,50 Z";

    // Real attempt at the geography relative to a 600x600 viewBox
    // West Coast (Red Sea): ~ x=100, y=100 to x=150, y=500
    // East Coast (Gulf): ~ x=450, y=200
    const realMapPath = `
    M 120 80 
    L 250 85
    L 320 120
    L 350 150
    L 360 220
    L 400 240
    L 390 280
    L 420 300
    L 500 350
    L 450 480
    L 250 500
    L 180 480
    L 160 400
    L 130 250
    L 110 150
    Z
  `;

    return (
        <motion.svg
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.02" />
                </linearGradient>
            </defs>

            <motion.path
                d={realMapPath}
                fill="url(#mapGradient)"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* City Markers - Approximate locations */}
            {/* Riyadh (Central) */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                <circle cx="280" cy="280" r="4" fill="#4ade80" />
                <circle cx="280" cy="280" r="10" stroke="#4ade80" strokeWidth="0.5" opacity="0.5">
                    <animate attributeName="r" from="10" to="20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
            </motion.g>

            {/* Jeddah (West) */}
            <motion.circle cx="140" cy="300" r="3" fill="#4ade80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.7 }} />

            {/* Dammam (East) */}
            <motion.circle cx="390" cy="250" r="3" fill="#4ade80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.9 }} />

            {/* NEOM/Tabuk (North West) */}
            <motion.circle cx="115" cy="110" r="3" fill="#4ade80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3.1 }} />

        </motion.svg>
    );
}
