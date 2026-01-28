import { getProduct } from '@/app/actions/product';
import EditProductForm from '@/components/EditProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <EditProductForm product={product} />
    );
}
