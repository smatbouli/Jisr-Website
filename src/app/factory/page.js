'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Inbox, CheckCircle, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function FactoryDashboard() {
    const { data: session } = useSession();
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    // Mock data for factory
    const stats = [
        {
            label: t('new_rfq_opps'),
            value: '3',
            icon: Inbox,
            color: 'text-primary-600',
            bg: 'bg-primary-50',
            action: t('view_rfqs'),
            href: '/factory/rfq'
        },
        {
            label: t('verification_status'),
            value: t('status_pending'),
            icon: CheckCircle,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            action: t('complete_verification'),
            href: '/factory/verification'
        },
        {
            label: t('profile_views'),
            value: '128',
            icon: BarChart3,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            action: t('view_analytics'),
            href: '/factory/analytics'
        }
    ];

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold text-primary-900 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                        {t('buyer_welcome')}, {session?.user?.name?.split(' ')[0] || t('Partner')}
                    </h1>
                    <p className="text-gray-500 mt-1">{t('factory_subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-2xl md:text-3xl font-bold text-gray-900 truncate max-w-[150px] ${isArabic ? 'font-arabic' : 'font-heading'}`}>{stat.value}</span>
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

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-primary-900">{t('recent_orders')}</h3>
                        <Link href="/factory/orders" className="text-sm text-primary-600 hover:underline">{t('view_all')}</Link>
                    </div>
                    <div className="flex items-center justify-center h-32 text-gray-400 bg-surface-50 rounded-lg">
                        {t('no_active_orders')}
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                    <h3 className="font-bold text-lg mb-2">{t('enhance_profile')}</h3>
                    <p className="text-gray-300 mb-6 text-sm">{t('enhance_profile_desc')}</p>
                    <Link href="/factory/products" className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors inline-block">
                        {t('manage_products')}
                    </Link>
                </Card>
            </div>
        </div>
    );
}
