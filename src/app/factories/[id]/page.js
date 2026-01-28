import { getFactoryById } from '@/app/actions/factory-fetch';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Factory, CheckCircle, ArrowLeft, Mail, ShieldCheck, Box, Tag } from 'lucide-react';
import ContactFactoryButton from '@/components/ContactFactoryButton';

export default async function PublicFactoryProfilePage({ params }) {
    const { id } = await params;
    const factory = await getFactoryById(id);
    const session = await auth();

    if (!factory) {
        notFound();
    }

    return (
        <div className="bg-surface-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/factories" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-900 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Directory
                    </Link>
                </div>

                {/* Hero / Header Card */}
                <Card className="mb-12 overflow-hidden border-none shadow-lg">
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
                                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">{factory.businessName}</h1>
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
                                            {factory.reviews && factory.reviews.length > 0 && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-100 font-bold">
                                                    <span>⭐</span> {(factory.reviews.reduce((acc, r) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)}
                                                    <span className="text-yellow-600/70 font-normal">({factory.reviews.length})</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto mt-4 md:mt-0">
                                        {session ? (
                                            <ContactFactoryButton factoryId={id} businessName={factory.businessName} />
                                        ) : (
                                            <Link href="/login">
                                                <Button size="lg" className="w-full shadow-primary-900/20">
                                                    Login to Contact
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100 grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">About Us</h3>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {factory.description || 'Verified manufacturer on Jisr, dedicated to providing high-quality products and services.'}
                                </p>
                            </div>
                            <div className="bg-surface-50 p-6 rounded-xl border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Stats</h4>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between text-gray-600">
                                        <span>Member Since</span>
                                        <span className="font-semibold text-gray-900">2024</span>
                                    </li>
                                    <li className="flex justify-between text-gray-600">
                                        <span>Response Time</span>
                                        <span className="font-semibold text-gray-900">&lt; 24 Hrs</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Reviews Section */}
                {factory.reviews && factory.reviews.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-2">
                            <span>⭐</span> Reviews
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {factory.reviews.map(review => (
                                <Card key={review.id} className="p-4 border-none shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-gray-900">{review.buyer.businessName}</div>
                                        <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <RatingStars rating={review.rating} />
                                    {review.comment && <p className="text-gray-600 mt-2 text-sm">"{review.comment}"</p>}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-2">
                        <Box className="text-primary-600" /> Product Catalog
                    </h2>
                    {factory.products.length === 0 ? (
                        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Box size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No Access Publicly</h3>
                            <p className="text-gray-500">Sign in to view full product catalog and pricing.</p>
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
        </div>
    );
}

function RatingStars({ rating }) {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
            ))}
        </div>
    );
}
