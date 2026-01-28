'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, Truck, CheckCircle, Clock, MapPin, FileText } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { useLanguage } from '@/components/LanguageContext';
import DisputeModal from '@/components/DisputeModal';
import ReviewModal from '@/components/ReviewModal';
import PaymentModal from '@/components/PaymentModal';

export default function BuyerOrderDetails({ order }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic text-right' : ''}`}>
            <div>
                <BackButton href="/buyer/orders" labelKey="back_to_orders" />
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">{t('order_details_title')}</h1>
                        <p className="text-gray-500 mt-1">
                            {t('order_number')} #{order.id.slice(-6)} • {t('placed_on')} {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            order.status === 'SHIPPED' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                                    'bg-gray-50 text-gray-700 border-gray-100'
                        } ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {order.status === 'PENDING' && <Clock size={16} />}
                        {order.status === 'PROCESSING' && <Package size={16} />}
                        {order.status === 'SHIPPED' && <Truck size={16} />}
                        {order.status === 'DELIVERED' && <CheckCircle size={16} />}
                        {t(`status_${order.status.toLowerCase()}`)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Package className="text-primary-600" size={20} /> {t('order_items')}
                        </h3>
                        <div className={`border border-gray-100 rounded-lg p-4 flex gap-4 items-start ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                <Package size={32} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{order.rfq?.title || t('custom_order')}</h4>
                                <p className="text-gray-500 text-sm mt-1">{order.rfq?.description && order.rfq.description.slice(0, 100)}...</p>
                                <div className={`mt-2 flex gap-4 text-sm ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <span className="bg-gray-50 px-2 py-1 rounded text-gray-600">{t('qty')}: <strong>{order.rfq?.quantity}</strong></span>
                                    <span className="bg-gray-50 px-2 py-1 rounded text-gray-600">{t('unit_price')}: <strong>{order.quote?.price} SAR</strong></span>
                                </div>
                            </div>
                            <div className={`${isArabic ? 'text-left' : 'text-right'}`}>
                                <p className="text-xl font-bold text-primary-900">{order.totalPrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">SAR</span></p>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Clock className="text-primary-600" size={20} /> {t('order_timeline')}
                        </h3>
                        <div className={`relative space-y-8 ${isArabic ? 'pr-8 before:right-3' : 'pl-8 before:left-3'} before:absolute before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100`}>
                            <div className="relative">
                                <div className={`absolute bg-green-500 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${isArabic ? '-right-8' : '-left-8'}`}>
                                    <CheckCircle size={12} className="text-white" />
                                </div>
                                <h4 className="font-bold text-gray-900">{t('order_placed')}</h4>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
                            </div>
                            {['PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, i) => {
                                const isCompleted = ['PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status) >= i;
                                const isCurrent = order.status === step;

                                return (
                                    <div key={step} className={`relative ${!isCompleted ? 'opacity-50' : ''}`}>
                                        <div className={`absolute h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'} ${isArabic ? '-right-8' : '-left-8'}`}>
                                            {isCompleted && <CheckCircle size={12} className="text-white" />}
                                        </div>
                                        <h4 className={`font-bold ${isCurrent ? 'text-primary-700' : 'text-gray-900'}`}>{t(`status_${step.toLowerCase()}`)}</h4>
                                        {isCurrent && <p className="text-sm text-primary-600 font-medium">{t('current_status')}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Factory Info */}
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Truck className="text-primary-600" size={20} /> {t('supplier')}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold text-gray-900">{isArabic && order.factory.businessNameAr ? order.factory.businessNameAr : order.factory.businessName}</p>
                                <p className={`text-sm text-gray-500 flex items-center gap-1 ${isArabic ? 'flex-row-reverse' : ''}`}><MapPin size={14} /> {t('ksa')}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <form action={async () => {
                                    const { startConversation } = await import('@/app/actions/messaging');
                                    const { redirect } = await import('next/navigation');
                                    const result = await startConversation(order.factoryId, `Order #${order.id.slice(-6)} Inquiry`, "Hi, I have a question regarding my order.");
                                    if (result.success) {
                                        redirect(`/messages/${result.conversationId}`);
                                    }
                                }}>
                                    <Button variant="outline" className="w-full" size="sm">{t('contact_factory')}</Button>
                                </form>
                            </div>
                        </div>
                    </Card>

                    {/* Payment Info */}
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <FileText className="text-primary-600" size={20} /> {t('payment')}
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <span className="text-gray-600">{t('subtotal')}</span>
                                <span className="font-medium">{order.totalPrice.toLocaleString()} SAR</span>
                            </div>
                            <div className={`flex justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <span className="text-gray-600">{t('tax')} (15%)</span>
                                <span className="font-medium">{(order.totalPrice * 0.15).toLocaleString()} SAR</span>
                            </div>
                            <div className={`pt-3 border-t border-gray-100 flex justify-between text-base ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <span className="font-bold text-gray-900">{t('total')}</span>
                                <span className="font-bold text-primary-900">{(order.totalPrice * 1.15).toLocaleString()} SAR</span>
                            </div>

                            {order.status === 'PENDING' ? (
                                <div className="pt-4 border-t border-gray-100">
                                    <PaymentModal orderId={order.id} amount={order.totalPrice * 1.15} />
                                </div>
                            ) : (
                                <div className="mt-4 bg-green-50 text-green-700 px-3 py-2 rounded text-center font-medium text-xs border border-green-100 flex items-center justify-center gap-1">
                                    <CheckCircle size={14} /> {t('paid_via_card') || t('paid_via_transfer')}
                                </div>
                            )}

                            {/* Dispute / Report Problem */}
                            {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
                                <div className="pt-4 border-t border-gray-100">
                                    <DisputeModal orderId={order.id} />
                                </div>
                            )}

                            {/* Review Button */}
                            {order.status === 'DELIVERED' && !order.review && (
                                <div className="pt-4 border-t border-gray-100 text-center">
                                    <ReviewModal orderId={order.id} factoryName={isArabic && order.factory.businessNameAr ? order.factory.businessNameAr : order.factory.businessName} />
                                </div>
                            )}

                            {/* Review Display */}
                            {order.review && (
                                <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">{t('you_rated')}</span>
                                    <div className="flex bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < order.review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {order.status === 'DISPUTED' && (
                                <div className="pt-4 border-t border-gray-100 text-center">
                                    <span className="inline-flex items-center gap-1 text-red-600 font-bold px-3 py-1 bg-red-50 rounded-full text-xs border border-red-100">
                                        {t('dispute_open_badge')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
