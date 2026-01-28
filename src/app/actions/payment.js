'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function processPayment(orderId, cardDetails) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Simulate Network Delay (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Basic Validation (Mock)
        if (cardDetails.number.endsWith('0000')) {
            return { success: false, error: 'Card declined by bank' };
        }

        // Generate Mock Transaction ID
        const paymentId = 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Update Order
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'PROCESSING',
                paymentStatus: 'PAID',
                paymentMethod: 'CREDIT_CARD',
                paymentId: paymentId
            },
            include: { factory: true }
        });

        // Notify Factory
        if (order.factory) {
            const { createNotification } = await import('@/app/actions/notification');
            await createNotification(
                order.factory.userId,
                'ORDER_PAID',
                'Payment Received',
                `Order #${orderId.slice(-6)} has been paid via Card. Please start production.`,
                '/factory/orders'
            );
        }

        revalidatePath(`/buyer/orders/${orderId}`);
        return { success: true };

    } catch (error) {
        console.error('Payment error:', error);
        return { success: false, error: 'Payment processing failed' };
    }
}
