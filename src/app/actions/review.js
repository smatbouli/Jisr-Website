'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(orderId, { rating, comment }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5' };
        }

        // Get the order to verify ownership and status
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { buyer: true, factory: true, review: true }
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Verify status
        if (order.status !== 'DELIVERED') {
            return { success: false, error: 'Order must be delivered before reviewing' };
        }

        // Verify no existing review
        if (order.review) {
            return { success: false, error: 'Review already exists for this order' };
        }

        // Create Review
        await prisma.review.create({
            data: {
                orderId: order.id,
                buyerId: order.buyerId,
                factoryId: order.factoryId,
                rating: parseInt(rating),
                comment: comment || ''
            }
        });

        revalidatePath(`/buyer/orders/${orderId}`);
        revalidatePath(`/factories/${order.factoryId}`);

        return { success: true };

    } catch (error) {
        console.error('Submit review error:', error);
        return { success: false, error: 'Failed to submit review' };
    }
}
