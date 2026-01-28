'use client';

import { Card } from '@/components/ui/Card';
import { ShieldCheck, Users, AlertTriangle, TrendingUp, ArrowRight, ShoppingBag, Database } from 'lucide-react';
import Link from 'next/link';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { useLanguage } from '@/components/LanguageContext';

export default function DashboardOverview({ data }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    const stats = [
        {
            label: t('pending_verifications'),
            value: data.pendingVerifications.toString(),
            icon: ShieldCheck,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            href: '/admin/verification',
            action: t('review_queue')
        },
        {
            label: t('total_users'),
            value: data.totalUsers.toString(),
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            href: '/admin/users',
            action: t('manage_users')
        },
        {
            label: t('Orders'),
            value: data.totalOrders.toString(),
            icon: ShoppingBag,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            href: '/admin/orders',
            action: t('view_all_orders')
        },
        {
            label: t('Revenue'),
            value: `$${(data.totalRevenue / 1000).toFixed(1)}k`,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
            href: '/admin/analytics',
            action: t('view_report')
        }
    ];

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold text-gray-900 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{t('admin_command_center')}</h1>
                    <p className="text-gray-600 mt-1">{t('admin_desc')}</p>
                </div>
                <div className="flex gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 mr-2 bg-green-600 rounded-full animate-pulse"></span>
                        {t('system_healthy')}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Database size={12} className="mr-1" />
                        {t('data_restored')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-3xl font-bold text-gray-900 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{stat.value}</span>
                        </div>
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">{stat.label}</h3>
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <Link href={stat.href} className="flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 group">
                                    {stat.action}
                                    <ArrowRight size={16} className={`ml-2 transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Overview Charts */}
            <div className="grid grid-cols-1 gap-6">
                <AnalyticsCharts data={data} />
            </div>

            {/* Platform Controls */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Quick Actions removed/simplified to focus on charts as requested */}
            </div>
        </div>
    );
}
