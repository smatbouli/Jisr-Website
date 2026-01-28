'use client';

import { useLanguage } from '@/components/LanguageContext';
import DisputeList from '@/components/admin/DisputeList';
import { AlertOctagon } from 'lucide-react';

export default function DisputesPageClient({ disputes }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 flex items-center gap-3">
                    <AlertOctagon className="text-red-600" /> {t('admin_disputes')}
                </h1>
                <p className="text-gray-600">{t('dispute_resolution')}</p>
            </div>

            <DisputeList disputes={disputes} />
        </div>
    );
}
