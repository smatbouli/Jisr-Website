'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createRfq(formData) {
    const session = await auth();
    if (!session || session.user.role !== 'BUYER') {
        return { error: 'Unauthorized' };
    }

    const title = formData.get('title');
    const description = formData.get('description');
    const quantity = parseInt(formData.get('quantity') || '1');

    if (!title || !description || !quantity) {
        return { error: 'Please fill in all required fields' };
    }

    const buyer = await prisma.buyerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!buyer) {
        return { error: 'Buyer profile not found' };
    }

    try {
        await prisma.rfq.create({
            data: {
                title,
                description,
                quantity,
                buyerId: buyer.id,
                status: 'OPEN'
            }
        });
    } catch (e) {
        console.error('Create RFQ Error:', e);
        return { error: 'Failed to create RFQ' };
    }

    revalidatePath('/buyer/rfq');
    redirect('/buyer/rfq'); // Redirect to list page
}

export async function getBuyerRfqs() {
    const session = await auth();
    if (!session || session.user.role !== 'BUYER') return [];

    const buyer = await prisma.buyerProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!buyer) return [];

    return await prisma.rfq.findMany({
        where: { buyerId: buyer.id },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { responses: true }
            }
        }
    });
}

export async function getOpenRfqs() {
    const session = await auth();
    // Allow Buyers to see market too? No, mostly for factories. But maybe admin.
    if (!session) return [];

    return await prisma.rfq.findMany({
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        include: {
            buyer: {
                select: {
                    businessName: true,
                    city: true
                }
            },
            _count: {
                select: { responses: true }
            }
        }
    });
}

export async function getRfqById(id) {
    const session = await auth();
    if (!session) return null;

    return await prisma.rfq.findUnique({
        where: { id },
        include: {
            buyer: {
                select: {
                    businessName: true,
                    city: true
                }
            },
            responses: {
                include: {
                    factory: {
                        select: {
                            businessName: true
                        }
                    }
                }
            }
        }
    });
}

export async function submitQuote(formData) {
    const session = await auth();
    if (!session || session.user.role !== 'FACTORY') {
        return { error: 'Unauthorized' };
    }

    const rfqId = formData.get('rfqId');
    const price = parseFloat(formData.get('price'));
    const notes = formData.get('notes');

    if (!rfqId || !price) {
        return { error: 'Price is required' };
    }

    const factory = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!factory) return { error: 'Factory profile not found' };

    try {
        await prisma.rfqResponse.create({
            data: {
                price,
                notes,
                rfqId,
                factoryId: factory.id,
                status: 'PENDING'
            }
        });

        // Verify RFQ exists and get Buyer ID for notification
        const rfq = await prisma.rfq.findUnique({
            where: { id: rfqId },
            include: { buyer: true }
        });

        if (rfq && rfq.buyer) {
            const { createNotification } = await import('@/app/actions/notification');
            await createNotification(
                rfq.buyer.userId,
                'QUOTE_RECEIVED',
                'New Quote Received',
                `You have a new quote for ${rfq.title}`,
                `/buyer/rfq/${rfqId}`
            );
        }
    } catch (e) {
        console.error('Submit Quote Error:', e);
        return { error: 'Failed to submit quote' };
    }

    revalidatePath(`/factory/rfq/${rfqId}`);
    redirect('/factory/rfq');
}
