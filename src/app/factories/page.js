import { getFactories } from '@/app/actions/factory-fetch';
import FactoryDirectory from '@/components/FactoryDirectory';

export default async function PublicFactoryDirectoryPage({ searchParams }) {
    const params = await searchParams;
    const factories = await getFactories(params);

    return (
        <FactoryDirectory factories={factories} searchParams={params} />
    );
}
