'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck, Mail, Globe, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ShowcaseCarousel from './ShowcaseCarousel';
import { useLanguage } from './LanguageContext';
import { startConversation } from '@/app/actions/messaging';

export default function ProductView({ product, relatedProducts }) {
    const [activeImage, setActiveImage] = useState(0);
    const { t, language } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleContactFactory = async () => {
        setLoading(true);
        const result = await startConversation(
            product.factory.id,
            `Inquiry about ${product.name}`,
            `Hi, I am interested in your product: ${product.name}. Can you provide more details?`
        );

        if (result.success) {
            router.push(`/messages/${result.conversationId}`);
        } else {
            if (result.error === 'Unauthorized') {
                router.push('/login');
            } else {
                alert(result.error); // Simple fallback for now
                setLoading(false);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('product_not_found')}</h1>
                    <Link href="/" className="text-primary-600 hover:underline">{t('return_home')}</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Navbar Placeholder/Back Button */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-8 justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className={`text-gray-700 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </Link>
                    <span className="font-bold text-gray-900 text-lg tracking-tight">Jisr Marketplace</span>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">{t('Login')}</button>
                    <button className="px-4 py-2 text-sm font-medium bg-primary-900 text-white rounded-full hover:bg-primary-800 transition-colors">{t('Get Started')}</button>
                </div>
            </nav>

            <main className="pt-24 container mx-auto px-4 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Left Column: Images (Sticky) */}
                    <div className="lg:sticky lg:top-32 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-surface-50 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 relative aspect-square group"
                        >
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                    <Package size={120} />
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnails (Simulated for now if multiple images supported later) */}
                        {/* 
                        <div className="flex gap-4 overflow-x-auto pb-2">
                           {[1,2,3].map(i => (
                               <button key={i} className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 shrink-0"></button>
                           ))}
                        </div>
                        */}
                    </div>

                    {/* Right Column: Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="py-4 lg:py-8"
                    >
                        {/* Factory Badge */}
                        <div className="flex items-center gap-3 mb-6">
                            {product.factory?.isVerified && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                    <ShieldCheck size={14} /> {t('verified_factory')}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
                                {t('moq')}: {product.moq || 1} {t('quantity_units')}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl md:leading-[1.1] font-bold text-gray-900 mb-6 font-heading">
                            {product.name}
                        </h1>

                        <div className="flex flex-col gap-2 mb-8">
                            <span className="text-3xl font-bold text-primary-600">
                                {product.priceMin && product.priceMax
                                    ? `SAR ${product.priceMin} - ${product.priceMax}`
                                    : product.price
                                        ? `SAR ${product.price}`
                                        : t('price_upon_request')
                                }
                            </span>
                            <p className="text-gray-500 text-sm">
                                {t('excluding_vat')}
                            </p>
                        </div>

                        <div className="prose prose-lg text-gray-600 mb-10 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12 border-b border-gray-100 pb-12">
                            <Link
                                href={`/buyer/rfq/create?title=${encodeURIComponent(`Request for ${product.name}`)}&description=${encodeURIComponent(`I am interested in quoting for ${product.name} (MOQ: ${product.moq || 1}). Please provide pricing and availability.`)}`}
                                className="flex-1 px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Mail size={20} /> {t('request_quote')}
                            </Link>
                            <button
                                onClick={handleContactFactory}
                                disabled={loading}
                                className="flex-1 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? '...' : t('contact_factory')}
                            </button>
                        </div>

                        {/* Factory Card */}
                        <div className="bg-surface-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">{t('sold_by')}</h3>

                            <div className="flex items-start gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-2xl font-bold text-primary-700 shadow-sm shrink-0">
                                    {product.factory?.businessName?.charAt(0) || "F"}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {product.factory?.businessName}
                                        </h4>
                                        <Link href={`/factories/${product.factory?.id}`} className="text-sm font-bold text-primary-600 hover:text-primary-700">
                                            {t('view_profile')}
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {product.factory?.city || "Saudi Arabia"}</span>
                                        <span className="flex items-center gap-1"><Globe size={14} /> {t('online_since')} 2024</span>
                                        <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> 98% {t('response_rate')}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {product.factory?.description || "A verified manufacturer on Jisr specializing in high quality products."}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>

                {/* Detailed Information Tabs / Sections */}
                <div className="mt-24 grid gap-12">

                    {/* Key Attributes */}
                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">{t('key_attributes')}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(product.attributes).map(([key, value]) => (
                                    value ? (
                                        <div key={key} className="flex flex-col p-4 bg-surface-50 rounded-2xl">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t(key.toLowerCase()) || key}</span>
                                            <span className="font-medium text-gray-900 text-lg">{value}</span>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Customization Options */}
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">{t('customization')}</h2>
                            <div className="space-y-4">
                                {product.customization?.logo ? (
                                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{t('custom_logo')}</h4>
                                            <p className="text-sm text-gray-500">{t('available_on_request')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-4 rounded-xl opacity-50">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                                            <div className="w-3 h-3 bg-gray-400 rounded-full" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{t('custom_logo')}</h4>
                                            <p className="text-sm text-gray-500">{t('not_available')}</p>
                                        </div>
                                    </div>
                                )}

                                {product.customization?.packaging ? (
                                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{t('custom_packaging')}</h4>
                                            <p className="text-sm text-gray-500">{t('full_color_box')}</p>
                                        </div>
                                    </div>
                                ) : null}

                                {product.customization?.design ? (
                                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-50 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{t('graphic_customization')}</h4>
                                            <p className="text-sm text-gray-500">{t('alter_patterns')}</p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </section>

                        {/* Lead Time */}
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">{t('lead_time')}</h2>
                            <div className="overflow-hidden rounded-xl border border-gray-100">
                                <table className="w-full text-left bg-white">
                                    <thead className="bg-surface-50">
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('quantity_units')}</th>
                                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{t('est_time_days')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {product.leadTime && Array.isArray(product.leadTime) ? (
                                            product.leadTime.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-surface-50 transition-colors">
                                                    <td className="p-4 font-bold text-gray-900">{item.qty}</td>
                                                    <td className="p-4 text-gray-600">{item.days}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="p-4 text-gray-500" colSpan={2}>{t('contact_supplier_details')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                </div>
            </main>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-surface-50 py-24 mt-24">
                    <ShowcaseCarousel
                        title={t('you_may_also_like')}
                        subtitle={t('similar_products')}
                        products={relatedProducts}
                        linkHref="/factories"
                    />
                </section>
            )}
        </div>
    );
}
