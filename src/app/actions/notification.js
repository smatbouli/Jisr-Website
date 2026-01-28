'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
    const session = await auth();
    if (!session) return [];

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    return notifications;
}

export async function getUnreadCount() {
    const session = await auth();
    if (!session) return 0;

    const count = await prisma.notification.count({
        where: {
            userId: session.user.id,
            read: false
        }
    });

    return count;
}

export async function markAsRead(notificationId) {
    const session = await auth();
    if (!session) return;

    await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true }
    });

    revalidatePath('/'); // Revalidate everywhere as header is everywhere
}

export async function createNotification(userId, type, title, message, link) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link
            }
        });
    } catch (error) {
        console.error('Failed to create notification', error);
    }
}
