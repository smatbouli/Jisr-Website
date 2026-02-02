'use client';
import { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
    const containerRef = useRef(null);

    useEffect(() => {
        const updateMousePosition = (ev) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = ev;
            const { left, top } = containerRef.current.getBoundingClientRect();
            const x = clientX - left;
            const y = clientY - top;
            containerRef.current.style.setProperty('--x', `${x}px`);
            containerRef.current.style.setProperty('--y', `${y}px`);
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            style={{ '--x': '-1000px', '--y': '-1000px' }} // Initial off-screen position
        >
            {/* Base Grid - Faint White Dots */}
            <div
                className="absolute inset-0 opacity-[0.1]"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Glow Grid - Bright Green Dots, revealed by mask */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(#4ade80 2px, transparent 2px)',
                    backgroundSize: '30px 30px',
                    maskImage: 'radial-gradient(300px circle at var(--x) var(--y), black, transparent)',
                    WebkitMaskImage: 'radial-gradient(300px circle at var(--x) var(--y), black, transparent)'
                }}
            />
        </div>
    );
}
