import { getBuyerRfqs } from '@/app/actions/rfq';
import BuyerRfqList from '@/components/BuyerRfqList';

export default async function BuyerRfqListPage() {
    const rfqs = await getBuyerRfqs();

    return <BuyerRfqList rfqs={rfqs} />;
}
