'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function ContactView({ content }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    // Helper to get dynamic content or fallback
    const getKey = (key, fallbackKey) => {
        if (content) {
            const dynamicKey = isArabic ? `${key}_ar` : `${key}_en`;
            if (content[dynamicKey]) return content[dynamicKey];
        }
        return t(fallbackKey);
    };

    return (
        <div className={`bg-surface-50 min-h-screen py-20 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                        {content ? (isArabic ? content.title_ar : content.title_en) : t('contact_title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {content ? (isArabic ? content.description_ar : content.description_en) : t('contact_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{t('email_us')}</h3>
                                <p className="text-gray-600 text-sm mb-1">{t('general_inquiries')}</p>
                                <a href={`mailto:${content?.email || 'support@sinaa.sa'}`} className="text-primary-600 font-medium hover:underline">
                                    {content?.email || 'support@sinaa.sa'}
                                </a>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{t('call_us')}</h3>
                                <p className="text-gray-600 text-sm mb-1">{t('working_hours')}</p>
                                <a href={`tel:${content?.phone || '+966123456789'}`} className="text-primary-600 font-medium hover:underline">
                                    {content?.phone || '+966 12 345 6789'}
                                </a>
                            </div>
                        </Card>

                    </div>

                    {/* Contact Form - kept as is */}
                    <div className="md:col-span-2">
                        <Card className="p-8">
                            <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isArabic ? 'font-arabic' : ''}`}>{t('send_message')}</h2>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">{t('first_name')}</label>
                                        <Input placeholder="John" className={isArabic ? 'text-right' : ''} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">{t('last_name')}</label>
                                        <Input placeholder="Doe" className={isArabic ? 'text-right' : ''} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('email_address')}</label>
                                    <Input type="email" placeholder="john@company.com" className={isArabic ? 'text-right' : ''} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('message_label')}</label>
                                    <textarea
                                        className={`flex min-h-[150px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isArabic ? 'text-right' : ''}`}
                                        placeholder={t('message_placeholder')}
                                    />
                                </div>

                                <Button size="lg" className="w-full md:w-auto">
                                    {t('btn_send_message')} <Send size={16} className={`ml-2 ${isArabic ? 'rotate-180' : ''}`} />
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
