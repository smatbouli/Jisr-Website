'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, MapPin, Factory, CheckCircle, ArrowRight, Package } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function ProductMarketplace({ products, searchParams }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`bg-surface-50 min-h-screen py-12 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className={`text-4xl font-bold text-primary-900 mb-4 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('products_title')}</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('products_desc')}
                    </p>
                </div>

                {/* Filter Section */}
                <Card className="p-6 mb-12 border-none shadow-lg bg-white/80 backdrop-blur">
                    <form className="flex flex-col lg:flex-row gap-4 items-end" action="/products" method="GET">
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
                            {t('search_btn') || 'Search'}
                        </Button>
                    </form>
                </Card>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                        <Card key={product.id} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-gray-100 flex flex-col h-full overflow-hidden">
                            {/* Product Image or Placeholder */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center">
                                        <Package size={48} />
                                    </div>
                                )}

                                {/* Factory Badge */}
                                <div className={`absolute bottom-3 ${isArabic ? 'right-3' : 'left-3'} bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1`}>
                                    <Factory size={10} className="text-primary-600" />
                                    {product.factory.businessName}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <span className="inline-flex items-center gap-1">
                                            {product.factory.industry}
                                        </span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin size={12} /> {product.factory.city}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-2 mt-2 flex-1 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {product.priceMin ? (
                                            <span>
                                                {product.priceMin} {product.priceMax ? `- ${product.priceMax}` : ''} SAR
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">{t('price_upon_request')}</span>
                                        )}
                                    </div>
                                    <Link href={`/products/${product.id}`}>
                                        <Button variant="ghost" size="sm" className="hover:bg-primary-50 text-primary-600 p-0 h-auto font-bold hover:no-underline">
                                            {t('view_details') || 'View Details'} <ArrowRight size={14} className={`ml-1 ${isArabic ? 'rotate-180' : ''}`} />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t('no_products_found') || 'No products found'}</h3>
                        <p className="text-gray-500 mb-6">{t('no_factories_desc')}</p>
                        <Button variant="ghost" onClick={() => window.location.href = '/products'}>{t('clear_filters')}</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
