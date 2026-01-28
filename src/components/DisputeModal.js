'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { createDispute } from '@/app/actions/order';

import { useLanguage } from '@/components/LanguageContext';

export default function DisputeModal({ orderId }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(formData) {
        setLoading(true);
        setError(null);

        const reason = formData.get('reason');
        const description = formData.get('description');

        const result = await createDispute(orderId, { reason, description });

        if (result.success) {
            setOpen(false);
            // Optional: Show success toast or rely on page refresh
        } else {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <AlertTriangle size={16} className={`mr-2 ${isArabic ? 'ml-2 mr-0' : ''}`} /> {t('report_problem')}
                </Button>
            </DialogTrigger>
            <DialogContent className={isArabic ? 'text-right' : ''} dir={isArabic ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 text-red-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <AlertTriangle size={20} /> {t('report_issue_title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    <p className="text-sm text-gray-500 mb-4">
                        {t('dispute_notice')}
                    </p>

                    <form action={handleSubmit} className="space-y-4">
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <div>
                            <label className="block text-sm font-semibold mb-1">{t('dispute_reason')}</label>
                            <select name="reason" className="w-full p-2 border rounded" required>
                                <option value="">{t('select_reason')}</option>
                                <option value="Not Received">{t('reason_not_received')}</option>
                                <option value="Damaged">{t('reason_damaged')}</option>
                                <option value="Wrong Item">{t('reason_wrong_item')}</option>
                                <option value="Quality Issue">{t('reason_quality')}</option>
                                <option value="Other">{t('reason_other')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">{t('dispute_desc_label')}</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full p-2 border rounded"
                                placeholder={t('dispute_desc_placeholder')}
                                required
                            />
                        </div>

                        <div className={`flex justify-end gap-2 pt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('cancel')}</Button>
                            <Button type="submit" className="bg-red-600 text-white hover:bg-red-700" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : t('submit_report')}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
