import { getPlatformAnalytics } from '@/app/actions/admin';
import DashboardOverview from '@/components/admin/DashboardOverview';

export default async function AdminDashboard() {
    const data = await getPlatformAnalytics();

    // Pass data to the client component
    return <DashboardOverview data={data} />;
}
