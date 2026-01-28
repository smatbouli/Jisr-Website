import prisma from '@/lib/prisma';
import UsersPageClient from '@/components/admin/UsersPageClient';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            factoryProfile: { select: { businessName: true } },
            buyerProfile: { select: { businessName: true } }
        }
    });

    return <UsersPageClient initialUsers={users} />;
}
