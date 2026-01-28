'use client';

import { getRfqById, submitQuote } from '@/app/actions/rfq';
import styles from '@/app/signup/page.module.css';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function FactoryRfqDetailPage({ params }) {
    const [rfq, setRfq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    // Unwrap params
    const resolvedParams = use(params);

    useEffect(() => {
        const load = async () => {
            const data = await getRfqById(resolvedParams.id);
            setRfq(data);
            setLoading(false);
        };
        load();
    }, [resolvedParams.id]);

    if (loading) return <div className="p-8 text-center">{t('loading_rfq')}</div>;
    if (!rfq) return <div className="p-8 text-center">{t('rfq_not_found')}</div>;

    return (
        <div style={{ maxWidth: '900px' }} className={isArabic ? 'font-arabic' : ''} dir={isArabic ? 'rtl' : 'ltr'}>
            <Link href="/factory/rfq" className={`text-gray-500 hover:text-blue-600 mb-6 inline-flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className={isArabic ? 'rotate-180' : ''}>←</span> {t('back_to_market')}
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
                {/* RFQ Details Column */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-lg shadow-sm border">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">{rfq.title}</h1>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">{t('status_open')}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                            <span>{t('posted_by')} <strong>{rfq.buyer.businessName}</strong></span>
                            {rfq.buyer.city && <span>• {rfq.buyer.city}</span>}
                            <span>• {new Date(rfq.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="prose max-w-none text-gray-700">
                            <h3 className="text-lg font-semibold mb-2">{t('requirements')}</h3>
                            <p className="whitespace-pre-wrap">{rfq.description}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">{t('quantity_needed')}</label>
                                <div className="text-xl font-medium">{rfq.quantity} {t('pcs')}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">{t('responses_count')}</label>
                                <div className="text-xl font-medium">{rfq.responses.length} {t('quotes')}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote Form Column */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
                        <h2 className="text-lg font-bold mb-4">{t('submit_quote_title')}</h2>

                        <form action={submitQuote} onSubmit={() => setSubmitting(true)} className={`${styles.form} ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                            <input type="hidden" name="rfqId" value={rfq.id} />

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>{t('price_per_unit_sar')}</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    className={styles.input}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>{t('notes_proposal')}</label>
                                <textarea
                                    name="notes"
                                    className={styles.input}
                                    rows="4"
                                    placeholder={t('notes_placeholder')}
                                    style={{ resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={submitting}
                            >
                                {submitting ? t('sending') : t('send_quote')}
                            </button>

                            <p className="text-xs text-gray-400 mt-4 text-center">
                                {t('agree_terms_notice')}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
