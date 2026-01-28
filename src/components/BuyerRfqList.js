'use client';

import { useLanguage } from '@/components/LanguageContext';
import styles from '@/app/dashboard/page.module.css';
import Link from 'next/link';

export default function BuyerRfqList({ rfqs }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={isArabic ? 'font-arabic' : ''}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${isArabic ? 'font-arabic' : ''}`}>{t('my_rfqs_title')}</h1>
                    <p className="text-gray-600">{t('manage_sourcing')}</p>
                </div>
                <Link href="/buyer/rfq/create" className={`${styles.actionButton} ${isArabic ? 'font-arabic' : ''}`}>
                    + {t('post_new_rfq')}
                </Link>
            </div>

            {rfqs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_rfqs')}</h3>
                    <p className="text-gray-500 mb-6">{t('start_sourcing')}</p>
                    <Link href="/buyer/rfq/create" className="text-green-700 font-medium hover:underline">
                        {t('create_first_rfq')}
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {rfqs.map(rfq => (
                        <div key={rfq.id} className="bg-white p-6 rounded shadow-sm border flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{rfq.title}</h3>
                                <div className="text-sm text-gray-500 flex gap-4">
                                    <span>{t('qty')}: {rfq.quantity}</span>
                                    <span>•</span>
                                    <span>{new Date(rfq.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className={rfq.status === 'OPEN' ? 'text-green-600' : 'text-gray-600'}>
                                        {t(`status_${rfq.status.toLowerCase()}`) || rfq.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">{rfq._count.responses}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">{t('quotes')}</div>
                                </div>
                                <Link
                                    href={`/buyer/rfq/${rfq.id}`}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
                                >
                                    {t('manage')}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
