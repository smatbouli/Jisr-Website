'use client';

import { Card } from '@/components/ui/Card';
import { BarChart3, Eye, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function FactoryAnalyticsClient() {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <h1 className="text-3xl font-heading font-bold text-gray-900">{t('performance_analytics')}</h1>
            <p className="text-gray-600">{t('performance_desc')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Eye size={14} /> {t('profile_views')}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">128</p>
                    <span className={`text-xs text-green-600 font-bold ${isArabic ? 'flex flex-row-reverse justify-end gap-1' : ''}`}>
                        <span>↑ 12%</span> <span>{t('this_week')}</span>
                    </span>
                </Card>
                <Card className="p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Users size={14} /> {t('unique_visitors')}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">84</p>
                    <span className={`text-xs text-green-600 font-bold ${isArabic ? 'flex flex-row-reverse justify-end gap-1' : ''}`}>
                        <span>↑ 5%</span> <span>{t('this_week')}</span>
                    </span>
                </Card>
                <Card className="p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <TrendingUp size={14} /> {t('ctr')}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">3.2%</p>
                    <span className="text-xs text-gray-400">{t('avg_click_rate')}</span>
                </Card>
                <Card className="p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <BarChart3 size={14} /> {t('rfq_conversions')}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">2</p>
                    <span className="text-xs text-gray-400">{t('quotes_awarded')}</span>
                </Card>
            </div>

            <Card className="p-16 text-center border-dashed border-gray-200 shadow-none bg-surface-50">
                <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('detailed_reports_coming_soon')}</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    {t('gathering_data_desc')}
                </p>
            </Card>
        </div>
    );
}
