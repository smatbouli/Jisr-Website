'use client';

import { useState } from 'react';
import { changePassword } from '@/app/actions/user'; // Will create this next
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { useLanguage } from '@/components/LanguageContext';

export default function ChangePasswordForm() {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(formData) {
        setLoading(true);
        setMessage('');
        setError('');

        const result = await changePassword(formData);

        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else {
            setMessage(t('password_updated_success') || 'Password updated successfully.');
            // Optional: reset form
        }
    }

    return (
        <Card className="p-6 mt-8">
            <h3 className={`text-lg font-bold text-gray-900 mb-4 ${isArabic ? 'text-right' : ''}`}>{t('security')}</h3>

            <form action={handleSubmit} className={`space-y-4 max-w-md ${isArabic ? 'ml-auto text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('current_password')}</label>
                    <Input type="password" name="currentPassword" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('new_password')}</label>
                    <Input type="password" name="newPassword" required minLength={6} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{t('confirm_new_password')}</label>
                    <Input type="password" name="confirmPassword" required minLength={6} />
                </div>

                {message && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{message}</p>}
                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? t('updating') || 'Updating...' : t('update_password') || 'Update Password'}
                </Button>
            </form>
        </Card>
    );
}
