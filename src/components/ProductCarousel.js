'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, ArrowRight, MapPin, Package } from 'lucide-react';
import Image from 'next/image';

export default function ProductCarousel({ products }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="relative group">
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => scroll('left')}
                    className="p-3 bg-white text-gray-800 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar p-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[300px] snap-center">
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group/card cursor-pointer border-gray-100">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <Package size={48} />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-gray-800 shadow-sm">
                                    {product.factory.city}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate" title={product.name}>{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{product.description}</p>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                                            {product.factory.businessName.charAt(0)}
                                        </div>
                                        <span className="truncate max-w-[120px]">{product.factory.businessName}</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">MOQ: {product.moq}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => scroll('right')}
                    className="p-3 bg-white text-gray-800 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
