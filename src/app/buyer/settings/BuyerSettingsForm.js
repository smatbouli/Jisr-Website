'use client';

import { updateBuyerProfile } from '@/app/actions/buyer';
import { useLanguage } from '@/components/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

export default function BuyerSettingsForm({ initialData }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData) {
        setLoading(true);
        try {
            await updateBuyerProfile(formData);
            alert(t('profile_updated_success') || 'Profile updated successfully!');
        } catch (error) {
            alert(t('profile_update_failed') || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="p-6">
            <form action={handleSubmit} className={`space-y-4 ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('business_name') || 'Business Name'}</label>
                    <Input
                        name="businessName"
                        defaultValue={initialData?.businessName || ''}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('city_label')}</label>
                    <Input
                        name="city"
                        defaultValue={initialData?.city || ''}
                        required
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading ? t('saving') || 'Saving...' : t('save_changes') || 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
