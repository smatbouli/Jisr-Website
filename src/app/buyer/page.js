import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BuyerDashboardClient from './BuyerDashboardClient';

export default async function BuyerDashboardPage() {
    const session = await auth();

    // Server-side Protection
    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'BUYER' && session.user.role !== 'ADMIN') {
        // Optional: Redirect to their correct dashboard or show error
        // For now, let's just protect against unauthenticated access
        if (session.user.role === 'FACTORY') redirect('/factory');
    }

    return <BuyerDashboardClient />;
}
