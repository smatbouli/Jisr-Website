import { getPlatformAnalytics } from '@/app/actions/admin';
import DashboardOverview from '@/components/admin/DashboardOverview';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/login');
    }

    const data = await getPlatformAnalytics();

    // Pass data to the client component
    return <DashboardOverview data={data} />;
}
