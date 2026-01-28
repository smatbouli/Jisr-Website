'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { resolveDispute, rejectDispute } from '@/app/actions/dispute';
import { useLanguage } from '@/components/LanguageContext';

export default function DisputeList({ disputes }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [actionLoading, setActionLoading] = useState(null);

    async function handleResolve(id) {
        if (!confirm(t('confirm_resolve'))) return;
        setActionLoading(id);
        await resolveDispute(id, "Resolved by Admin via Dashboard");
        setActionLoading(null);
    }

    async function handleReject(id) {
        if (!confirm(t('confirm_reject'))) return;
        setActionLoading(id);
        await rejectDispute(id, "Rejected by Admin via Dashboard");
        setActionLoading(null);
    }

    return (
        <div className="space-y-6">
            <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                    <input
                        type="text"
                        placeholder={t('search_disputes')}
                        className={`py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500 ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter size={16} className={isArabic ? 'ml-2' : 'mr-2'} /> {t('filter') || 'Filter'}
                    </Button>
                </div>
            </Card>

            <div className="grid gap-4">
                {disputes.map(dispute => (
                    <Card key={dispute.id} className="p-6">
                        <div className={`flex flex-col md:flex-row justify-between gap-6 ${isArabic ? 'text-right md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 space-y-4">
                                <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${dispute.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                                            dispute.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {t(`status_${dispute.status.toLowerCase()}`) || dispute.status}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {t('dispute_id')}: {dispute.id.slice(-6)} • {t('order_number')} #{dispute.order.id.slice(-6)}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{t(`reason_${dispute.reason.toLowerCase().replace(/ /g, '_')}`) || dispute.reason}</h3>
                                    <p className="text-gray-600 mt-1">{dispute.description}</p>
                                </div>

                                <div className={`flex gap-4 text-sm text-gray-500 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <span>{t('from') || 'From'}: <strong>{isArabic && dispute.order.buyer.businessNameAr ? dispute.order.buyer.businessNameAr : dispute.order.buyer.businessName}</strong></span>
                                    <span>{t('against')}: <strong>{isArabic && dispute.order.factory.businessNameAr ? dispute.order.factory.businessNameAr : dispute.order.factory.businessName}</strong></span>
                                    <span>{t('amount')}: <strong>{dispute.order.totalPrice.toLocaleString()} SAR</strong></span>
                                </div>
                            </div>

                            {dispute.status === 'OPEN' && (
                                <div className="flex flex-col justify-center gap-2 min-w-[150px]">
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                                        onClick={() => handleResolve(dispute.id)}
                                        disabled={actionLoading === dispute.id}
                                    >
                                        <CheckCircle size={16} className={isArabic ? 'ml-2' : 'mr-2'} /> {t('resolve_refund')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="text-red-600 border-red-200 hover:bg-red-50 w-full"
                                        onClick={() => handleReject(dispute.id)}
                                        disabled={actionLoading === dispute.id}
                                    >
                                        <XCircle size={16} className={isArabic ? 'ml-2' : 'mr-2'} /> {t('reject_claim')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}

                {disputes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <CheckCircle size={48} className="mx-auto text-green-500 mb-4 opacity-20" />
                        <p>{t('no_disputes') || "No disputes found. Everything is running smoothly."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
