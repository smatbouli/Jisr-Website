import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { awardQuote } from '@/app/actions/order';
import { startConversation } from '@/app/actions/messaging';
import { useLanguage } from '@/components/LanguageContext';

export default function RfqResponseActions({ response, rfqTitle }) {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);

    const handleMessage = async () => {
        setLoading(true);
        try {
            // Note: response.factoryId is the correct ID to use based on previous code
            // response.factory.id was likely undefined if factory relation wasn't fully included or structure differed
            const result = await startConversation(
                response.factoryId,
                `${t('rfq_question_subject')} ${rfqTitle}`,
                `${t('rfq_question_body')} ${response.price} SAR.`
            );

            if (result.success) {
                router.push(`/messages/${result.conversationId}`);
            } else {
                alert(`${t('message_start_failed')}: ` + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Message error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAward = async () => {
        if (!confirm(t('confirm_award'))) return;

        setLoading(true);
        try {
            const result = await awardQuote(response.id);
            if (result.success) {
                // Refresh to show updated status
                router.refresh();
                // alert(t('award_success')); // Optional explicit success message
            } else {
                alert(`${t('award_failed')}: ` + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Award error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end gap-3 items-center">
            <button
                onClick={handleMessage}
                disabled={loading}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium disabled:opacity-50 transition-colors"
            >
                {loading ? t('processing') : t('message_factory')}
            </button>
            <button
                onClick={handleAward}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {loading ? t('processing') : t('award_contract')}
            </button>
        </div>
    );
}
