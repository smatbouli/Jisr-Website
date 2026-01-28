'use client';

import { createProduct } from '@/app/actions/product';
// import styles from '@/app/signup/page.module.css'; // Removed old styling, using Tailwind now
import { useState } from 'react';
import { Upload, DollarSign, Package, Zap, Ruler, Shield, Layers, Clock, CheckSquare } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageContext';

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { t, language } = useLanguage();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-24">
            <header className="mb-10">
                <h1 className="text-3xl font-heading font-bold text-gray-900">{t('add_new_product')}</h1>
                <p className="text-gray-500 mt-2">{t('add_product_desc')}</p>
            </header>

            <form action={createProduct} onSubmit={() => setLoading(true)} className="space-y-12">

                {/* Section 1: Basic Information */}
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package className="text-primary-600" size={24} /> {t('basic_information')}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('product_name')} <span className="text-red-500">*</span></label>
                                <input name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder={t('product_name_placeholder')} required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('detailed_description')} <span className="text-red-500">*</span></label>
                                <textarea name="description" rows="5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder={t('desc_placeholder')} required></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('moq')} <span className="text-red-500">*</span></label>
                                <input name="moq" type="number" min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="100" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('product_image')} <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl h-[340px] flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-primary-400 transition-all relative overflow-hidden group">
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    required={!previewUrl} // Required if no preview yet
                                />
                                {previewUrl ? (
                                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-4" />
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-gray-500 font-medium">{t('click_drag_image')}</p>
                                        <p className="text-xs text-gray-400 mt-1">{t('image_help')}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Pricing */}
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <DollarSign className="text-primary-600" size={24} /> {t('pricing_strategy')}
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">{t('pricing_desc')}</p>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('min_price')}</label>
                            <input name="priceMin" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="e.g. 50.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t('max_price')}</label>
                            <input name="priceMax" type="number" step="0.01" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="e.g. 75.00" />
                        </div>
                    </div>
                </section>

                {/* Section 3: Key Attributes */}
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Layers className="text-primary-600" size={24} /> {t('product_attributes')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t('material')}</label>
                            <div className="relative">
                                <Layers size={16} className={`absolute top-3.5 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input name="attr_material" type="text" className={`w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="e.g. Stainless Steel" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t('voltage')}</label>
                            <div className="relative">
                                <Zap size={16} className={`absolute top-3.5 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input name="attr_voltage" type="text" className={`w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="e.g. 220V / 110V" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t('power')}</label>
                            <div className="relative">
                                <Zap size={16} className={`absolute top-3.5 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input name="attr_power" type="text" className={`w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="e.g. 1500W" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t('dimensions')}</label>
                            <div className="relative">
                                <Ruler size={16} className={`absolute top-3.5 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input name="attr_dimensions" type="text" className={`w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="e.g. 100x50x20 cm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t('weight')}</label>
                            <input name="attr_weight" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 5.2 kg" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t('certification')}</label>
                            <div className="relative">
                                <Shield size={16} className={`absolute top-3.5 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                                <input name="attr_certification" type="text" className={`w-full py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="e.g. ISO 9001" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Customization & Lead Time */}
                <div className="grid md:grid-cols-2 gap-8">
                    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CheckSquare className="text-primary-600" size={24} /> {t('customization')}
                        </h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input name="cust_logo" type="checkbox" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                                <span className="font-medium text-gray-700">{t('cust_logo')}</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input name="cust_packaging" type="checkbox" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                                <span className="font-medium text-gray-700">{t('cust_packaging')}</span>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input name="cust_design" type="checkbox" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                                <span className="font-medium text-gray-700">{t('cust_design')}</span>
                            </label>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="text-primary-600" size={24} /> {t('lead_time')}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-sm font-bold text-gray-500">1-100 {t('pcs')}:</span>
                                <input name="lead_1" type="text" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="7 days" />
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-sm font-bold text-gray-500">101-500 {t('pcs')}:</span>
                                <input name="lead_2" type="text" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="15 days" />
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-sm font-bold text-gray-500">500+ {t('pcs')}:</span>
                                <input name="lead_3" type="text" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder={t('negotiated')} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="flex justify-end pt-8 border-t border-gray-200">
                    <button type="submit" disabled={loading} className="px-10 py-4 bg-primary-900 text-white font-bold rounded-full shadow-lg hover:bg-primary-800 transition-all hover:shadow-primary-900/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? t('publishing') : t('publish_product')}
                    </button>
                </div>
            </form>
        </div>
    );
}
