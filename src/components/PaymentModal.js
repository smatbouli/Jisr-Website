'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { CreditCard, Loader2, Lock, Calendar, createLucideIcon } from 'lucide-react';
import { processPayment } from '@/app/actions/payment';
import { useLanguage } from '@/components/LanguageContext';

export default function PaymentModal({ orderId, amount }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form Stats
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleCardChange = (e) => {
        setCardNumber(formatCardNumber(e.target.value));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await processPayment(orderId, {
            number: cardNumber.replace(/\s/g, ''),
            expiry,
            cvc
        });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                // Optionally refresh page or let revalidatePath handle it
            }, 2000);
        } else {
            setError(result.error);
        }
        setLoading(false);
    }

    if (success) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white w-full">
                        <CreditCard className="mr-2" size={18} /> {t('pay_now') || 'Pay Now'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('payment_successful') || 'Payment Successful!'}</h3>
                    <p className="text-gray-500">{t('order_processing_now') || 'Your order is now processing.'}</p>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary-600 hover:bg-primary-700 text-white w-full shadow-lg shadow-primary-900/20">
                    <CreditCard className={`mr-2 ${isArabic ? 'ml-2 mr-0' : ''}`} size={18} /> {t('pay_now') || 'Pay Now'}
                </Button>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-md ${isArabic ? 'text-right' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        {t('secure_payment') || 'Secure Payment'}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    {/* Amount Badge */}
                    <div className="bg-surface-50 border border-gray-100 rounded-lg p-4 mb-6 flex justify-between items-center">
                        <span className="text-gray-500 font-medium">{t('total_to_pay') || 'Total to Pay'}</span>
                        <span className="text-xl font-bold text-gray-900">{amount.toLocaleString()} SAR</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded">{error}</p>}

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">{t('cardholder_name') || 'Cardholder Name'}</label>
                            <input
                                required
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">{t('card_number') || 'Card Number'}</label>
                            <div className="relative">
                                <CreditCard className={`absolute top-2.5 text-gray-400 ${isArabic ? 'left-3' : 'right-3'}`} size={18} />
                                <input
                                    required
                                    value={cardNumber}
                                    onChange={handleCardChange}
                                    maxLength={19}
                                    className={`w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${isArabic ? 'pl-10' : 'pr-10'}`}
                                    placeholder="0000 0000 0000 0000"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">{t('expiry_date') || 'Expiry'}</label>
                                <input
                                    required
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    maxLength={5}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    placeholder="MM/YY"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">CVC</label>
                                <div className="relative">
                                    <Lock className={`absolute top-2.5 text-gray-400 ${isArabic ? 'left-3' : 'right-3'}`} size={16} />
                                    <input
                                        required
                                        type="password"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        maxLength={4}
                                        className={`w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none ${isArabic ? 'pl-10' : 'pr-10'}`}
                                        placeholder="123"
                                        dir="ltr"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full bg-primary-600 text-white hover:bg-primary-700 h-11" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={18} /> {t('processing') || 'Processing...'}
                                    </span>
                                ) : (
                                    `${t('pay') || 'Pay'} ${amount.toLocaleString()} SAR`
                                )}
                            </Button>
                            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                                <Lock size={12} /> {t('encrypted_payment') || '256-bit Encrypted Payment'}
                            </p>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
