'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export default function ShowcaseCarousel({ title, subtitle, products = [], linkText = "See all", linkHref = "/products", darkMode = false, cardTheme = "light" }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const { t, language } = useLanguage();

    // ... existing scroll logic ...

    // Helper for Card Styling
    const isDarkCard = cardTheme === 'dark';
    const cardBg = isDarkCard ? 'bg-[#072418] border-white/10' : 'bg-white border-gray-100';
    const cardTextPrimary = isDarkCard ? 'text-white group-hover/card:text-[#4ade80]' : 'text-gray-900 group-hover/card:text-primary-600';
    const cardTextSecondary = isDarkCard ? 'text-gray-400' : 'text-gray-500';
    const cardMoqBg = isDarkCard ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600';

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const multiplier = language === 'ar' ? -1 : 1;
            const amount = (direction === 'left' ? -400 : 400) * multiplier; // Simple logic
            current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="w-full py-12 group/section relative z-10">
            <div className="container mx-auto px-4 mb-8 flex items-end justify-between">
                <div>
                    <h2 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {title} <span className={`font-normal ml-2 ${darkMode ? 'text-white/60' : 'text-gray-400'}`}>{subtitle}</span>
                    </h2>
                </div>
                {linkHref && (
                    <Link href={linkHref} className={`hidden md:flex items-center text-sm font-medium hover:underline gap-1 ${darkMode ? 'text-green-300 hover:text-green-200' : 'text-primary-600 hover:text-primary-700'}`}>
                        {t(linkText) || linkText} <ChevronRight size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                    </Link>
                )}
            </div>

            <div className="relative group/carousel">
                {/* Navigation Arrows */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200`}
                    >
                        <ArrowLeft size={24} className={language === 'ar' ? 'rotate-180' : ''} />
                    </button>
                )}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200`}
                    >
                        <ArrowRight size={24} className={language === 'ar' ? 'rotate-180' : ''} />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    {products.map((product) => (
                        <div key={product.id} className="snap-center shrink-0 w-[85vw] md:w-[400px]">
                            <Link href={`/products/${product.id}`} className="block h-full">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className={`h-[500px] md:h-[550px] ${cardBg} rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative border flex flex-col group/card`}
                                >
                                    {/* Text Content - Top */}
                                    <div className="p-8 z-10 relative">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                            {product.factory?.businessName || t('new_arrival') || "New Arrival"}
                                        </p>
                                        <h3 className={`text-3xl font-bold mb-2 leading-tight transition-colors ${cardTextPrimary}`}>
                                            {product.name}
                                        </h3>
                                        <p className={`font-medium ${cardTextSecondary}`}>
                                            {t('from') || 'From'} {product.priceMin && product.priceMax
                                                ? `SAR ${product.priceMin} - ${product.priceMax}`
                                                : "SAR " + (1000 + (product.name.length * 100))
                                            }
                                        </p>
                                        {product.moq && (
                                            <span className={`inline-block mt-3 px-2 py-1 ${cardMoqBg} text-xs rounded-md`}>
                                                {t('moq')}: {product.moq}
                                            </span>
                                        )}
                                    </div>

                                    {/* Image - Bottom/Center */}
                                    <div className="absolute top-1/3 bottom-0 left-0 right-0 p-6 flex items-end justify-center">
                                        <div className="relative w-full h-full">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain object-bottom drop-shadow-xl group-hover/card:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                // Abstract fallback if no image
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                                    <span className="text-gray-300 font-bold text-4xl opacity-20">Jisr</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hover Overlay Button (Subtle) */}
                                    <div className={`absolute bottom-8 ${language === 'ar' ? 'left-8' : 'right-8'} z-20 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-4 group-hover/card:translate-y-0`}>
                                        <div className="bg-primary-600 text-white p-3 rounded-full shadow-lg">
                                            <ArrowUpRight size={20} className={language === 'ar' ? 'rotate-180' : ''} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    ))}

                    {/* Last Card - View All */}
                    <div className="snap-center shrink-0 w-[85vw] md:w-[300px] flex items-center justify-center">
                        <Link href={linkHref} className="h-[500px] md:h-[550px] w-full flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-primary-600 transition-colors group">
                            <div className="w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-primary-600 group-hover:scale-110 transition-all">
                                <ArrowRight size={24} className={language === 'ar' ? 'rotate-180' : ''} />
                            </div>
                            <span className="font-medium text-lg">{t(linkText) || linkText}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
