'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, X } from 'lucide-react';
import { startConversation } from '@/app/actions/messaging';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';

export default function ContactFactoryButton({ factoryId, businessName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { t, language } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const subject = `Inquiry about ${businessName}`; // Default subject
        const result = await startConversation(factoryId, subject, message);

        if (result.success) {
            setIsOpen(false);
            router.push(`/messages/${result.conversationId}`);
        } else {
            setError(result.error || 'Failed to start conversation');
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="w-full shadow-primary-900/20 bg-primary-600 hover:bg-primary-700 text-white"
            >
                <Mail className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} size={18} />
                {t('contact_factory') || 'Contact Factory'}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900">
                                {t('contact') || 'Contact'} {businessName}
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('message') || 'Message'}
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none min-h-[120px] resize-none"
                                    placeholder={t('type_message_placeholder') || "Hi, I'm interested in your products..."}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    {t('cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!message.trim() || isSubmitting}
                                    className="bg-primary-600 hover:bg-primary-700"
                                >
                                    {isSubmitting ? (t('sending') || 'Sending...') : (t('send_message') || 'Send Message')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
