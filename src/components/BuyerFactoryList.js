'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Search, MapPin, Factory, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function BuyerFactoryList({ factories, searchParams }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic text-right' : ''}`}>
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-gray-900">{t('find_factories_title')}</h1>
                <p className="text-gray-600">{t('find_factories_subtitle')}</p>
            </div>

            {/* Filter Section */}
            <Card className="p-6 border-none shadow-sm bg-white">
                <form className="flex flex-col md:flex-row gap-4 items-end" action="/buyer/factories" method="GET">
                    <div className="w-full md:flex-1 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">{t('search_label')}</label>
                        <div className="relative">
                            <Search className={`absolute top-3 text-gray-400 ${isArabic ? 'left-auto right-3' : 'left-3'}`} size={18} />
                            <Input
                                name="q"
                                placeholder={t('search_placeholder')}
                                className={isArabic ? 'pr-10 text-right' : 'pl-10'}
                                defaultValue={searchParams?.q}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">{t('industry_label')}</label>
                        <div className="relative">
                            <Factory className={`absolute top-3 text-gray-400 ${isArabic ? 'left-auto right-3' : 'left-3'}`} size={18} />
                            <select
                                name="industry"
                                className={`w-full h-12 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none cursor-pointer ${isArabic ? 'pr-10 text-right' : 'pl-10'}`}
                                defaultValue={searchParams?.industry}
                            >
                                <option value="">{t('industry_all')}</option>
                                <option value="Construction">{t('industry_construction')}</option>
                                <option value="Plastics">{t('industry_plastics')}</option>
                                <option value="Food">{t('industry_food')}</option>
                                <option value="Metal">{t('industry_metal')}</option>
                            </select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full md:w-auto">
                        {t('search_btn')}
                    </Button>
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {factories.map(factory => (
                    <Card key={factory.id} className="group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-gray-100 flex flex-col h-full overflow-hidden">
                        {/* Card Header with Pattern */}
                        <div className="h-24 bg-surface-100 relative overflow-hidden border-b border-gray-50">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            <div className={`absolute -bottom-6 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary-900 font-bold text-xl border border-gray-100 italic font-serif ${isArabic ? 'right-6' : 'left-6'}`}>
                                {factory.businessName.charAt(0)}
                            </div>
                        </div>

                        <div className="p-6 pt-8 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{isArabic && factory.businessNameAr ? factory.businessNameAr : factory.businessName}</h3>
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
                                    <div className="text-accent-600" title={t('verified_manufacturer')}>
                                        <CheckCircle size={18} fill="#fef3c7" />
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 mt-4 flex-1">
                                {factory.description || t('no_description')}
                            </p>

                            <Link href={`/buyer/factories/${factory.id}`} className="block">
                                <Button variant="outline" size="sm" className={`w-full justify-between group-hover:bg-primary-50 group-hover:border-primary-200 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    {t('view_profile')}
                                    <ArrowRight size={14} className={`text-gray-400 group-hover:text-primary-600 transition-colors ${isArabic ? 'rotate-180' : ''}`} />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>

            {factories.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">{t('no_factories_found')}</p>
                </div>
            )}
        </div>
    );
}
