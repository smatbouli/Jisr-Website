'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { uploadFile } from '@/lib/storage';

// Fetch all conversations for the current user
export async function getConversations() {
    const session = await auth();
    if (!session) return [];

    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [
                { starterId: session.user.id },
                { receiverId: session.user.id }
            ]
        },
        include: {
            starter: {
                include: {
                    factoryProfile: true,
                    buyerProfile: true
                }
            },
            receiver: {
                include: {
                    factoryProfile: true,
                    buyerProfile: true
                }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { lastMessageAt: 'desc' }
    });

    return conversations;
}

// Fetch messages for a specific conversation
export async function getConversationMessages(conversationId) {
    const session = await auth();
    if (!session) return null;

    // Verify participation
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            factoryProfile: { select: { businessName: true } },
                            buyerProfile: { select: { businessName: true } }
                        }
                    }
                }
            },
            starter: {
                include: { factoryProfile: true, buyerProfile: true }
            },
            receiver: {
                include: { factoryProfile: true, buyerProfile: true }
            }
        }
    });

    if (!conversation) return null;

    const isParticipant = conversation.starterId === session.user.id || conversation.receiverId === session.user.id;
    if (!isParticipant) return null;

    return conversation;
}

// Start a conversation with a Factory (from Buyer side usually)
export async function startConversation(factoryId, subject, initialMessage) {
    const session = await auth();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        // Get Factory's User ID
        const factoryProfile = await prisma.factoryProfile.findUnique({
            where: { id: factoryId },
            include: { user: true }
        });

        if (!factoryProfile) return { success: false, error: "Factory not found" };

        const receiverId = factoryProfile.userId;
        const starterId = session.user.id;

        // Check if conversation already exists
        // Note: This simple check assumes one conversation per pair, or we just create a new one?
        // Let's check for existing first to avoid duplicates for now.
        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { starterId: starterId, receiverId: receiverId },
                    { starterId: receiverId, receiverId: starterId }
                ]
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    starterId,
                    receiverId,
                    subject,
                    lastMessageAt: new Date()
                }
            });
        }

        // Send the message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: starterId,
                content: initialMessage,
                read: false
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { lastMessageAt: new Date() }
        });

        // Notify Receiver
        const { createNotification } = await import('@/app/actions/notification');
        await createNotification(
            receiverId,
            'NEW_MESSAGE',
            `New Message`,
            `You received a message: "${initialMessage.substring(0, 50)}${initialMessage.length > 50 ? '...' : ''}"`,
            `/messages/${conversation.id}`
        );

        revalidatePath('/messages');
        return { success: true, conversationId: conversation.id };

    } catch (error) {
        console.error("Error starting conversation:", error);
        return { success: false, error: "Failed to start conversation" };
    }
}

// Start a conversation with a Buyer (from Factory side)
export async function startConversationWithBuyer(buyerId, subject, initialMessage) {
    const session = await auth();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        // Get Buyer's User ID
        const buyerProfile = await prisma.buyerProfile.findUnique({
            where: { id: buyerId },
            include: { user: true }
        });

        if (!buyerProfile) return { success: false, error: "Buyer not found" };

        const receiverId = buyerProfile.userId;
        const starterId = session.user.id;

        // Check if conversation already exists
        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { starterId: starterId, receiverId: receiverId },
                    { starterId: receiverId, receiverId: starterId }
                ]
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    starterId,
                    receiverId,
                    subject,
                    lastMessageAt: new Date()
                }
            });
        }

        // Send the message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: starterId,
                content: initialMessage,
                read: false
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { lastMessageAt: new Date() }
        });

        // Notify Receiver
        const { createNotification } = await import('@/app/actions/notification');
        await createNotification(
            receiverId,
            'NEW_MESSAGE',
            `New Message`,
            `You received a message: "${initialMessage.substring(0, 50)}${initialMessage.length > 50 ? '...' : ''}"`,
            `/messages/${conversation.id}`
        );

        revalidatePath('/messages');
        return { success: true, conversationId: conversation.id };

    } catch (error) {
        console.error("Error starting conversation with buyer:", error);
        return { success: false, error: "Failed to start conversation" };
    }
}

// Send a reply in an existing conversation
// Send a reply in an existing conversation
export async function sendMessage(conversationId, content, attachment) {
    const session = await auth();
    if (!session) return { success: false, error: "Unauthorized" };

    // Handle formData argument if second arg is FormData
    let messageContent = content;
    let file = attachment;

    // If called directly from form action, args might differ, but we control the call site.
    // Let's assume the call signature: sendMessage(conversationId, formData)
    if (content instanceof FormData) {
        const formData = content;
        messageContent = formData.get('content');
        file = formData.get('file');
    }

    try {
        let attachmentUrl = null;
        let attachmentType = null;

        if (file && file.size > 0 && typeof file !== 'string') {
            // const buffer = Buffer.from(await file.arrayBuffer());
            // const filename = `msg-${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
            // const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'messages');

            // if (!fs.existsSync(uploadDir)) {
            //     fs.mkdirSync(uploadDir, { recursive: true });
            // }

            // const filePath = path.join(uploadDir, filename);
            // fs.writeFileSync(filePath, buffer);

            // attachmentUrl = `/uploads/messages/${filename}`;

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `msg-${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const path = `messages/${filename}`;

            attachmentUrl = await uploadFile(buffer, 'messages', path, file.type);

            // Determine type
            const ext = path.extname(filename).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                attachmentType = 'IMAGE';
            } else {
                attachmentType = 'DOCUMENT';
            }
        }

        const messageData = {
            conversationId,
            senderId: session.user.id,
            content: messageContent || '', // Content can be empty if there's an attachment
            read: false,
            attachmentUrl,
            attachmentType
        };

        if (!messageData.content && !messageData.attachmentUrl) {
            return { success: false, error: "Message content or file required" };
        }

        const newMessage = await prisma.message.create({
            data: messageData
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() }
        });

        revalidatePath(`/messages/${conversationId}`);

        // Notify Receiver
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId }
        });
        if (conversation) {
            const receiverId = conversation.starterId === session.user.id ? conversation.receiverId : conversation.starterId;
            const { createNotification } = await import('@/app/actions/notification');
            const preview = attachmentType ? (attachmentType === 'IMAGE' ? '[Image]' : '[File]') : messageContent.substring(0, 30);

            await createNotification(
                receiverId,
                'NEW_MESSAGE',
                `New Message`,
                `You received a new message: ${preview}`,
                `/messages/${conversationId}`
            );
        }

        return { success: true, message: newMessage };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: "Failed to send message: " + error.message };
    }
}
