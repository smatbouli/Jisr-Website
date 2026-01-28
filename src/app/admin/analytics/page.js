import { getPlatformAnalytics } from '@/app/actions/admin';
import AnalyticsPageClient from '@/components/admin/AnalyticsPageClient';

export default async function AdminAnalyticsPage() {
    const data = await getPlatformAnalytics();

    return <AnalyticsPageClient data={data} />;
}
