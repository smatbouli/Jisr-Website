import { getAllConversations } from '@/app/actions/admin';
import MessagesPageClient from '@/components/admin/MessagesPageClient';

export default async function AdminMessagesPage() {
    const conversations = await getAllConversations();

    return <MessagesPageClient conversations={conversations} />;
}
