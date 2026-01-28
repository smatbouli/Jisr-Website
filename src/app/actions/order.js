'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function awardQuote(quoteId) {
    const session = await auth();

    if (!session || session.user.role !== 'BUYER') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        // 1. Fetch the quote to get details
        const quote = await prisma.rfqResponse.findUnique({
            where: { id: quoteId },
            include: { rfq: true }
        });

        if (!quote) {
            return { success: false, error: 'Quote not found' };
        }

        // 2. Transact: Create Order, Update Quote, Update RFQ
        const order = await prisma.$transaction(async (tx) => {
            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    buyerId: quote.rfq.buyerId,
                    factoryId: quote.factoryId,
                    rfqId: quote.rfqId,
                    quoteId: quote.id,
                    totalPrice: quote.price * quote.rfq.quantity, // Simple calculation: price * quantity
                    status: 'PENDING'
                }
            });

            // Update Quote Status
            await tx.rfqResponse.update({
                where: { id: quoteId },
                data: { status: 'AWARDED' }
            });

            // Update RFQ Status
            await tx.rfq.update({
                where: { id: quote.rfqId },
                data: { status: 'AWARDED' }
            });

            return newOrder;
        });

        // Notify Factory
        const factory = await prisma.factoryProfile.findUnique({
            where: { id: quote.factoryId }
        });
        if (factory) {
            const { createNotification } = await import('@/app/actions/notification');
            await createNotification(
                factory.userId,
                'ORDER_RECEIVED',
                'New Order Received',
                'You have received a new order from a buyer!',
                '/factory/orders'
            );

            // External Email Notification
            const factoryUser = await prisma.user.findUnique({
                where: { id: factory.userId },
                select: { email: true }
            });

            if (factoryUser?.email) {
                const { sendEmail } = await import('@/lib/notifications-external');
                await sendEmail({
                    to: factoryUser.email,
                    subject: 'New Order Received on Jisr!',
                    text: `Hello ${factory.businessName},\n\nYou have received a new order #${newOrder.id.slice(-6)}.\n\nLog in to your dashboard to view details.`
                });
            }
        }

        revalidatePath('/buyer/rfq');
        revalidatePath(`/buyer/rfq/${quote.rfqId}`);
        return { success: true, orderId: order.id };

    } catch (error) {
        console.error('Error awarding quote:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function getFactoryOrders() {
    const session = await auth();

    if (!session || session.user.role !== 'FACTORY') {
        return [];
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { factoryProfile: true }
    });

    if (!user?.factoryProfile) return [];

    const orders = await prisma.order.findMany({
        where: { factoryId: user.factoryProfile.id },
        include: {
            buyer: true,
            rfq: true,
            quote: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return orders;
}

export async function getBuyerOrders() {
    const session = await auth();

    if (!session || session.user.role !== 'BUYER') {
        return [];
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { buyerProfile: true }
    });

    if (!user?.buyerProfile) return [];

    const orders = await prisma.order.findMany({
        where: { buyerId: user.buyerProfile.id },
        include: {
            factory: true,
            rfq: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return orders;
}

export async function getOrderById(orderId) {
    const session = await auth();

    if (!session) return null;

    // Fetch order and ensure user is either Buyer or Factory involved
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            factory: true,
            buyer: true,
            rfq: true,
            quote: true,
            review: true
        }
    });

    if (!order) return null;

    // Authorization Check
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { buyerProfile: true, factoryProfile: true }
    });

    const isBuyer = user?.buyerProfile?.id === order.buyerId;
    const isFactory = user?.factoryProfile?.id === order.factoryId;

    if (!isBuyer && !isFactory) return null;

    return order;
}

export async function updateOrderStatus(orderId, newStatus) {
    const session = await auth();

    if (!session || session.user.role !== 'FACTORY') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
            include: { buyer: true }
        });

        if (order.buyer) {
            const { createNotification } = await import('@/app/actions/notification');
            await createNotification(
                order.buyer.userId,
                'ORDER_UPDATED',
                'Order Status Updated',
                `Your order #${order.id.slice(-6)} is now ${newStatus}`,
                '/buyer/orders'
            );

            // External SMS Notification (Mocking phone number lookup)
            // In real app, we would fetch buyer.phoneNumber or user.phoneNumber
            const { sendSMS } = await import('@/lib/notifications-external');
            await sendSMS({
                to: '+9665XXXXXXXX', // Mock phone
                text: `Jisr: Your order #${order.id.slice(-6)} status has been updated to ${newStatus}.`
            });
        }

        revalidatePath('/factory/orders');
        return { success: true };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function createDispute(orderId, { reason, description }) {
    const session = await auth();
    if (!session || session.user.role !== 'BUYER') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Dispute Record
            await tx.dispute.create({
                data: {
                    orderId,
                    reporterId: session.user.id,
                    reason,
                    description,
                    status: 'OPEN'
                }
            });

            // 2. Update Order Status to DISPUTED to block flow
            const order = await tx.order.update({
                where: { id: orderId },
                data: { status: 'DISPUTED' },
                include: { factory: true } // Need factory info for notification
            });

            // 3. Notify Admin & Factory
            // We can't import inside transaction easily if using edge runtime, but for now this is fine or move out.
            // Moving notification trigger outside ensures transaction speed.
            return order;
        });

        // 4. Notifications (outside transaction)
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { factory: true }
        });

        if (order?.factory) {
            const { createNotification } = await import('@/app/actions/notification');
            // Notify Factory
            await createNotification(
                order.factory.userId,
                'DISPUTE_OPENED',
                'Order Disputed',
                `Buyer has reported a problem with order #${order.id.slice(-6)}.`,
                '/factory/orders'
            );
        }

        revalidatePath('/buyer/orders');
        revalidatePath(`/buyer/orders/${orderId}`);
        return { success: true };
    } catch (error) {
        console.error('Error creating dispute:', error);
        return { success: false, error: 'Failed to submit report' };
    }
}
