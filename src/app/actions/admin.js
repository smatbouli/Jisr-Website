'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

// Middleware or check role
async function checkAdmin() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
}

export async function getVerificationQueue() {
    await checkAdmin();
    // Fetch all factories to allow managing verification status
    return await prisma.factoryProfile.findMany({
        orderBy: { updatedAt: 'desc' }
    });
}

export async function approveFactory(factoryId) {
    await checkAdmin();

    await prisma.factoryProfile.update({
        where: { id: factoryId },
        data: {
            verificationStatus: 'VERIFIED',
            isVerified: true
        }
    });

    revalidatePath('/admin/verification');
}

export async function approveChanges(factoryId) {
    await checkAdmin();

    const factory = await prisma.factoryProfile.findUnique({ where: { id: factoryId } });
    if (!factory || !factory.pendingChanges) return;

    const changes = JSON.parse(factory.pendingChanges);
    // Remove timestamp before saving
    delete changes.timestamp;

    await prisma.factoryProfile.update({
        where: { id: factoryId },
        data: {
            ...changes,
            pendingChanges: null // Clear queue
        }
    });

    revalidatePath(`/admin/verification/${factoryId}`);
    revalidatePath('/admin/verification');
}

export async function rejectChanges(factoryId) {
    await checkAdmin();

    await prisma.factoryProfile.update({
        where: { id: factoryId },
        data: {
            pendingChanges: null
        }
    });

    revalidatePath('/admin/verification');
}

export async function revokeVerification(factoryId) {
    await checkAdmin();

    await prisma.factoryProfile.update({
        where: { id: factoryId },
        data: {
            verificationStatus: 'UNVERIFIED',
            isVerified: false
        }
    });

    revalidatePath('/admin/verification');
    revalidatePath(`/admin/verification/${factoryId}`);
}

export async function getPendingProducts() {
    await checkAdmin();
    return await prisma.product.findMany({
        where: { status: 'PENDING' },
        include: { factory: true },
        orderBy: { id: 'desc' }
    });
}

export async function approveProduct(productId) {
    await checkAdmin();
    await prisma.product.update({
        where: { id: productId },
        data: { status: 'APPROVED' }
    });
    revalidatePath('/admin/products');
}

export async function rejectProduct(productId) {
    await checkAdmin();
    await prisma.product.update({
        where: { id: productId },
        data: { status: 'REJECTED' }
    });
    revalidatePath('/admin/products');
}

export async function toggleUserBan(userId) {
    await checkAdmin();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await prisma.user.update({
        where: { id: userId },
        data: { isBanned: !user.isBanned }
    });
    revalidatePath('/admin/users');
}

export async function getAllConversations() {
    await checkAdmin();
    return await prisma.conversation.findMany({
        orderBy: { lastMessageAt: 'desc' },
        include: {
            starter: {
                select: {
                    email: true,
                    role: true,
                    factoryProfile: { select: { businessName: true } },
                    buyerProfile: { select: { businessName: true } }
                }
            },
            receiver: {
                select: {
                    email: true,
                    role: true,
                    factoryProfile: { select: { businessName: true } },
                    buyerProfile: { select: { businessName: true } }
                }
            },
            messages: {
                orderBy: { createdAt: 'asc' },
                include: {
                    sender: { select: { email: true, role: true } }
                }
            }
        }
    });
}

export async function getPlatformAnalytics() {
    await checkAdmin();

    const [
        totalUsers,
        totalFactories,
        totalBuyers,
        totalOrders,
        totalRfqs,
        totalProducts,
        pendingVerifications
    ] = await Promise.all([
        prisma.user.count(),
        prisma.factoryProfile.count({ where: { verificationStatus: 'VERIFIED' } }),
        prisma.buyerProfile.count(),
        prisma.order.count(),
        prisma.rfq.count(),
        prisma.product.count({ where: { status: 'APPROVED' } }),
        prisma.factoryProfile.count({ where: { verificationStatus: 'PENDING' } })
    ]);

    // Calculate GMV (Total Sales)
    const orders = await prisma.order.findMany({
        where: { status: { in: ['Processing', 'Shipped', 'Delivered', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        select: { totalPrice: true }
    });

    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    return {
        totalUsers,
        totalFactories,
        totalBuyers,
        totalOrders,
        totalRfqs,
        totalProducts,
        totalRevenue,
        pendingVerifications,

        // historical data for charts
        revenueByMonth: await getRevenueByMonth(),
        ordersByStatus: await getOrdersByStatus(),
        userGrowth: await getUserGrowth()
    };
}

async function getRevenueByMonth() {
    // Group orders by month/year (simplified for SQLite)
    // Note: Prisma grouping is limited with SQLite regarding Dates.
    // We will fetch all relevant orders and aggregate in JS for this MVP.
    const orders = await prisma.order.findMany({
        where: {
            status: { in: ['Processing', 'Shipped', 'Delivered', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
        },
        select: { totalPrice: true, createdAt: true }
    });

    const monthlyMap = {};
    orders.forEach(order => {
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
        monthlyMap[month] = (monthlyMap[month] || 0) + order.totalPrice;
    });

    return Object.entries(monthlyMap).map(([name, value]) => ({ name, value }));
}

async function getOrdersByStatus() {
    const orders = await prisma.order.findMany({ select: { status: true } });
    const statusMap = {};
    orders.forEach(order => {
        const status = order.status;
        statusMap[status] = (statusMap[status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([name, value]) => ({ name, value }));
}

async function getUserGrowth() {
    const users = await prisma.user.findMany({ select: { createdAt: true, role: true } });
    const growthMap = {};

    // Group by Month
    users.forEach(user => {
        const month = new Date(user.createdAt).toLocaleString('default', { month: 'short' });
        if (!growthMap[month]) growthMap[month] = { name: month, factories: 0, buyers: 0 };

        if (user.role === 'FACTORY') growthMap[month].factories++;
        if (user.role === 'BUYER') growthMap[month].buyers++;
    });

    return Object.values(growthMap);
}
