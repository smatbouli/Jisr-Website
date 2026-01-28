'use client';

import { useLanguage } from '@/components/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Package, MapPin, Clock } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/order'; // Importing server action directly might work if passed down or used in handle
import { startConversationWithBuyer } from '@/app/actions/messaging';
import { useRouter } from 'next/navigation';

export default function FactoryOrderList({ orders }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const router = useRouter();

    async function handleMessage(buyerId, orderId) {
        const result = await startConversationWithBuyer(buyerId, `Order #${orderId.slice(-6)} Inquiry`, `Hi, I am contacting you regarding Order #${orderId.slice(-6)}.`);
        if (result.success) {
            router.push(`/messages/${result.conversationId}`);
        }
    }

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('incoming_orders')}</h1>
                    <p className="text-gray-600 mt-1">{t('manage_production')}</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Package size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_orders')}</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">{t('orders_appear_here')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <Card key={order.id} className="overflow-hidden border-gray-100 p-0">
                            {/* Card Header: ID & Status */}
                            <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
                                        #{order.id.slice(-6)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        order.status === 'SHIPPED' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                'bg-gray-50 text-gray-700 border-gray-100'
                                    }`}>
                                    {order.status === 'PENDING' && <Clock size={12} />}
                                    {t(`status_${order.status.toLowerCase()}`) || order.status}
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Column 1: Item Details */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('order_item')}</h4>
                                        <p className="font-bold text-gray-900 text-lg leading-tight mb-1">{order.rfq?.title || t('direct_order')}</p>
                                        <p className="text-sm text-gray-500">{t('qty')}: <span className="font-medium text-gray-900">{order.rfq?.quantity} Units</span></p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('total_value')}</h4>
                                        <p className="text-2xl font-bold text-primary-900">{order.totalPrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">SAR</span></p>
                                    </div>
                                </div>

                                {/* Column 2: Buyer Info */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('buyer_details')}</h4>
                                    <div className="bg-surface-50 p-4 rounded-lg space-y-3">
                                        <div>
                                            <p className="font-bold text-gray-900">{order.buyer.businessName}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                                <MapPin size={12} /> {order.buyer.city}
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200/50 flex gap-2">
                                            <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => { }}>{t('view_profile')}</Button>
                                            <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => handleMessage(order.buyer.id, order.id)}>{t('send_message')}</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Actions */}
                                <div className="flex flex-col justify-end">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('order_handling')}</h4>
                                    <form action={async (formData) => {
                                        await updateOrderStatus(order.id, formData.get('status'));
                                    }} className="bg-gray-50 p-4 rounded-lg">
                                        <label className="text-xs font-medium text-gray-600 mb-2 block">{t('update_status')}</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select
                                                    name="status"
                                                    defaultValue=""
                                                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="" disabled>{t('select_action')}</option>
                                                    <option value="PROCESSING">{t('mark_processing')}</option>
                                                    <option value="SHIPPED">{t('mark_shipped')}</option>
                                                    <option value="DELIVERED">{t('mark_delivered')}</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                </div>
                                            </div>
                                            <Button type="submit" size="sm" className="bg-gray-900 text-white hover:bg-black">
                                                {t('update')}
                                            </Button>
                                        </div>
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
