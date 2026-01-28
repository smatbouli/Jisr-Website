'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Search, FileText, CheckCircle, Clock, Truck, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function OrderManagement({ initialOrders }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, PROCESSING, SHIPPED, DELIVERED
    const [search, setSearch] = useState('');

    // Filter orders
    const filteredOrders = initialOrders.filter(order => {
        // Status Filter
        if (filter !== 'ALL' && order.status.toUpperCase() !== filter) return false;

        // Search Filter
        if (search) {
            const term = search.toLowerCase();
            const id = order.id.toLowerCase();
            const buyer = order.buyer.businessName.toLowerCase();
            const factory = order.factory.businessName.toLowerCase();
            return id.includes(term) || buyer.includes(term) || factory.includes(term);
        }

        return true;
    });

    const exportCSV = () => {
        const headers = ["Order ID", "Date", "Status", "Buyer", "Factory", "Total Price (SAR)", "Items"];
        const rows = filteredOrders.map(o => [
            o.id,
            new Date(o.createdAt).toLocaleDateString(),
            o.status,
            o.buyer.businessName,
            o.factory.businessName,
            o.totalPrice,
            o.rfq?.title || 'Direct Order'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-amber-100 text-amber-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                    <input
                        type="text"
                        placeholder={t('search_orders_placeholder')}
                        className={`w-full py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button onClick={exportCSV} variant="outline" size="sm" className="whitespace-nowrap">
                        {t('export_csv')}
                    </Button>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition whitespace-nowrap ${filter === f
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t(`filter_${f.toLowerCase()}`) || f}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 border-b border-gray-100">
                            <tr>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('order_id')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('participants')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('amount')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('status')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-left' : 'text-right'}`}>{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-surface-50">
                                        <td className="p-4">
                                            <div className="font-mono font-medium text-gray-900">#{order.id.slice(-6)}</div>
                                            <div className="text-xs text-gray-500">{order.rfq ? 'RFQ Order' : 'Direct'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-gray-900 font-medium">{order.buyer.businessName}</span>
                                                <span className="text-xs text-gray-400">{t('purchasing_from') || 'purchasing from'}</span>
                                                <span className="text-primary-600 font-medium">{order.factory.businessName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900">
                                            {t('currency_sar')} {order.totalPrice.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                                {t(`filter_${order.status.toLowerCase()}`) || order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
