'use client';

import { useLanguage } from '@/components/LanguageContext';
import OrderManagement from '@/components/admin/OrderManagement';

export default function OrdersPageClient({ initialOrders }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">{t('admin_orders') || 'Orders'}</h1>
                <p className="text-gray-600">{t('total_orders')}: {initialOrders.length}</p>
            </div>

            <OrderManagement initialOrders={initialOrders} />
        </div>
    );
}
