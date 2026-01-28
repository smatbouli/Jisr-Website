'use client';

import { useLanguage } from '@/components/LanguageContext';
import { Card } from '@/components/ui/Card';
import { MessageSquare, User, ArrowRight, Search, Clock, FileText, Image as ImageIcon } from 'lucide-react';

export default function MessagesPageClient({ conversations }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <div className={`h-[calc(100vh-120px)] flex flex-col ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="mb-6 shrink-0">
                <h1 className="text-3xl font-heading font-bold text-gray-900">{t('live_chat_monitor')}</h1>
                <p className="text-gray-600">{t('live_chat_desc')}</p>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Pane: Conversation List */}
                <Card className={`w-1/3 flex flex-col overflow-hidden p-0 border-r border-gray-200`}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="relative">
                            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={16} />
                            <input
                                type="text"
                                placeholder={t('search_users_placeholder')}
                                className={`w-full py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isArabic ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">{t('no_conversations')}</div>
                        ) : (
                            conversations.map(convo => (
                                <div key={convo.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900 text-sm truncate max-w-[120px]">
                                            {convo.starter.fullName || convo.starter.email.split('@')[0]}
                                        </span>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {new Date(convo.lastMessageAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2 truncate">
                                        {convo.subject}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${convo.starter.role === 'BUYER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {t(`role_${convo.starter.role.toLowerCase()}`) || convo.starter.role}
                                        </span>
                                        <span className={`text-gray-300 ${isArabic ? 'rotate-180' : ''}`}>→</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${convo.receiver.role === 'BUYER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {t(`role_${convo.receiver.role.toLowerCase()}`) || convo.receiver.role}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Right Pane: Chat History (Vertical Feed) */}
                <div className={`flex-1 overflow-y-auto space-y-8 ${isArabic ? 'pl-2' : 'pr-2'}`}>
                    {conversations.map(convo => (
                        <Card key={convo.id} className="p-0 overflow-hidden flex flex-col shadow-sm border border-gray-200">
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                        {convo.subject}
                                        <span className="text-xs font-normal text-gray-500">ID: {convo.id.slice(-6)}</span>
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs mt-1">
                                        <span className="text-blue-700 font-medium">{convo.starter.email}</span>
                                        <span className="text-gray-400">{t('messaging')}</span>
                                        <span className="text-green-700 font-medium">{convo.receiver.email}</span>
                                    </div>
                                </div>
                                <div className={`text-xs text-gray-400 ${isArabic ? 'text-left' : 'text-right'}`}>
                                    {t('last_active')}: {new Date(convo.lastMessageAt).toLocaleString()}
                                </div>
                            </div>

                            <div className="p-6 bg-white space-y-4 max-h-[300px] overflow-y-auto">
                                {convo.messages.map(msg => {
                                    const isStarter = msg.sender.email === convo.starter.email;
                                    // In LTR: starter is Left (start), receiver is Right (end)
                                    // In RTL: starter is Right (start), receiver is Left (end) if we keep justify-start logic?
                                    // Actually, standard chat: Me (Right), Them (Left). 
                                    // Here "Starter" isn't necessarily "Me". It provides a "Third Person" view.
                                    // Let's keep starter as 'Start' (Left in LTR, Right in RTL) and Receiver as 'End'.

                                    return (
                                        <div key={msg.id} className={`flex ${isStarter ? 'justify-start' : 'justify-end'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isStarter
                                                ? `bg-blue-50 text-blue-900 ${isArabic ? 'rounded-tr-none' : 'rounded-tl-none'}`
                                                : `bg-green-50 text-green-900 ${isArabic ? 'rounded-tl-none' : 'rounded-tr-none'}`
                                                }`}>
                                                <div className="text-[10px] opacity-50 mb-1 text-left" dir="ltr">{msg.sender.email.split('@')[0]}</div>

                                                {msg.content && <p>{msg.content}</p>}

                                                {msg.attachmentUrl && msg.attachmentType === 'IMAGE' && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={msg.attachmentUrl}
                                                            alt="Attachment"
                                                            className="rounded-lg max-w-full h-auto border border-black/10"
                                                            style={{ maxHeight: '200px' }}
                                                        />
                                                    </div>
                                                )}

                                                {msg.attachmentUrl && msg.attachmentType === 'DOCUMENT' && (
                                                    <div className="mt-2">
                                                        <a
                                                            href={msg.attachmentUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors border border-black/5"
                                                        >
                                                            <FileText size={18} />
                                                            <span className="underline truncate max-w-[150px]">{t('view_document')}</span>
                                                        </a>
                                                    </div>
                                                )}

                                                <div className={`text-[10px] opacity-40 mt-1 ${isArabic ? 'text-left' : 'text-right'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
