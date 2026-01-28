'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function BackButton({ href, labelKey = 'go_back', className = '' }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <Link
            href={href}
            className={`inline-flex items-center text-gray-500 hover:text-primary-600 transition-colors mb-6 ${className} ${isArabic ? 'flex-row-reverse space-x-reverse font-arabic' : ''}`}
        >
            <ArrowLeft size={16} className={`${isArabic ? 'ml-2 rotate-180' : 'mr-2'}`} />
            <span>{t(labelKey)}</span>
        </Link>
    );
}
