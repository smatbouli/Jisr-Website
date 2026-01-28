'use client';

import { useLanguage } from '@/components/LanguageContext';

export default function SettingsHeader({ titleKey = 'account_settings', descKey = 'manage_profile_desc' }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`mb-8 ${isArabic ? 'font-arabic text-right' : ''}`}>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{t(titleKey)}</h1>
            <p className="text-gray-600">{t(descKey)}</p>
        </div>
    );
}
