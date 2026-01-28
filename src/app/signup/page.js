'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

export default function SignupPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('BUYER');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        data.role = role;

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.message || 'Registration failed');
            }

            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex bg-white ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Left Side: Luxury Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary-950 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative z-10 max-w-lg px-8 text-center text-white">
                    <h2 className={`text-4xl mb-6 ${isArabic ? 'font-arabic font-bold' : 'font-heading'}`}>{t('join_movement')}</h2>
                    <p className="text-xl text-primary-200 leading-relaxed font-light">
                        {t('signup_visual_quote')}
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <div className="text-center">
                            <span className="block text-3xl font-bold font-serif text-accent-500">2k+</span>
                            <span className="text-xs text-gray-400 uppercase">{t('companies')}</span>
                        </div>
                        <div className="w-px bg-white/20 h-10" />
                        <div className="text-center">
                            <span className="block text-3xl font-bold font-serif text-accent-500">500+</span>
                            <span className="text-xs text-gray-400 uppercase">{t('stat_factories')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-surface-50 h-screen overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="text-center mb-8">
                        <Link href="/" className={`inline-block text-3xl font-bold text-primary-900 mb-2 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                            Jisr
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">{t('create_account')}</h2>
                    </div>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200 mb-6">{error}</div>}

                    <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('BUYER')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'BUYER' ? 'bg-white shadow text-primary-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {t('Buyer')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('FACTORY')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'FACTORY' ? 'bg-white shadow text-primary-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {t('Factory')}
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_name')}</label>
                            <Input name="businessName" placeholder="e.g. Al-Rajhi Industries" required className={isArabic ? 'text-right' : ''} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
                            <Input name="fullName" placeholder="Your name" required className={isArabic ? 'text-right' : ''} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('work_email')}</label>
                            <Input name="email" type="email" placeholder="name@company.com" required className={isArabic ? 'text-right' : ''} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                            <Input name="password" type="password" placeholder={t('create_password')} required minLength={6} className={isArabic ? 'text-right' : ''} />
                        </div>

                        <div className="flex items-start">
                            <input id="terms" type="checkbox" className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" required />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                                {t('agree_terms')} <Link href="/terms" className="text-primary-700 underline">{t('terms')}</Link> {t('and')} <Link href="/privacy" className="text-primary-700 underline">{t('privacy_policy')}</Link>
                            </label>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={loading}>
                            {loading ? t('creating_account') : t('btn_create_account')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {t('already_have_account')}{' '}
                        <Link href="/login" className="font-semibold text-primary-700 hover:text-primary-600">
                            {t('sign_in')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
