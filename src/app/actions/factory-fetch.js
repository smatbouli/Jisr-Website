'use server';

import prisma from '@/lib/prisma';

export async function getFactories(searchParams) {
    const query = searchParams?.q || '';
    const industry = searchParams?.industry || '';
    const city = searchParams?.city || '';
    const minRating = parseInt(searchParams?.rating || '0');
    const sortBy = searchParams?.sort || 'newest';

    const where = {
        AND: [
            query ? {
                OR: [
                    { businessName: { contains: query } },
                    { description: { contains: query } }
                ]
            } : {},
            industry ? { industry } : {},
            city ? { city } : {},
            { verificationStatus: 'VERIFIED' }
        ]
    };

    try {
        let factories = await prisma.factoryProfile.findMany({
            where,
            select: {
                id: true,
                businessName: true,
                businessNameAr: true,
                industry: true,
                city: true,
                description: true,
                verificationStatus: true,
                createdAt: true,
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
        });

        // 1. Calculate Ratings & Filter
        factories = factories.map(f => {
            const avgRating = f.reviews.length > 0
                ? f.reviews.reduce((acc, r) => acc + r.rating, 0) / f.reviews.length
                : 0;
            return { ...f, avgRating };
        });

        if (minRating > 0) {
            factories = factories.filter(f => f.avgRating >= minRating);
        }

        // 2. Sorting
        if (sortBy === 'rating') {
            factories.sort((a, b) => b.avgRating - a.avgRating);
        } else {
            // Default newest
            factories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return factories;
    } catch (error) {
        console.error('Fetch factories error:', error);
        return [];
    }
}

export async function getFactoryById(id) {
    try {
        const factory = await prisma.factoryProfile.findUnique({
            where: { id },
            include: {
                products: true,
                reviews: {
                    include: {
                        buyer: {
                            select: {
                                businessName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return factory;
    } catch (error) {
        return null;
    }
}
