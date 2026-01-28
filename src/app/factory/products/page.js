import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import ProductsPageClient from '@/components/factory/ProductsPageClient';

export default async function ProductsPage() {
    const session = await auth();

    const factory = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    const products = factory ? await prisma.product.findMany({
        where: { factoryId: factory.id },
        orderBy: { name: 'asc' }
    }) : [];

    return <ProductsPageClient products={products} factory={factory} />;
}
