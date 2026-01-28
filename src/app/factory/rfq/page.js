import { getOpenRfqs } from '@/app/actions/rfq';
import styles from '@/app/dashboard/page.module.css';
import Link from 'next/link';
import ContactBuyerButton from '@/components/ContactBuyerButton';

export default async function FactoryRfqMarketPage() {
    const rfqs = await getOpenRfqs();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">RFQ Market</h1>
                <p className="text-gray-600">Browse and quote on requests from buyers.</p>
            </div>

            {rfqs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded shadow-sm border">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active requests</h3>
                    <p className="text-gray-500">Check back later for new opportunities.</p>
                </div>
            ) : (
                <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                    {rfqs.map(rfq => (
                        <div key={rfq.id} className="bg-white p-6 rounded shadow-sm border flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">{rfq.title}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">OPEN</span>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    <span className="font-medium text-gray-700">{rfq.buyer.businessName}</span>
                                    {rfq.buyer.city && <span> • {rfq.buyer.city}</span>}
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {rfq.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <div className="text-gray-500 text-xs uppercase">Quantity</div>
                                        <div className="font-semibold">{rfq.quantity} units</div>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <div className="text-gray-500 text-xs uppercase">Posted</div>
                                        <div>{new Date(rfq.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/factory/rfq/${rfq.id}`}
                                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Submit Quote
                                </Link>
                                <ContactBuyerButton
                                    buyerId={rfq.buyer.userId}
                                    businessName={rfq.buyer.businessName}
                                    rfqTitle={rfq.title}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
