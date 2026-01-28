'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, MapPin, Factory, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function FactoryDirectory({ factories, searchParams }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`bg-surface-50 min-h-screen py-12 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold text-primary-900 mb-4 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('factories_title')}</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('factories_desc')}
                    </p>
                </div>

                {/* Filter Section */}
                <Card className="p-6 mb-12 border-none shadow-lg bg-white/80 backdrop-blur">
                    <form className="flex flex-col lg:flex-row gap-4 items-end" action="/factories" method="GET">
                        <div className="w-full lg:flex-1 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t('search_label')}</label>
                            <div className="relative">
                                <Search className={`absolute top-3 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                                <Input
                                    name="q"
                                    placeholder={t('search_placeholder')}
                                    className={isArabic ? 'pr-10' : 'pl-10'}
                                    defaultValue={searchParams?.q}
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-48 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t('city_label')}</label>
                            <div className="relative">
                                <MapPin className={`absolute top-3 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                                <select
                                    name="city"
                                    className={`w-full h-12 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none cursor-pointer ${isArabic ? 'pr-10' : 'pl-10'}`}
                                    defaultValue={searchParams?.city}
                                >
                                    <option value="">{t('all_cities')}</option>
                                    <option value="Riyadh">{t('riyadh')}</option>
                                    <option value="Jeddah">{t('jeddah')}</option>
                                    <option value="Dammam">{t('dammam')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full lg:w-48 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t('industry_label')}</label>
                            <div className="relative">
                                <Factory className={`absolute top-3 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                                <select
                                    name="industry"
                                    className={`w-full h-12 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none cursor-pointer ${isArabic ? 'pr-10' : 'pl-10'}`}
                                    defaultValue={searchParams?.industry}
                                >
                                    <option value="">{t('industry_all')}</option>
                                    <option value="Construction">{t('industry_construction')}</option>
                                    <option value="Plastics">{t('industry_plastics')}</option>
                                    <option value="Food">{t('industry_food')}</option>
                                    <option value="Metal">{t('industry_metal')}</option>
                                    <option value="Chemicals">{t('industry_chemicals')}</option>
                                    <option value="Textiles">{t('industry_textiles')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full lg:w-40 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t('min_rating')}</label>
                            <select
                                name="rating"
                                className="w-full h-12 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none px-3 cursor-pointer"
                                defaultValue={searchParams?.rating}
                            >
                                <option value="0">{t('any_rating')}</option>
                                <option value="4">⭐⭐⭐⭐ (4+)</option>
                                <option value="3">⭐⭐⭐ (3+)</option>
                            </select>
                        </div>

                        <div className="w-full lg:w-40 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t('sort_by')}</label>
                            <select
                                name="sort"
                                className="w-full h-12 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none px-3 cursor-pointer"
                                defaultValue={searchParams?.sort}
                            >
                                <option value="newest">{t('sort_newest')}</option>
                                <option value="rating">{t('sort_rating')}</option>
                            </select>
                        </div>
                        <Button type="submit" size="lg" className="w-full lg:w-auto shadow-primary-900/20">
                            {t('explore_factories')}
                        </Button>
                    </form>
                </Card>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {factories.map(factory => (
                        <Card key={factory.id} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-gray-100 flex flex-col h-full overflow-hidden">
                            {/* Card Header with Pattern */}
                            <div className="h-24 bg-primary-900 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                <div className={`absolute -bottom-6 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center text-primary-900 font-bold text-xl border border-gray-100 italic font-serif ${isArabic ? 'right-6' : 'left-6'}`}>
                                    {factory.businessName.charAt(0)}
                                </div>
                            </div>

                            <div className="p-6 pt-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">{factory.businessName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                <Factory size={12} /> {factory.industry}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                <MapPin size={12} /> {factory.city}
                                            </span>
                                        </div>
                                    </div>
                                    {factory.verificationStatus === 'VERIFIED' && (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-accent-600" title="Verified Factory">
                                                <CheckCircle size={20} fill="#fef3c7" />
                                            </div>
                                            {factory.reviews && factory.reviews.length > 0 && (
                                                <div className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                                    <span>⭐</span>
                                                    {(factory.reviews.reduce((acc, r) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 mt-4 flex-1 leading-relaxed">
                                    {factory.description || 'A verified manufacturer on Jisr, committed to quality and excellence in production.'}
                                </p>

                                <Link href={`/factories/${factory.id}`} className="block">
                                    <Button variant="outline" className="w-full group-hover:bg-primary-50 group-hover:border-primary-200 justify-between">
                                        {t('view_profile')}
                                        <ArrowRight size={16} className={`text-gray-400 group-hover:text-primary-600 transition-all ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>

                {factories.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t('no_factories')}</h3>
                        <p className="text-gray-500 mb-6">{t('no_factories_desc')}</p>
                        <Button variant="ghost" onClick={() => window.location.href = '/factories'}>{t('clear_filters')}</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
