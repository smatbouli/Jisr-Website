import { getFactoryById } from '@/app/actions/factory-fetch';
import BackButton from '@/components/BackButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Factory, CheckCircle, ArrowLeft, MessageSquare, Box, ShieldCheck, FileText } from 'lucide-react';

export default async function BuyerFactoryProfilePage({ params }) {
    const { id } = await params;
    const factory = await getFactoryById(id);

    if (!factory) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Back Link */}
            <div>
                <BackButton href="/buyer/factories" labelKey="back_to_directory" />
            </div>

            {/* Hero / Header Card */}
            <Card className="overflow-hidden border-none shadow-sm">
                <div className="h-32 bg-primary-900 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                </div>
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 relative z-10">
                        {/* Logo Placeholder */}
                        <div className="w-32 h-32 bg-white rounded-2xl shadow-md flex items-center justify-center text-primary-900 text-4xl font-serif font-bold border-4 border-white">
                            {factory.businessName.charAt(0)}
                        </div>

                        <div className="flex-1 pt-0 md:pt-14">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{factory.businessName}</h1>
                                    {factory.businessNameAr && <h2 className="text-xl text-gray-500 mb-4 font-arabic">{factory.businessNameAr}</h2>}

                                    <div className="flex flex-wrap gap-3 items-center text-sm font-medium text-gray-600">
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-100 rounded-full border border-gray-100">
                                            <Factory size={14} /> {factory.industry}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-100 rounded-full border border-gray-100">
                                            <MapPin size={14} /> {factory.city}
                                        </span>
                                        {factory.verificationStatus === 'VERIFIED' && (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                                <ShieldCheck size={14} /> Verified Manufacturer
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <form action={async () => {
                                        'use server';
                                        const { startConversation } = await import('@/app/actions/messaging');
                                        const { redirect } = await import('next/navigation');
                                        const result = await startConversation(factory.id, `Inquiry to ${factory.businessName}`, "Hi, I am interested in your products.");
                                        if (result.success) {
                                            redirect(`/messages/${result.conversationId}`);
                                        }
                                    }}>
                                        <Button size="md" className="w-full shadow-primary-900/20">
                                            <MessageSquare className="mr-2" size={18} /> Message Factory
                                        </Button>
                                    </form>
                                    <Link href="/buyer/rfq/create">
                                        <Button variant="outline" size="md" className="w-full">
                                            <FileText className="mr-2" size={18} /> Request Quote
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About Us</h3>
                        <p className="text-gray-600 leading-relaxed max-w-4xl">
                            {factory.description || 'Verified manufacturer on Jisr, dedicated to providing high-quality products and services.'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Products Grid */}
            <div>
                <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-2">
                    <Box className="text-primary-600" /> Product Catalog
                </h2>
                {factory.products.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Box size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Products Listed</h3>
                        <p className="text-gray-500">This factory hasn&apos;t uploaded any products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {factory.products.map(product => (
                            <Card key={product.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-none shadow-sm">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                            <Box size={32} opacity={0.5} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-primary-900 shadow-sm border border-white/20">
                                        MOQ: {product.moq}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary-700 transition-colors">{product.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                                    <Button variant="outline" size="sm" className="w-full justify-center">
                                        View Details
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
