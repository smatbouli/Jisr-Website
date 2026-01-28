'use client';

import { useLanguage } from '@/components/LanguageContext';
import UserManagement from '@/components/admin/UserManagement';

export default function UsersPageClient({ initialUsers }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">{t('user_management')}</h1>
                <p className="text-gray-600">{t('total_users')}: {initialUsers.length}</p>
            </div>

            <UserManagement initialUsers={initialUsers} />
        </div>
    );
}
