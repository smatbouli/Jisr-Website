
import { getProduct, getRandomProducts } from '@/app/actions/product';
import ProductView from '@/components/ProductView';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found | Jisr Marketplace',
        };
    }

    return {
        title: `${product.name} | Jisr Marketplace`,
        description: product.description.substring(0, 160),
    };
}

export default async function Page({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Fetch related products (random for demo)
    // Filter out current product if possible in fetch, or just slice
    const related = await getRandomProducts(8);
    const relatedFiltered = related.filter(p => p.id !== product.id);

    return <ProductView product={product} relatedProducts={relatedFiltered} />;
}
