'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { FileText, MessageSquare, Heart, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function BuyerDashboard() {
    const { data: session } = useSession();
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    // Mock data - in a real app, this would be fetched from an API
    const stats = [
        {
            label: t('active_rfqs'),
            value: '0',
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            action: t('create_new_rfq'),
            href: '/buyer/rfq/create'
        },
        {
            label: t('active_quotes'), // Using active_quotes or creating pending_quotes if strictly different
            value: '0',
            icon: MessageSquare,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            action: t('view_quotes'),
            href: '/buyer/rfq'
        },
        {
            label: t('saved_factories'),
            value: '0',
            icon: Heart,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            action: t('browse_directory'),
            href: '/buyer/factories'
        }
    ];

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold text-primary-900 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                        {t('buyer_welcome')}, {session?.user?.name?.split(' ')[0] || t('Buyer')}
                    </h1>
                    <p className="text-gray-500 mt-1">{t('buyer_subtitle')}</p>
                </div>
                <Link
                    href="/buyer/rfq/create"
                    className="inline-flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-lg hover:bg-primary-800 transition-colors shadow-md hover:shadow-lg font-medium"
                >
                    <Plus size={18} />
                    {t('create_new_rfq')}
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 flex flex-col justify-between hover:shadow-lg transition-shadow border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-4xl font-bold text-gray-900 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{stat.value}</span>
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

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 min-h-[200px]">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">{t('recent_activity')}</h3>
                    <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                        {t('no_recent_activity')}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
                    <h3 className="font-bold text-lg mb-2">{t('need_verified_suppliers')}</h3>
                    <p className="text-primary-100 mb-6 text-sm">{t('sourcing_help')}</p>
                    <Link href="/buyer/factories" className="bg-white text-primary-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-50 transition-colors inline-block">
                        {t('browse_directory')}
                    </Link>
                </Card>
            </div>
        </div>
    );
}
