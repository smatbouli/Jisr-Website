'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { verifyUser } from '@/app/actions/auth';
import { useLanguage } from '@/components/LanguageContext';

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await verifyUser(email, code);
            if (res.success) {
                router.push('/login?verified=true');
            } else {
                setError(res.error || 'Verification failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-surface-50 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    📧
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verify_email_title') || 'Verify Your Email'}</h1>
                <p className="text-gray-500 mb-6">
                    {t('verify_email_desc') || `We sent a code to ${email}. Please enter it below.`}
                </p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="code"
                        placeholder="123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="text-center text-2xl tracking-widest h-14"
                        maxLength={6}
                        required
                    />
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? (t('verifying') || 'Verifying...') : (t('verify_btn') || 'Verify Account')}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyForm />
        </Suspense>
    );
}
