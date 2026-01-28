'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Save, CheckCircle, AlertCircle, LayoutTemplate, Type } from 'lucide-react';
import { updateSiteContent, updateSiteHeader } from '@/app/actions/content';
import { useLanguage } from '@/components/LanguageContext';

export default function ContentEditor({ initialHero, initialHeader, initialAbout, initialContact }) {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    async function handleSubmit(formData) {
        setLoading(true);
        setMessage(null);

        // 1. Process Hero Data
        const heroData = {
            title1: formData.get('title1'),
            highlight1: formData.get('highlight1'),
            title2: formData.get('title2'),
            highlight2: formData.get('highlight2'),
            description: formData.get('description'),
            ctaPrimary: formData.get('ctaPrimary'),
            ctaSecondary: formData.get('ctaSecondary'),
        };

        // 2. Process About Data
        const aboutData = {
            title_en: formData.get('about_title_en'),
            title_ar: formData.get('about_title_ar'),
            description_en: formData.get('about_desc_en'),
            description_ar: formData.get('about_desc_ar'),
            mission_title_en: formData.get('mission_title_en'),
            mission_title_ar: formData.get('mission_title_ar'),
            mission_desc_en: formData.get('mission_desc_en'),
            mission_desc_ar: formData.get('mission_desc_ar'),
            vision_title_en: formData.get('vision_title_en'),
            vision_title_ar: formData.get('vision_title_ar'),
            vision_desc_en: formData.get('vision_desc_en'),
            vision_desc_ar: formData.get('vision_desc_ar'),
            values_title_en: formData.get('values_title_en'),
            values_title_ar: formData.get('values_title_ar'),
            values_desc_en: formData.get('values_desc_en'),
            values_desc_ar: formData.get('values_desc_ar'),
            story_title_en: formData.get('story_title_en'),
            story_title_ar: formData.get('story_title_ar'),
            story_p1_en: formData.get('story_p1_en'),
            story_p1_ar: formData.get('story_p1_ar'),
            story_p2_en: formData.get('story_p2_en'),
            story_p2_ar: formData.get('story_p2_ar'),
            story_p3_en: formData.get('story_p3_en'),
            story_p3_ar: formData.get('story_p3_ar'),
        };

        // 3. Process Contact Data
        const contactData = {
            title_en: formData.get('contact_title_en'),
            title_ar: formData.get('contact_title_ar'),
            description_en: formData.get('contact_desc_en'),
            description_ar: formData.get('contact_desc_ar'),
            email: formData.get('contact_email'),
            phone: formData.get('contact_phone'),
        };

        try {
            // Update All Content
            const results = await Promise.all([
                updateSiteContent('homepage_hero', heroData),
                updateSiteContent('about_page', aboutData),
                updateSiteContent('contact_page', contactData),
                updateSiteHeader(formData)
            ]);

            const failed = results.find(r => !r.success);
            if (failed) throw new Error(failed.error);

            setMessage({ type: 'success', text: 'Changes saved successfully! Your website has been updated.' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.message || 'Failed to save changes. Please try again.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 pb-24">
            {/* Feedback Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 fixed top-24 right-4 z-50 shadow-lg animate-in slide-in-from-right ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            {/* Header Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                    <Type className="text-primary-600" />
                    <h2 className="text-xl font-bold">{t('header_settings')}</h2>
                </div>
                {/* ... Header fields (no changes) ... */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Text (Fallback)</label>
                        <input
                            name="logoText"
                            defaultValue={initialHeader?.logoText || "Sinaa'"}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Image</label>
                        <div className="flex items-center gap-4">
                            {initialHeader?.logoUrl && (
                                <div className="border p-2 rounded bg-gray-50">
                                    <img src={initialHeader.logoUrl} alt="Current Logo" className="h-8 object-contain" />
                                </div>
                            )}
                            <input
                                type="file"
                                name="logoFile"
                                accept="image/png, image/svg+xml, image/jpeg"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Homepage Hero Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                    <LayoutTemplate className="text-primary-600" />
                    <h2 className="text-xl font-bold">{t('homepage_hero_section')}</h2>
                </div>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title Line 1</label>
                            <input name="title1" defaultValue={initialHero?.title1} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Highlight 1 (Color)</label>
                            <input name="highlight1" defaultValue={initialHero?.highlight1} className="w-full p-2 border rounded text-primary-600 font-bold focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                        </div>
                    </div>
                    {/* ... other hero fields ... */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title Line 2</label>
                            <input name="title2" defaultValue={initialHero?.title2} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Highlight 2 (Italic)</label>
                            <input name="highlight2" defaultValue={initialHero?.highlight2} className="w-full p-2 border rounded font-serif italic text-accent-600 focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea name="description" defaultValue={initialHero?.description} rows={3} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Button Text</label>
                            <input name="ctaPrimary" defaultValue={initialHero?.ctaPrimary} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Secondary Button Text</label>
                            <input name="ctaSecondary" defaultValue={initialHero?.ctaSecondary} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500 outline-none transition" required />
                        </div>
                    </div>
                </div>
            </Card>

            {/* About Us Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                    <LayoutTemplate className="text-primary-600" />
                    <h2 className="text-xl font-bold">{t('about_us_page')}</h2>
                </div>
                <div className="space-y-6">
                    {/* Main Title & Desc */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-1">English</h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Page Title</label>
                                <input name="about_title_en" defaultValue={initialAbout?.title_en || 'Combining Quality & Authenticity'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                                <textarea name="about_desc_en" defaultValue={initialAbout?.description_en || 'Sinaa is the premier digital gateway connecting Saudi Arabia\'s finest manufacturers with global markets, redefining industrial excellence.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-4" dir="rtl">
                            <h3 className="font-semibold text-gray-900 border-b pb-1">العربية</h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">عنوان الصفحة</label>
                                <input name="about_title_ar" defaultValue={initialAbout?.title_ar || 'نجمع بين الجودة والأصالة'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">الوصف</label>
                                <textarea name="about_desc_ar" defaultValue={initialAbout?.description_ar || 'صناع هي البوابة الرقمية الأولى التي تربط أفضل المصانع في السعودية بالأسواق العالمية، لتعيد تعريف التميز الصناعي.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mission Title (EN)</label>
                                <input name="mission_title_en" defaultValue={initialAbout?.mission_title_en || 'Our Mission'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mission Description (EN)</label>
                                <textarea name="mission_desc_en" defaultValue={initialAbout?.mission_desc_en || 'Empowering Saudi manufacturers by providing a trusted, seamless platform that showcases their quality to the world.'} rows={2} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-4" dir="rtl">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">عنوان المهمة (AR)</label>
                                <input name="mission_title_ar" defaultValue={initialAbout?.mission_title_ar || 'مهمتنا'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">وصف المهمة (AR)</label>
                                <textarea name="mission_desc_ar" defaultValue={initialAbout?.mission_desc_ar || 'تمكين المصنعين السعوديين من خلال توفير منصة موثوقة وسلسة تعرض جودتهم للعالم.'} rows={2} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vision Title (EN)</label>
                                <input name="vision_title_en" defaultValue={initialAbout?.vision_title_en || 'Vision 2030'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Vision Description (EN)</label>
                                <textarea name="vision_desc_en" defaultValue={initialAbout?.vision_desc_en || 'Proudly contributing to the Kingdom\'s Vision 2030 by digitizing the industrial sector and fostering economic growth.'} rows={2} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-4" dir="rtl">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">عنوان الرؤية (AR)</label>
                                <input name="vision_title_ar" defaultValue={initialAbout?.vision_title_ar || 'رؤية 2030'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">وصف الرؤية (AR)</label>
                                <textarea name="vision_desc_ar" defaultValue={initialAbout?.vision_desc_ar || 'نساهم بفخر في رؤية المملكة 2030 من خلال رقمنة القطاع الصناعي وتعزيز النمو الاقتصادي.'} rows={2} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Values Title (EN)</label>
                                <input name="values_title_en" defaultValue={initialAbout?.values_title_en || 'Our Values'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Values Description (EN)</label>
                                <textarea name="values_desc_en" defaultValue={initialAbout?.values_desc_en || 'Rooted in trust, transparency, and the pursuit of excellence. We believe in building lasting partnerships, not just transactions.'} rows={2} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                        <div className="space-y-4" dir="rtl">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">عنوان القيم (AR)</label>
                                <input name="values_title_ar" defaultValue={initialAbout?.values_title_ar || 'قيمنا'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">وصف القيم (AR)</label>
                                <textarea name="values_desc_ar" defaultValue={initialAbout?.values_desc_ar || 'راسخة في الثقة، الشفافية، والسعي نحو التميز. نؤمن ببناء شراكات دائمة، وليس مجرد معاملات.'} rows={2} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Story */}
                    <div className="pt-4 border-t">
                        <h4 className="font-semibold text-gray-900 mb-4">Our Story</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Story Title (EN)</label>
                                    <input name="story_title_en" defaultValue={initialAbout?.story_title_en || 'The Jisr Story'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Paragraph 1 (EN)</label>
                                    <textarea name="story_p1_en" defaultValue={initialAbout?.story_p1_en || 'Saudi Arabia has always been a land of trade and craftsmanship. As the industrial sector boomed, a new challenge emerged: visibility and access.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Paragraph 2 (EN)</label>
                                    <textarea name="story_p2_en" defaultValue={initialAbout?.story_p2_en || 'We noticed that while Saudi factories were producing world-class goods, finding and verifying them was a complex, analog process. Jisr was born to change that.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Paragraph 3 (EN)</label>
                                    <textarea name="story_p3_en" defaultValue={initialAbout?.story_p3_en || 'Today, we are the digital backbone for thousands of businesses, simplifying procurement from discovery to delivery.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                            </div>
                            <div className="space-y-4" dir="rtl">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">عنوان القصة (AR)</label>
                                    <input name="story_title_ar" defaultValue={initialAbout?.story_title_ar || 'قصة صناع'} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">الفقرة 1 (AR)</label>
                                    <textarea name="story_p1_ar" defaultValue={initialAbout?.story_p1_ar || 'لطالما كانت المملكة العربية السعودية أرض التجارة والحرفية. ومع الازدهار الصناعي، ظهر تحدٍ جديد: الظهور والوصول.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">الفقرة 2 (AR)</label>
                                    <textarea name="story_p2_ar" defaultValue={initialAbout?.story_p2_ar || 'لاحظنا أنه بينما تنتج المصانع السعودية سلعاً عالمية المستوى، فإن العثور عليها والتحقق منها كان عملية معقدة وتقليدية. ولدت "صناع" لتغيير ذلك.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">الفقرة 3 (AR)</label>
                                    <textarea name="story_p3_ar" defaultValue={initialAbout?.story_p3_ar || 'اليوم، نحن العمود الفقري الرقمي لآلاف الشركات، نبسط عملية الشراء من الاكتشاف وحتى التوصيل.'} rows={3} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Contact Us Settings */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b">
                    <LayoutTemplate className="text-primary-600" />
                    <h2 className="text-xl font-bold">{t('contact_us_page')}</h2>
                </div>
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 border-b pb-1">General Info</h3>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Support Email</label>
                                <input name="contact_email" defaultValue={initialContact?.email || 'support@sinaa.sa'} className="w-full p-2 border rounded bg-gray-50 text-sm" placeholder="support@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</label>
                                <input name="contact_phone" defaultValue={initialContact?.phone || '+966 12 345 6789'} className="w-full p-2 border rounded bg-gray-50 text-sm" placeholder="+966..." />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="fixed bottom-6 right-6 md:static md:flex md:justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className={`bg-primary-900 text-white hover:bg-primary-800 shadow-lg md:shadow-none min-w-[150px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Saving...' : (
                        <>
                            <Save size={18} className="mr-2" /> Save All Changes
                        </>
                    )}
                </Button>
            </div>
        </form >
    );
}
