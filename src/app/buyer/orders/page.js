import { getBuyerOrders } from '@/app/actions/order';
import BuyerOrderList from '@/components/BuyerOrderList';

export default async function BuyerOrdersPage() {
    const orders = await getBuyerOrders();

    return <BuyerOrderList orders={orders} />;
}
