'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Target, Heart, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function AboutView({ content }) {
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
        <div className={`bg-surface-50 min-h-screen pb-20 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <div className="bg-primary-900 text-white py-20 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#FF0066" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,71.4,32.7C60.6,43.9,50.3,53.4,39,63.4C27.7,73.4,15.4,83.9,0.9,82.3C-13.6,80.7,-29.9,67,-42.6,55.5C-55.3,44,-64.4,34.7,-71.4,23.3C-78.4,11.9,-83.3,-1.6,-80.7,-13.9C-78.1,-26.2,-68,-37.3,-56.3,-45.5C-44.6,-53.7,-31.3,-59,-18.2,-61.1C-5.1,-63.2,7.8,-62.1,19.9,-64.2L30.5,-69.2" transform="translate(100 100) scale(1.1)" />
                    </svg>
                </div>
                <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
                    <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${isArabic ? 'font-arabic' : 'font-heading'}`}>
                        {content ? (isArabic ? content.title_ar : content.title_en) : (
                            <>
                                {t('about_title_1')} <span className="text-primary-300">{t('about_title_2')}</span>
                            </>
                        )}
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-100 font-light leading-relaxed">
                        {content ? (isArabic ? content.description_ar : content.description_en) : t('about_desc')}
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-t-primary-600">
                        <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{getKey('mission_title', 'mission_title')}</h3>
                        <p className="text-gray-600">
                            {getKey('mission_desc', 'mission_desc')}
                        </p>
                    </Card>
                    <Card className="p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-t-orange-500">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{getKey('values_title', 'values_title')}</h3>
                        <p className="text-gray-600">
                            {getKey('values_desc', 'values_desc')}
                        </p>
                    </Card>
                    <Card className="p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-t-purple-600">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{getKey('vision_title', 'vision_title')}</h3>
                        <p className="text-gray-600">
                            {getKey('vision_desc', 'vision_desc')}
                        </p>
                    </Card>
                </div>
            </div>

            {/* Story Section */}
            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className={`text-3xl font-bold text-gray-900 ${isArabic ? 'font-arabic' : 'font-heading'}`}>{getKey('story_title', 'story_title')}</h2>
                        <div className="w-20 h-1 bg-primary-600 rounded-full" />
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {getKey('story_p1', 'story_p1')}
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {getKey('story_p2', 'story_p2')}
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {getKey('story_p3', 'story_p3')}
                        </p>
                        <div className="pt-4">
                            <Button size="lg" onClick={() => window.location.href = '/signup'}>
                                {t('join_journey')} <ArrowRight className={`ml-2 ${isArabic ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
