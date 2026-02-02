import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FactoryDashboardClient from './FactoryDashboardClient';

export default async function FactoryDashboardPage() {
    const session = await auth();

    // Server-side Protection
    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'FACTORY' && session.user.role !== 'ADMIN') {
        if (session.user.role === 'BUYER') redirect('/buyer');
    }

    return <FactoryDashboardClient />;
}
