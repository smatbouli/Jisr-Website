import { getConversations } from '@/app/actions/messaging';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { auth } from '@/auth';

import { ArrowLeft } from 'lucide-react';

export default async function InboxPage() {
    const session = await auth();
    const conversations = await getConversations();

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Sidebar List */}
            <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
                <div className="p-4 border-b">
                    <BackButton href="/dashboard" labelKey="back_to_dashboard" />
                    <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                </div>
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No conversations yet.
                    </div>
                ) : (
                    <div>
                        {conversations.map(conv => {
                            const otherUser = conv.starterId === session?.user?.id ? conv.receiver : conv.starter;
                            const profile = otherUser.factoryProfile || otherUser.buyerProfile;
                            const name = profile?.businessName || otherUser.email;
                            const lastMsg = conv.messages[0];

                            return (
                                <Link
                                    key={conv.id}
                                    href={`/messages/${conv.id}`}
                                    className="block p-4 border-b hover:bg-white transition"
                                >
                                    <div className="font-semibold text-slate-800 mb-1">{name}</div>
                                    <div className="text-sm text-gray-600 truncate">{lastMsg?.content || 'No messages'}</div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Empty State for Main Area */}
            <div className="w-2/3 flex items-center justify-center bg-white text-gray-500">
                Select a conversation to start chatting
            </div>
        </div>
    );
}
