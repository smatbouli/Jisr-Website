'use client';

import { useLanguage } from '@/components/LanguageContext';
import ContentEditor from '@/components/admin/ContentEditor';

export default function ContentPageClient({ initialHero, initialHeader, initialAbout, initialContact }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">{t('content_management')}</h1>
                <p className="text-gray-600">{t('content_management_desc') || 'Customize the text and appearance of your storefront.'}</p>
            </div>

            <ContentEditor
                initialHero={initialHero}
                initialHeader={initialHeader}
                initialAbout={initialAbout}
                initialContact={initialContact}
            />
        </div>
    );
}
