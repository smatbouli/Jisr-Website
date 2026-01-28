'use client';

import { Card } from '@/components/ui/Card';
import { Users, Factory, ShoppingBag, DollarSign, Package, FileText } from 'lucide-react';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { useLanguage } from '@/components/LanguageContext';

export default function AnalyticsPageClient({ data }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <h1 className="text-3xl font-heading font-bold text-gray-900">{t('admin_analytics_title')}</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={`p-6 border-l-4 ${isArabic ? 'border-r-4 border-l-0' : 'border-l-4'} border-green-500`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold text-gray-500 uppercase">{t('total_revenue')}</h3>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.totalRevenue.toLocaleString()}</p>
                    <span className="text-xs text-gray-500">{t('sar')} ({t('verified_manufacturer')})</span>
                </Card>

                <Card className={`p-6 border-l-4 ${isArabic ? 'border-r-4 border-l-0' : 'border-l-4'} border-blue-500`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold text-gray-500 uppercase">{t('total_orders')}</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.totalOrders}</p>
                    <span className="text-xs text-gray-500">{t('processed_across_platform')}</span>
                </Card>

                <Card className={`p-6 border-l-4 ${isArabic ? 'border-r-4 border-l-0' : 'border-l-4'} border-purple-500`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold text-gray-500 uppercase">{t('active_rfqs')}</h3>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.totalRfqs}</p>
                    <span className="text-xs text-gray-500">{t('open_requests')}</span>
                </Card>

                <Card className={`p-6 border-l-4 ${isArabic ? 'border-r-4 border-l-0' : 'border-l-4'} border-orange-500`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-bold text-gray-500 uppercase">{t('stat_factories')}</h3>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Factory size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{data.totalFactories}</p>
                    <span className="text-xs text-gray-500">{t('active_suppliers')}</span>
                </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">{t('total_users')}</p>
                        <p className="text-2xl font-bold text-gray-900">{data.totalUsers}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">{t('stat_buyers')}</p>
                        <p className="text-2xl font-bold text-gray-900">{data.totalBuyers}</p>
                    </div>
                </Card>
                <Card className="p-6 flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">{t('my_products')}</p>
                        <p className="text-2xl font-bold text-gray-900">{data.totalProducts}</p>
                    </div>
                </Card>
            </div>

            <AnalyticsCharts data={data} />
        </div>
    );
}
