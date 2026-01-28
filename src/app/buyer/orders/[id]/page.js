import { getOrderById } from '@/app/actions/order';
import { notFound } from 'next/navigation';
import BuyerOrderDetails from '@/components/BuyerOrderDetails';

export default async function BuyerOrderDetailsPage({ params }) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) notFound();

    return <BuyerOrderDetails order={order} />;
}
