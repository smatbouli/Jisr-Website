import { getLatestProducts } from '@/app/actions/product';
import HomePageClient from '@/components/HomePageClient';

export default async function Home() {
  const products = await getLatestProducts(10);

  return <HomePageClient dbProducts={products} />;
}
