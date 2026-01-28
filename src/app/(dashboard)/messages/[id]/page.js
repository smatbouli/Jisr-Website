import { getConversationMessages, sendMessage } from '@/app/actions/messaging';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ChatInterface from '@/components/ChatInterface';

export default async function ConversationPage({ params }) {
    const { id } = await params;
    const session = await auth();
    const conversation = await getConversationMessages(id);

    if (!conversation) {
        redirect('/messages');
    }

    const otherUser = conversation.starterId === session.user.id ? conversation.receiver : conversation.starter;
    const profile = otherUser.factoryProfile || otherUser.buyerProfile;
    const name = profile?.businessName || otherUser.email;

    return (
        <div className="flex h-[calc(100vh-140px)] bg-slate-50 rounded-lg shadow-sm border overflow-hidden">
            {/* Sidebar Mini (Hidden on small screens) */}
            <div className="w-1/3 border-r bg-white hidden md:flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-gray-700">Messages</h2>
                    <Link href="/messages" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center items-center text-center text-gray-400">
                    <p className="mb-2">Select a conversation from the list to view history.</p>
                    <Link href="/messages" className="text-primary-600 hover:underline text-sm">
                        Back to Inbox
                    </Link>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-100 relative">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b flex items-center justify-between shadow-sm z-10">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">{name}</h3>
                        {conversation.subject && (
                            <span className="text-xs text-gray-500 block mt-0.5">{conversation.subject}</span>
                        )}
                    </div>
                </div>

                {/* Interactive Chat Component */}
                <ChatInterface
                    conversationId={conversation.id}
                    initialMessages={conversation.messages}
                    currentUserId={session.user.id}
                    otherUserName={name}
                />
            </div>
        </div>
    );
}
