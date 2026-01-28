'use client';

import { useState, useEffect, useRef, useOptimistic } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { sendMessage, getConversationMessages } from '@/app/actions/messaging';
import { Send, User, Paperclip, File, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ChatInterface({ conversationId, initialMessages, currentUserId, otherUserName }) {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState(initialMessages || []);
    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef(null);

    // Scroll to bottom on load and update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const updatedConversation = await getConversationMessages(conversationId);
                if (updatedConversation && updatedConversation.messages) {
                    setMessages(prev => {
                        const serverMsgs = updatedConversation.messages;
                        const serverMsgIds = new Set(serverMsgs.map(m => m.id));

                        // Keep local messages that are NOT in the server list yet
                        // This includes temp- messages AND real messages that haven't synced/indexed yet
                        // We filter `prev` to find any message whose ID is NOT in the new server list
                        const localOnlyMsgs = prev.filter(m => !serverMsgIds.has(m.id));

                        // Combine and sort by createdAt
                        // Note: serverMsgs are usually sorted, but safe to resort combined list
                        const merged = [...serverMsgs, ...localOnlyMsgs].sort((a, b) =>
                            new Date(a.createdAt) - new Date(b.createdAt)
                        );

                        return merged;
                    });
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [conversationId]);


    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedFile) || isSending) return;

        const content = input;
        const file = selectedFile;

        setInput('');
        setSelectedFile(null);
        setIsSending(true);

        // Optimistic update
        const tempId = 'temp-' + Date.now();
        const optimisticMsg = {
            id: tempId,
            content: content,
            senderId: currentUserId,
            createdAt: new Date(),
            sender: { id: currentUserId },
            attachmentUrl: file ? URL.createObjectURL(file) : null,
            attachmentType: file ? (file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT') : null,
            status: 'sending' // New status field
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (file) {
                formData.append('file', file);
            }

            const result = await sendMessage(conversationId, formData);

            if (result.success && result.message) {
                // Swap optimistic with real
                setMessages(prev => prev.map(m => m.id === tempId ? result.message : m));
            } else {
                console.error("Failed to send:", result.error);
                // Mark as failed instead of removing
                setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed', error: result.error } : m));
            }
        } catch (error) {
            console.error("Failed to send:", error);
            // Mark as failed
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed', error: error.message } : m));
        } finally {
            setIsSending(false);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-100">
            {/* Header (embedded in page usually, but we can verify names here) */}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        {t('no_messages')}
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl shadow-sm text-sm overflow-hidden relative ${msg.status === 'failed' ? 'bg-red-50 text-red-800 border-red-200 border' :
                                            isMe
                                                ? 'bg-primary-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        } ${msg.status === 'sending' ? 'opacity-70' : ''}`}
                                >
                                    {msg.attachmentUrl && (
                                        <div className="mb-2">
                                            {msg.attachmentType === 'IMAGE' ? (
                                                <img
                                                    src={msg.attachmentUrl}
                                                    alt="attachment"
                                                    className="max-w-full rounded-lg max-h-60 object-cover"
                                                />
                                            ) : (
                                                <a
                                                    href={msg.attachmentUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-primary-700/50' : 'bg-gray-100'} hover:opacity-80 transition`}
                                                >
                                                    <File size={20} />
                                                    <span className="underline">View Document</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {msg.content && <p>{msg.content}</p>}
                                </div>

                                {msg.status === 'failed' && (
                                    <span className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                                        <X size={10} /> Failed: {msg.error || 'Error'}
                                    </span>
                                )}

                                {msg.status !== 'failed' && (
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {msg.status === 'sending' ? 'Sending...' : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-200">
                {selectedFile && (
                    <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 w-fit">
                        {selectedFile.type.startsWith('image/') ? <ImageIcon size={16} /> : <File size={16} />}
                        <span className="text-xs text-gray-600 max-w-[200px] truncate">{selectedFile.name}</span>
                        <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500">
                            <X size={14} />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} className="flex gap-2 items-center">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        className="rounded-full w-10 h-10 p-0 text-gray-500 hover:text-primary-600 hover:bg-primary-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip size={20} />
                    </Button>

                    <div className="relative flex-1">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('type_message')}
                            className={`w-full bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${language === 'ar' ? 'pr-5 pl-5' : 'pl-5 pr-5'}`}
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                            disabled={isSending}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={(!input.trim() && !selectedFile) || isSending}
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20"
                    >
                        <Send size={20} className={language === 'ar' ? 'transform rotate-180' : ''} />
                    </Button>
                </form>
            </div>
        </div>
    );
}
