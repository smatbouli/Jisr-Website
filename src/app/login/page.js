'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';


function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid email or password');
            } else {
                // Force a hard navigation to ensure session cookies are recognized
                router.refresh();
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex bg-white ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Left Side: Luxury Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 max-w-lg px-8 text-center text-white">
                    <h2 className={`text-4xl mb-6 ${isArabic ? 'font-arabic font-bold' : 'font-heading'}`}>{t('login_visual_title')}</h2>
                    <blockquote className="text-xl italic text-primary-200 leading-relaxed font-serif">
                        {t('login_visual_quote')}
                    </blockquote>
                    <p className="mt-6 text-primary-300 font-sans text-sm tracking-wider uppercase">{t('ksa')}</p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-800 opacity-20 blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-600 opacity-10 blur-3xl" />
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-surface-50">
                <motion.div
                    initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="text-center">
                        <Link href="/" className={`inline-block text-3xl font-bold text-primary-900 mb-2 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                            Jisr
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 mt-4">{t('welcome_back')}</h2>
                        <p className="mt-2 text-sm text-gray-500">{t('signin_desc')}</p>
                    </div>

                    {registered && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center border border-green-200">
                            Account created successfully! Please sign in.
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('email_address')}</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="name@company.com"
                                    className={isArabic ? 'text-right' : ''}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    className={isArabic ? 'text-right' : ''}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">{t('remember_me')}</label>
                            </div>
                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-primary-700 hover:text-primary-500">
                                    {t('forgot_password')}
                                </Link>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={loading}>
                            {loading ? t('signing_in') : t('sign_in')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {t('no_account')}{' '}
                        <Link href="/signup" className="font-semibold text-primary-700 hover:text-primary-600 transition-colors">
                            {t('signup_free')}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
