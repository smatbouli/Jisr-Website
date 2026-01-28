'use client';

import { useLanguage } from '@/components/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import { approveProduct, rejectProduct } from '@/app/actions/admin';

export default function ProductsPageClient({ products }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">{t('admin_products')}</h1>
                    <p className="text-gray-600 mt-1">{t('admin_products_desc') || 'Ensure catalog quality by reviewing new listings.'}</p>
                </div>
            </div>

            {products.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-gray-200 shadow-none bg-surface-50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 shadow-sm">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('all_clean') || 'Detailed Clean!'}</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">{t('no_pending_products') || 'There are no pending products to review.'}</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-100 relative">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package size={48} opacity={0.2} />
                                    </div>
                                )}
                                <div className={`absolute top-2 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded shadow-sm ${isArabic ? 'left-2' : 'right-2'}`}>
                                    MOQ: {product.moq}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-primary-600 font-medium mb-2">{product.factory.businessName}</p>
                                    <p className="text-sm text-gray-500 line-clamp-3 h-[60px]">{product.description}</p>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <form action={rejectProduct.bind(null, product.id)} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200">
                                            <XCircle size={16} className={isArabic ? 'ml-2' : 'mr-2'} /> {t('reject')}
                                        </Button>
                                    </form>
                                    <form action={approveProduct.bind(null, product.id)} className="flex-1">
                                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 border-none">
                                            <CheckCircle size={16} className={isArabic ? 'ml-2' : 'mr-2'} /> {t('approve')}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
