'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Star, Loader2 } from 'lucide-react';
import { submitReview } from '@/app/actions/review';
import { useLanguage } from '@/components/LanguageContext';

export default function ReviewModal({ orderId, factoryName }) {
    const { t, language } = useLanguage();
    // Default to 'en' content if keys missing, but we'll add them soon
    const isArabic = language === 'ar';

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [error, setError] = useState(null);

    async function handleSubmit(formData) {
        if (rating === 0) {
            setError(t('error_select_rating') || 'Please select a rating');
            return;
        }

        setLoading(true);
        setError(null);

        const comment = formData.get('comment');
        const result = await submitReview(orderId, { rating, comment });

        if (result.success) {
            setOpen(false);
        } else {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Star size={16} className={`mr-2 ${isArabic ? 'ml-2 mr-0' : ''}`} fill="currentColor" /> {t('rate_experience') || 'Rate Experience'}
                </Button>
            </DialogTrigger>
            <DialogContent className={isArabic ? 'text-right' : ''} dir={isArabic ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {t('rate_factory') || 'Rate Factory'}: {factoryName}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    <form action={handleSubmit} className="space-y-6">
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <div className="flex flex-col items-center gap-2 mb-4">
                            <span className="text-sm font-semibold text-gray-700">{t('how_was_experience') || 'How was your experience?'}</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            size={32}
                                            className={`${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 h-5">
                                {hoverRating === 1 && (t('rating_poor') || 'Poor')}
                                {hoverRating === 2 && (t('rating_fair') || 'Fair')}
                                {hoverRating === 3 && (t('rating_good') || 'Good')}
                                {hoverRating === 4 && (t('rating_very_good') || 'Very Good')}
                                {hoverRating === 5 && (t('rating_excellent') || 'Excellent')}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">{t('write_review') || 'Write a review (optional)'}</label>
                            <textarea
                                name="comment"
                                rows={4}
                                className="w-full p-2 border rounded resize-none"
                                placeholder={t('review_placeholder') || 'Share your feedback...'}
                            />
                        </div>

                        <div className={`flex justify-end gap-2 pt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t('cancel') || 'Cancel'}</Button>
                            <Button type="submit" className="bg-primary-600 text-white hover:bg-primary-700" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : (t('submit_review') || 'Submit Review')}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
