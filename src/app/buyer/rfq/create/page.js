'use client';

import { createRfq } from '@/app/actions/rfq';
import styles from '@/app/signup/page.module.css';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useSearchParams } from 'next/navigation';

function CreateRfqForm() {
    const [loading, setLoading] = useState(false);
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const searchParams = useSearchParams();

    // Pre-fill from URL
    const defaultTitle = searchParams.get('title') || '';
    const defaultDesc = searchParams.get('description') || '';

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className="mb-6">
                <Link href="/buyer/rfq" className={`flex items-center text-gray-500 hover:text-green-700 transition-colors ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <span className={`text-xl ${isArabic ? 'ml-2' : 'mr-2'}`}>←</span>
                    {t('go_back')}
                </Link>
            </div>

            <h1 className={`text-2xl font-bold mb-6 ${isArabic ? 'font-arabic' : ''}`}>{t('post_new_rfq')}</h1>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
                <form action={createRfq} onSubmit={() => setLoading(true)} className={`${styles.form} ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('rfq_title')}</label>
                        <input
                            name="title"
                            defaultValue={defaultTitle}
                            type="text"
                            className={styles.input}
                            placeholder={t('rfq_title_placeholder')}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('qty_required')}</label>
                        <input
                            name="quantity"
                            type="number"
                            className={styles.input}
                            placeholder={t('qty_placeholder')}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('detailed_requirements')}</label>
                        <textarea
                            name="description"
                            defaultValue={defaultDesc}
                            className={styles.input}
                            rows="6"
                            placeholder={t('requirements_desc')}
                            style={{ resize: 'vertical' }}
                            required
                        ></textarea>
                    </div>

                    <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 mb-6">
                        {t('rfq_visibility_notice')}
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? t('posting') : t('post_rfq')}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Separate component or simple text works for fallback, but for strict localization we need context.
// However Suspense boundary is outside context usually? No, context is top level.
// But CreateRfqPage component is non-async, so we can use hooks inside it if we make it client?
// It IS a client component.

export default function CreateRfqPage() {
    // We can't easily use hooks here if we want Suspense to work for the *child* but 
    // actually, Suspense is for the useSearchParams inside CreateRfqForm.
    // We can put a localized loading text if we lift useLanguage up or just use a generic spinner.
    // For now, let's use a safe hardcoded English/Arabic generic or just "Loading..." if no context.
    // Better: wrap the fallback in a component that uses useLanguage? Overkill.

    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <CreateRfqForm />
        </Suspense>
    );
}
