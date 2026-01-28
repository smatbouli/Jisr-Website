'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/actions/notification';

// 1. Get All Disputes (for Admin Dashboard)
export async function getDisputes() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') return [];

    try {
        const disputes = await prisma.dispute.findMany({
            include: {
                order: {
                    select: {
                        id: true,
                        totalPrice: true,
                        status: true,
                        factory: { select: { businessName: true } },
                        buyer: { select: { businessName: true, userId: true } }
                    }
                },
                reporter: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return disputes;
    } catch (error) {
        console.error("Error fetching disputes:", error);
        return [];
    }
}

// 2. Resolve Dispute (Favor Buyer -> Cancel Order / Refund)
export async function resolveDispute(disputeId, adminNotes) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') return { success: false, error: 'Unauthorized' };

    try {
        await prisma.$transaction(async (tx) => {
            // Update Dispute
            const dispute = await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: 'RESOLVED',
                    adminNotes
                },
                include: { order: true }
            });

            // Update Order -> CANCELLED (Simulating Refund)
            await tx.order.update({
                where: { id: dispute.orderId },
                data: { status: 'CANCELLED' }
            });

            // Notify User
            // Note: In real app, trigger refund logic here.
        });

        // Notifications (Outside Transaction)
        // Need to refetch to get relations if not included above or pass data
        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { order: { include: { buyer: true, factory: true } } }
        });

        await createNotification(
            dispute.order.buyer.userId,
            'DISPUTE_RESOLVED',
            'Dispute Resolved',
            'Your dispute has been resolved in your favor. The order has been cancelled.',
            `/buyer/orders/${dispute.orderId}`
        );

        await createNotification(
            dispute.order.factory.userId,
            'DISPUTE_ESCALATED', // Or Cancelled
            'Order Cancelled by Admin',
            `Order #${dispute.order.id.slice(-6)} has been cancelled due to a dispute resolution.`,
            `/factory/orders`
        );

        revalidatePath('/admin/disputes');
        return { success: true };
    } catch (error) {
        console.error("Error resolving dispute:", error);
        return { success: false, error: 'Resolution failed' };
    }
}

// 3. Reject Dispute (Favor Factory -> Resume Order)
export async function rejectDispute(disputeId, adminNotes) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') return { success: false, error: 'Unauthorized' };

    try {
        await prisma.$transaction(async (tx) => {
            // Update Dispute
            const dispute = await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: 'REJECTED', // Or CLOSED
                    adminNotes
                }
            });

            // Update Order -> Resume (Simplistic: Go to PROCESSING or leave as is? Context says "Resume")
            // Ideally we revert to previous status, but we didn't store it. 
            // Lets set to PROCESSING to be safe, or SHIPPED if it was shipped.
            // For MVP: Set to PROCESSING.
            await tx.order.update({
                where: { id: dispute.orderId },
                data: { status: 'PROCESSING' }
            });
        });

        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { order: { include: { buyer: true } } }
        });

        await createNotification(
            dispute.order.buyer.userId,
            'DISPUTE_REJECTED',
            'Dispute Update',
            'Your dispute claim was reviewed and rejected. The order will proceed.',
            `/buyer/orders/${dispute.orderId}`
        );

        revalidatePath('/admin/disputes');
        return { success: true };
    } catch (error) {
        console.error("Error rejecting dispute:", error);
        return { success: false, error: 'Rejection failed' };
    }
}
