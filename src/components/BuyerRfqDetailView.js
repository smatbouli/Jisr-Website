'use client';

import { useLanguage } from '@/components/LanguageContext';
import BackButton from '@/components/BackButton';
import RfqResponseActions from '@/components/RfqResponseActions';
import { cn } from '@/lib/utils';

export default function BuyerRfqDetailView({ rfq }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={isArabic ? 'font-arabic text-right' : ''} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="mb-6">
                <BackButton href="/buyer/rfq" labelKey="back_to_rfqs" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{rfq.title}</h1>
                        <div className="text-sm text-gray-500">
                            {t('posted_on')} {new Date(rfq.createdAt).toLocaleDateString()} • {t(`status_${rfq.status.toLowerCase()}`) || rfq.status}
                        </div>
                    </div>

                </div>

                <div className="bg-gray-50 p-4 rounded mb-4">
                    <h3 className="font-semibold mb-1">{t('description')}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{rfq.description}</p>
                </div>

                <div>
                    <span className="font-semibold">{t('quantity')}:</span> {rfq.quantity}
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">{t('quotes_received')} ({rfq.responses.length})</h2>

            {rfq.responses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded border border-dashed">
                    <p className="text-gray-500">{t('no_quotes_yet')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rfq.responses.map(response => (
                        <div key={response.id} className="bg-white p-6 rounded shadow-sm border hover:border-blue-300 transition">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{response.factory.businessName}</h3>
                                    <div className="text-xs text-gray-400">{t('received_on')} {new Date(response.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className={isArabic ? 'text-left' : 'text-right'}>
                                    <div className="text-2xl font-bold text-green-700">{response.price} SAR</div>
                                    <div className="text-xs text-gray-500">{t('per_unit')}</div>
                                </div>
                            </div>

                            {response.notes && (
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4">
                                    &quot;{response.notes}&quot;
                                </div>
                            )}

                            <div className={`flex gap-3 items-center ${isArabic ? 'justify-end' : 'justify-end'}`}>
                                {response.status === 'AWARDED' ? (
                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded text-sm font-medium border border-green-200">
                                        {t('contract_awarded')}
                                    </span>
                                ) : (
                                    <RfqResponseActions response={response} rfqTitle={rfq.title} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
