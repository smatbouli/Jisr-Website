import { getFactoryOrders } from '@/app/actions/order';
import FactoryOrderList from '@/components/FactoryOrderList';

export default async function FactoryOrdersPage() {
    const orders = await getFactoryOrders();

    return <FactoryOrderList orders={orders} />;
}
