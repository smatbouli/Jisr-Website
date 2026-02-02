'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, ShieldCheck, TrendingUp, Globe, Building2, Search, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import KSAMapBackground from "@/components/KSAMapBackground";
import CircuitBackground from "@/components/CircuitBackground";
import InteractiveGrid from "@/components/InteractiveGrid";
import ShowcaseCarousel from "@/components/ShowcaseCarousel";

export default function HomePageClient({ dbProducts = [] }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const mockProducts = [
        { id: 1, name: t('prod_steel'), priceMin: 450, priceMax: 600, factory: { businessName: t('factory_yamamah') }, imageUrl: null },
        { id: 2, name: t('prod_concrete'), priceMin: 1200, priceMax: 1500, factory: { businessName: t('factory_saudi_concrete') }, imageUrl: null },
        { id: 3, name: t('prod_plastic'), priceMin: 20, priceMax: 25, moq: "5 Tons", factory: { businessName: t('factory_sabic') }, imageUrl: null },
        { id: 4, name: t('prod_ceramics'), priceMin: 45, priceMax: 80, factory: { businessName: t('factory_ceramics') }, imageUrl: null },
        { id: 5, name: t('prod_copper'), priceMin: 15, priceMax: 18, moq: "1000m", factory: { businessName: t('factory_cables') }, imageUrl: null },
    ];

    // Use DB products if available, otherwise use mock
    const displayProducts = dbProducts.length > 0 ? dbProducts : mockProducts;

    return (
        <div className={`flex flex-col min-h-screen font-sans overflow-x-hidden ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* 2. Hero Section - Refined & Animated */}
            <section className="-mt-20 relative w-full min-h-[90vh] flex items-center bg-[#072418] text-white pt-48 pb-32 overflow-hidden">
                {/* Background: Map & Gradients */}
                <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#072418] via-[#072418]/60 to-transparent" />

                    <KSAMapBackground className="absolute right-0 top-10 w-[600px] h-[600px] opacity-80 text-[#4ade80] rotate-[-5deg]" />
                    <CircuitBackground />

                    {/* Subtle floating particles */}
                    <motion.div
                        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
                    />
                </div>

                {/* Interactive Grid Overlay */}
                <InteractiveGrid />

                <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Copy */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-xl relative"
                    >
                        {/* Decorative line */}
                        <motion.div variants={itemVariants} className="w-20 h-1 bg-green-500 mb-8 rounded-full" />

                        <motion.h1
                            variants={itemVariants}
                            className={`text-5xl md:text-7xl font-sans font-medium tracking-tight leading-[1.1] mb-6 ${isArabic ? 'font-arabic font-bold' : ''}`}
                        >
                            {t('hero_title_redesign')}
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-light">
                            {t('hero_desc_redesign')}
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <Link href="/factories" className="relative overflow-hidden group px-8 py-3.5 border border-white/20 text-white rounded-full font-medium transition-all hover:border-green-400">
                                <span className="relative z-10">{t('Browse Factories')}</span>
                                <div className="absolute inset-0 bg-green-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                            </Link>
                            <Link href="/contact" className="px-8 py-3.5 bg-[#d1fae5] text-[#064e3b] rounded-full font-medium hover:bg-[#a7f3d0] hover:shadow-lg hover:shadow-green-400/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
                                {t('Request Access')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right Abstract UI - Animated Complex Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, type: "spring" }}
                        className="relative hidden lg:block h-[600px] w-full flex items-center justify-center p-10 perspective-[2000px]"
                    >
                        {/* Layer 2: Background Blur Card (Floating) */}
                        <motion.div
                            animate={{ y: [-10, 10, -10], rotate: [-6, -4, -6] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-12 right-12 w-[380px] h-[260px] bg-white/5 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl"
                        />

                        {/* Layer 1: Main Glass Card (Floating opposing) */}
                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-[450px] bg-[#0f3526]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl ring-1 ring-white/10"
                        >
                            {/* Shining effect */}
                            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/5 to-transparent rotate-45 animate-shine" />
                            </div>

                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl text-white font-medium mb-1">{t('factory_profile')}</h3>
                                    <div className="flex gap-1">
                                        <div className="h-1 w-8 bg-green-500 rounded-full" />
                                        <div className="h-1 w-2 bg-green-500/50 rounded-full" />
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                                    <Building2 size={24} className="text-green-400" />
                                </div>
                            </div>

                            {/* Card Content - Data Rows */}
                            <div className="space-y-6 mb-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                    className="flex justify-between items-center border-b border-white/5 pb-3 group"
                                >
                                    <span className="text-gray-400 text-sm font-light">{t('Factory')}</span>
                                    <span className="text-white font-mono text-sm tracking-wide group-hover:text-green-300 transition-colors uppercase">{t('saudi_paper')}</span>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                                    className="flex justify-between items-center border-b border-white/5 pb-3"
                                >
                                    <span className="text-gray-400 text-sm font-light">{t('location')}</span>
                                    <span className="text-white font-mono text-sm tracking-wide">{t('riyadh_sa')}</span>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}
                                    className="flex justify-between items-center border-b border-white/5 pb-3"
                                >
                                    <span className="text-gray-400 text-sm font-light">{t('status')}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-white font-mono text-sm tracking-wide">{t('status_active')}</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Card Footer - Badges */}
                            <div className="flex items-center justify-between">
                                <div className="px-4 py-2 bg-black/20 rounded-full border border-white/5 flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{t('permit')}:</span>
                                    <span className="text-xs text-white font-mono">#IND-9321</span>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#78350f] rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-default"
                                >
                                    <ShieldCheck size={16} />
                                    {t('verified_factory')}
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 3. Trust Strip */}
            <section className="bg-[#081f18] border-t border-white/10 py-8 text-gray-300">
                <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-6 text-sm font-medium">
                    <div className="flex items-center gap-3">
                        <Building2 size={18} className="text-[#4ade80]" />
                        <span>{t('Saudi-based factories only')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={18} className="text-[#4ade80]" />
                        <span>{t('Verified before listing')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search size={18} className="text-[#4ade80]" />
                        <span>{t('Direct buyer-factory communication')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <TrendingUp size={18} className="text-[#4ade80]" />
                        <span>{t('Built for B2B sourcing')}</span>
                    </div>
                </div>
            </section>

            {/* 4. What Jisr Is (Moved UP) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <span className="text-[#0d2e23] font-bold tracking-widest uppercase text-sm mb-2 block">{t('mission_title')}</span>
                        <h2 className={`text-4xl font-bold text-[#0d2e23] mb-6 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                            {t('A marketplace for serious manufacturing')}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {t('mission_desc')}
                        </p>
                        <Link href="/about" className="inline-flex items-center text-[#0d2e23] font-bold hover:underline">
                            {t('Read more about us')} <ArrowUpRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="bg-[#f3f4f6] rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                        {/* Factory Profile Card - Deep Green Theme */}
                        <div className="bg-[#072418] p-6 rounded-xl shadow-2xl w-full max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-white/10 relative overflow-hidden">
                            <CircuitBackground className="absolute inset-0 opacity-20 pointer-events-none" />
                            {/* Mockup Data */}
                            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 relative z-10">
                                <div className="font-bold text-white">{t('factory_profile')}</div>
                            </div>
                            <div className="space-y-3 text-sm relative z-10">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">{t('industry')}</span>
                                    <span className="font-mono text-white">{t('packaging')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">{t('capacity')}</span>
                                    <span className="font-mono text-white">1.2M {t('units_mo')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">{t('location')}</span>
                                    <span className="font-mono text-white">{t('riyadh_sa')}</span>
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <span className="px-3 py-1 bg-white/10 text-gray-300 rounded text-xs">{t('from_date')} 1998</span>
                                    <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] rounded text-xs font-bold border border-[#4ade80]/20">{t('verified')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.5 Featured Products Showcase (DB Connected) */}
            <section className="bg-gray-50 border-b border-gray-200">
                <ShowcaseCarousel
                    title={t('featured_products')}
                    subtitle={t('latest_additions_subtitle')}
                    products={displayProducts}
                    linkText="view_all_products"
                    linkHref="/products"
                />
            </section>

            {/* 5. For Buyers & Factories */}
            <section className="py-24 bg-[#f8fafc]">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
                    {/* Buyers */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-8 md:p-12 rounded-3xl bg-white border border-gray-100 shadow-sm"
                    >
                        <h3 className="text-2xl font-bold text-[#0d2e23] mb-2">{t('for_buyers')}</h3>
                        <p className="text-gray-500 mb-8">{t('Source locally. Reduce risk.')}</p>
                        <ul className="space-y-4 mb-8">
                            {[
                                'Verified Saudi manufacturers',
                                'Clear production capabilities',
                                'Faster lead times',
                                'Direct communication'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-[#0d2e23] text-white rounded-full p-1"><CheckCircle size={12} /></div>
                                    {t(item)}
                                </li>
                            ))}
                        </ul>
                        <Link href="/factories" className="block w-full py-4 text-center bg-[#0d2e23] text-white rounded-xl font-bold hover:bg-[#1a4731] transition-colors">
                            {t('Browse Factories')}
                        </Link>
                    </motion.div>

                    {/* Factories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="p-8 md:p-12 rounded-3xl bg-[#e6ebe9] border border-transparent"
                    >
                        <h3 className="text-2xl font-bold text-[#0d2e23] mb-2">{t('for_factories')}</h3>
                        <p className="text-gray-500 mb-8">{t('Connect with qualified buyers.')}</p>
                        <ul className="space-y-4 mb-8">
                            {[
                                'Verification-based listing',
                                'Buyer-only access',
                                'Capability-focused profiles',
                                'Long-term supply relationships'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-[#0d2e23] text-white rounded-full p-1"><CheckCircle size={12} /></div>
                                    {t(item)}
                                </li>
                            ))}
                        </ul>
                        <Link href="/signup?role=factory" className="block w-full py-4 text-center bg-transparent border-2 border-[#0d2e23] text-[#0d2e23] rounded-xl font-bold hover:bg-[#0d2e23] hover:text-white transition-colors">
                            {t('Apply as a Factory')}
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 7. Verification Section */}
            <section className="py-24 bg-[#0d2e23] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#134e3b] to-transparent opacity-20 pointer-events-none" />
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <span className="inline-block px-3 py-1 border border-[#4ade80]/30 text-[#4ade80] rounded-full text-xs font-bold mb-6">
                            {t('view_profile')}
                        </span>
                        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                            {t('Verified before listed')}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            {t('verification_desc')}
                        </p>
                    </div>
                    <div className="bg-[#1a4731] p-8 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6">{t('for_factories')}</h3>
                        <p className="text-gray-300 mb-8">{t('Connect with qualified buyers')}</p>
                        <ul className="space-y-4 mb-8">
                            {['Verification-based listing', 'Buyer-only access', 'Capability-focused profiles', 'Long-term supply relationships'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-200">
                                    <CheckCircle size={16} className="text-[#4ade80]" />
                                    {t(item)}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 bg-[#e8f5e9] text-[#0d2e23] font-bold rounded-lg hover:bg-white transition-colors">
                            {t('Apply as a Factory')}
                        </button>
                    </div>
                </div>
            </section>

            {/* 8. Final CTA */}
            <section className="py-24 bg-gradient-to-b from-[#081f18] to-black text-center text-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-10 leading-tight ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                        {t('Start buying from Saudi factories with confidence')}
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/factories" className="px-10 py-4 bg-transparent border border-white/30 rounded-full font-bold hover:bg-white/10 transition-colors">
                            {t('Browse Factories')}
                        </Link>
                        <Link href="/contact" className="px-10 py-4 bg-[#1a4731] text-white rounded-full font-bold hover:bg-[#235e41] transition-colors">
                            {t('Request Access')}
                        </Link>
                    </div>
                    <p className="mt-12 text-gray-500 text-sm">{t('footer_tagline')}</p>
                </div>
            </section>
        </div>
    );
}
