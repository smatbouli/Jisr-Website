import { getPendingProducts } from '@/app/actions/admin';
import ProductsPageClient from '@/components/admin/ProductsPageClient';

export default async function ProductModerationPage() {
    const products = await getPendingProducts();

    return <ProductsPageClient products={products} />;
}
