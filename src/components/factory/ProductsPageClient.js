'use client';

import Link from 'next/link';
import { deleteProduct } from '@/app/actions/product';
import styles from '@/app/dashboard/page.module.css';
import { useLanguage } from '@/components/LanguageContext';

export default function ProductsPageClient({ products, factory }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    if (!factory) {
        return (
            <div className={`p-8 text-center ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
                <h1 className="text-2xl font-bold mb-4">{t('complete_profile_title')}</h1>
                <p className="mb-4">{t('complete_profile_desc')}</p>
                <Link href="/factory/settings" className="px-4 py-2 bg-primary-600 text-white rounded">
                    {t('go_to_settings')}
                </Link>
            </div>
        );
    }

    return (
        <div className={isArabic ? 'font-arabic' : ''} dir={isArabic ? 'rtl' : 'ltr'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }} className={isArabic ? 'flex-row-reverse' : ''}>
                <h1 className="text-2xl font-bold">{t('my_products')}</h1>
                <Link href="/factory/products/add" className={styles.actionButton} style={{ width: 'auto', display: 'inline-block' }}>
                    {t('add_new_product_btn')}
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    {t('no_products_added')}
                </div>
            ) : (
                <div className={styles.grid}>
                    {products.map(product => (
                        <div key={product.id} className={styles.card}>
                            <h3 className={styles.cardTitle}>{product.name}</h3>
                            <p className={styles.cardContent} style={{ height: '60px', overflow: 'hidden' }}>{product.description}</p>
                            <div className="text-sm text-gray-500 mb-4">{t('moq')}: {product.moq}</div>
                            <div className="flex gap-4">
                                <Link href={`/factory/products/${product.id}/edit`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                                    {t('edit')}
                                </Link>
                                <form action={async () => {
                                    await deleteProduct(product.id);
                                }}>
                                    <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium">{t('delete')}</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
