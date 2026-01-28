import { getFactories } from '@/app/actions/factory-fetch';
import BuyerFactoryList from '@/components/BuyerFactoryList';

export default async function FactoryDirectoryPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const factories = await getFactories(resolvedSearchParams);

    return <BuyerFactoryList factories={factories} searchParams={resolvedSearchParams} />;
}
