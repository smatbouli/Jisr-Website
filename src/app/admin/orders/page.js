import prisma from '@/lib/prisma';
import OrdersPageClient from '@/components/admin/OrdersPageClient';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            buyer: { select: { businessName: true } },
            factory: { select: { businessName: true } },
            rfq: { select: { title: true } }
        }
    });

    return <OrdersPageClient initialOrders={orders} />;
}
