'use client';

import { useLanguage } from '@/components/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Eye, ShieldAlert } from 'lucide-react';

export default function VerificationPageClient({ queue }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`space-y-8 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">{t('verification_center')}</h1>
                    <p className="text-gray-600 mt-1">{t('verification_desc')}</p>
                </div>
            </div>

            <Card className="overflow-hidden border-gray-100 p-0 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 border-b border-gray-100">
                            <tr>
                                <th className={`p-5 font-semibold text-xs text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>{t('business_details')}</th>
                                <th className={`p-5 font-semibold text-xs text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>{t('status')}</th>
                                <th className={`p-5 font-semibold text-xs text-gray-500 uppercase tracking-wider ${isArabic ? 'text-right' : 'text-left'}`}>{t('request_type')}</th>
                                <th className={`p-5 font-semibold text-xs text-gray-500 uppercase tracking-wider ${isArabic ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {queue.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <CheckCircle size={32} className="mb-3 text-green-500" />
                                            <p className="font-medium text-gray-900">{t('all_caught_up')}</p>
                                            <p className="text-sm">{t('no_pending_verifications')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                queue.map(factory => {
                                    const hasPendingChanges = !!factory.pendingChanges;

                                    return (
                                        <tr key={factory.id} className="group hover:bg-surface-50 transition-colors">
                                            <td className={`p-5 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <div className="font-bold text-gray-900">{factory.businessName}</div>
                                                <div className="text-sm text-gray-500">{factory.city || t('location_na')}</div>
                                            </td>
                                            <td className={`p-5 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${factory.verificationStatus === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    factory.verificationStatus === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {factory.verificationStatus === 'VERIFIED' ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                                                    {t(`status_${factory.verificationStatus.toLowerCase()}`) || factory.verificationStatus}
                                                </span>
                                            </td>
                                            <td className={`p-5 ${isArabic ? 'text-right' : 'text-left'}`}>
                                                {hasPendingChanges ? (
                                                    <span className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold w-fit border border-blue-100">
                                                        <AlertCircle size={14} /> {t('profile_update')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold w-fit border border-gray-200">
                                                        {t('new_registration')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`p-5 ${isArabic ? 'text-left' : 'text-right'}`}>
                                                <Link href={`/admin/verification/${factory.id}`}>
                                                    <Button size="sm" variant="outline" className="group-hover:bg-white group-hover:border-primary-200">
                                                        <Eye size={16} className={isArabic ? 'ml-2' : 'mr-2'} /> {t('review')}
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
