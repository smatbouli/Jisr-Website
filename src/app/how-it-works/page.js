'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Search, FileText, CheckCircle, Truck, Factory, UserCheck, MessageSquare, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function HowItWorksPage() {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    const buyerSteps = [
        { icon: Search, title: t('hiw_b_step1_title'), desc: t('hiw_b_step1_desc') },
        { icon: FileText, title: t('hiw_b_step2_title'), desc: t('hiw_b_step2_desc') },
        { icon: CheckCircle, title: t('hiw_b_step3_title'), desc: t('hiw_b_step3_desc') },
        { icon: Truck, title: t('hiw_b_step4_title'), desc: t('hiw_b_step4_desc') }
    ];

    const factorySteps = [
        { icon: UserCheck, title: t('hiw_f_step1_title'), desc: t('hiw_f_step1_desc') },
        { icon: Search, title: t('hiw_f_step2_title'), desc: t('hiw_f_step2_desc') },
        { icon: DollarSign, title: t('hiw_f_step3_title'), desc: t('hiw_f_step3_desc') },
        { icon: Factory, title: t('hiw_f_step4_title'), desc: t('hiw_f_step4_desc') }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={`bg-surface-50 min-h-screen ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <section className="relative py-24 bg-primary-900 overflow-hidden text-center text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-4xl md:text-5xl font-bold mb-6 ${isArabic ? 'font-arabic' : 'font-heading'}`}
                    >
                        {t('hiw_title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-primary-200 max-w-2xl mx-auto"
                    >
                        {t('hiw_desc')}
                    </motion.p>
                </div>
            </section>

            {/* Buyer Process */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-bold uppercase tracking-wider text-sm bg-primary-50 px-3 py-1 rounded-full">{t('for_buyers')}</span>
                        <h2 className={`text-3xl font-bold text-gray-900 mt-4 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('hiw_buyers_title')}</h2>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
                    >
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10" />

                        {buyerSteps.map((step, i) => (
                            <motion.div key={i} variants={itemVariants} className="text-center md:text-left lg:text-center bg-white lg:bg-transparent p-6 lg:p-0 rounded-xl shadow-sm lg:shadow-none border lg:border-none border-gray-100">
                                <div className="w-24 h-24 mx-auto lg:bg-surface-50 bg-primary-50 rounded-full flex items-center justify-center mb-6 border-4 border-white lg:border-surface-50 shadow-sm relative z-10">
                                    <step.icon size={32} className="text-primary-700" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12">
                        <Link href="/signup">
                            <Button size="lg" className="shadow-lg hover:-translate-y-1 transition-transform">{t('start_sourcing_now')}</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Factory Process */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-accent-600 font-bold uppercase tracking-wider text-sm bg-accent-50 px-3 py-1 rounded-full">{t('for_factories')}</span>
                        <h2 className={`text-3xl font-bold text-gray-900 mt-4 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('hiw_factories_title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            {factorySteps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center shrink-0 text-accent-700">
                                        <step.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                                        <p className="text-gray-600">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="relative h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                                alt="Modern Factory"
                                className="w-full h-full object-cover grayscale opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
                                <h3 className={`text-2xl font-bold mb-2 ${isArabic ? 'font-arabic' : ''}`}>{t('join_elite')}</h3>
                                <p className="text-gray-300 mb-6">{t('join_elite_desc')}</p>
                                <Link href="/signup">
                                    <Button className="bg-white text-gray-900 hover:bg-gray-100 border-none w-full md:w-auto">
                                        {t('register_factory')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-900 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('ready_transform')}</h2>
                    <p className="text-primary-200 text-xl mb-8 max-w-2xl mx-auto">{t('ready_transform_desc')}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 text-white border-none text-lg px-8">{t('get_started_free')}</Button>
                        </Link>
                        <Link href="/factories">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white/10 text-lg px-8">{t('explore_directory')}</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
