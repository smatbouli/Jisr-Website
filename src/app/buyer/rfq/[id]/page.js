import { getRfqById } from '@/app/actions/rfq';
import { notFound } from 'next/navigation';
import BuyerRfqDetailView from '@/components/BuyerRfqDetailView';

export default async function BuyerRfqDetailPage({ params }) {
    const { id } = await params;
    const rfq = await getRfqById(id);

    if (!rfq) notFound();

    return <BuyerRfqDetailView rfq={rfq} />;
}
