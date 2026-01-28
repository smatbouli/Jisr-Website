'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function BuyerOrderList({ orders }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic text-right' : ''}`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">{t('my_orders_title')}</h1>
                    <p className="text-gray-600 mt-1">{t('my_orders_subtitle')}</p>
                </div>
                <Link href="/buyer/rfq/create">
                    <Button>{t('create_new_request')}</Button>
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Package size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_active_orders_title')}</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">{t('no_active_orders_desc')}</p>
                    <Link href="/buyer/rfq">
                        <Button variant="outline">{t('view_my_rfqs')}</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <Card key={order.id} className="p-0 overflow-hidden hover:shadow-md transition-shadow border-gray-100">
                            <div className="p-6">
                                <div className={`flex flex-col lg:flex-row justify-between lg:items-center gap-6 ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
                                    {/* Order Info */}
                                    <div className="flex-1">
                                        <div className={`flex items-center gap-3 mb-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                #{order.id.slice(-6)}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{order.rfq?.title || t('direct_order')}</h3>
                                        <div className={`flex items-center gap-2 text-sm text-gray-600 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                                            <span className="font-semibold">{isArabic && order.factory.businessNameAr ? order.factory.businessNameAr : order.factory.businessName}</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`w-full lg:w-48 ${isArabic ? 'text-right' : ''}`}>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                order.status === 'SHIPPED' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        'bg-gray-50 text-gray-700 border-gray-100'
                                            } ${isArabic ? 'flex-row-reverse' : ''}`}>
                                            {order.status === 'PENDING' && <Clock size={14} />}
                                            {order.status === 'PROCESSING' && <Package size={14} />}
                                            {order.status === 'SHIPPED' && <Truck size={14} />}
                                            {order.status === 'DELIVERED' && <CheckCircle size={14} />}
                                            {t(`status_${order.status.toLowerCase()}`)}
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className={`flex items-center justify-between lg:justify-end gap-8 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-none border-gray-100 ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
                                        <div className={`text-right ${isArabic ? 'pl-4' : ''}`}>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('order_total')}</p>
                                            <p className="text-xl font-bold text-primary-900">{order.totalPrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">SAR</span></p>
                                        </div>
                                        <Link href={`/buyer/orders/${order.id}`}>
                                            <Button variant="outline" size="sm">{t('details_btn')}</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar (Visual Flair) */}
                            <div className={`h-1 w-full bg-gray-50 ${isArabic ? 'transform -scale-x-100' : ''}`}>
                                <div
                                    className={`h-full rounded-r-full transition-all duration-1000 ${order.status === 'PENDING' ? 'w-[5%] bg-amber-500' :
                                        order.status === 'PROCESSING' ? 'w-[40%] bg-blue-500' :
                                            order.status === 'SHIPPED' ? 'w-[75%] bg-purple-500' :
                                                order.status === 'DELIVERED' ? 'w-[100%] bg-green-500' : 'w-0'
                                        }`}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
