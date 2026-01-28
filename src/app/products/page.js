import { getProducts } from '@/app/actions/product';
import ProductMarketplace from '@/components/ProductMarketplace';

export default async function ProductsPage({ searchParams }) {
    const params = await searchParams;
    const products = await getProducts(params);

    return (
        <ProductMarketplace products={products} searchParams={params} />
    );
}
