import { getDisputes } from '@/app/actions/dispute';
import DisputesPageClient from '@/components/admin/DisputesPageClient';

export default async function AdminDisputesPage() {
    const disputes = await getDisputes();

    return <DisputesPageClient disputes={disputes} />;
}
