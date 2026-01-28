'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getProducts(searchParams) {
    const query = searchParams?.q || '';
    const industry = searchParams?.industry || '';
    const city = searchParams?.city || '';
    const minRating = parseInt(searchParams?.rating || '0');
    const sortBy = searchParams?.sort || 'newest';

    const where = {
        AND: [
            query ? {
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } }
                ]
            } : {},
            // Filter by factory properties
            {
                factory: {
                    AND: [
                        industry ? { industry } : {},
                        city ? { city } : {},
                        { verificationStatus: 'VERIFIED' } // Only show products from verified factories? Maybe safer.
                    ]
                }
            }
        ]
    };

    try {
        let products = await prisma.product.findMany({
            where,
            include: {
                factory: {
                    select: {
                        businessName: true,
                        city: true,
                        industry: true,
                        reviews: {
                            select: { rating: true }
                        }
                    }
                }
            }
        });

        // 1. Calculate Ratings (based on factory rating for now as products don't seem to have direct reviews in schema usually. 
        // Or if they did, we would check product.reviews. Let's assume factory rating is the trust signal.)
        products = products.map(p => {
            const avgRating = p.factory.reviews.length > 0
                ? p.factory.reviews.reduce((acc, r) => acc + r.rating, 0) / p.factory.reviews.length
                : 0;
            return { ...p, avgRating };
        });

        if (minRating > 0) {
            products = products.filter(p => p.avgRating >= minRating);
        }

        // 2. Sorting
        if (sortBy === 'rating') {
            products.sort((a, b) => b.avgRating - a.avgRating);
        } else {
            // Default newest
            products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return products;
    } catch (error) {
        console.error('Fetch products error:', error);
        return [];
    }
}

export async function createProduct(formData) {
    const session = await auth();
    if (!session || session.user.role !== 'FACTORY') {
        return { error: 'Unauthorized' };
    }

    // Get factory profile first to link product
    const factory = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!factory) {
        return { error: 'Factory profile not found' };
    }


    const name = formData.get('name');
    const description = formData.get('description');
    const moq = parseInt(formData.get('moq') || '1');
    const imageFile = formData.get('image');

    if (!name || !description) {
        return { error: 'Name and Description are required' };
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
        const fs = require('fs'); // Use require inside function for server action safety/clarity in this context or import at top
        const path = require('path');

        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${Date.now()}-${imageFile.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

            // Ensure dir exists (redundant but safe)
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);

            imageUrl = `/uploads/products/${filename}`;
        } catch (e) {
            console.error("Upload error:", e);
            // Continue without image or handle error
            return { error: 'Image upload failed' };
        }
    }

    try {
        await prisma.product.create({
            data: {
                name,
                description,
                imageUrl, // Now saves the local path
                moq,
                factoryId: factory.id,
                status: 'APPROVED', // Auto-approve for demo
                // New Fields
                priceMin: formData.get('priceMin') ? parseFloat(formData.get('priceMin')) : null,
                priceMax: formData.get('priceMax') ? parseFloat(formData.get('priceMax')) : null,
                // Construct JSON from specific form fields designed for the factory page
                attributes: JSON.stringify({
                    "Material": formData.get('attr_material'),
                    "Voltage": formData.get('attr_voltage'),
                    "Power": formData.get('attr_power'),
                    "Dimensions": formData.get('attr_dimensions'),
                    "Weight": formData.get('attr_weight'),
                    "Warranty": formData.get('attr_warranty'),
                    "Certification": formData.get('attr_certification')
                }),
                customization: JSON.stringify({
                    "logo": formData.get('cust_logo') === 'on',
                    "packaging": formData.get('cust_packaging') === 'on',
                    "design": formData.get('cust_design') === 'on'
                }),
                leadTime: JSON.stringify([
                    { qty: "1-100", days: formData.get('lead_1') || "7" },
                    { qty: "101-500", days: formData.get('lead_2') || "15" },
                    { qty: "500+", days: formData.get('lead_3') || "30" }
                ])
            },
        });

        revalidatePath('/factory/products');
    } catch (error) {
        console.error('Failed to create product:', error);
        return { error: 'Failed to create product' };
    }

    redirect('/factory/products');
}

export async function updateProduct(productId, formData) {
    const session = await auth();
    if (!session || session.user.role !== 'FACTORY') {
        return { error: 'Unauthorized' };
    }

    // Get factory profile
    const factory = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!factory) {
        return { error: 'Factory profile not found' };
    }

    // specific check: verify this product belongs to this factory
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!existingProduct || existingProduct.factoryId !== factory.id) {
        return { error: 'Unauthorized or product not found' };
    }

    // console.log("Updating product:", productId);

    const name = formData.get('name');
    const description = formData.get('description');
    const moq = parseInt(formData.get('moq') || '1');
    const imageFile = formData.get('image');

    if (!name || !description) {
        return { error: 'Name and Description are required' };
    }

    let imageUrl = existingProduct.imageUrl; // Default to existing image
    if (imageFile && imageFile.size > 0) {
        const fs = require('fs');
        const path = require('path');

        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `${Date.now()}-${imageFile.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);

            imageUrl = `/uploads/products/${filename}`;
        } catch (e) {
            console.error("Upload error:", e);
            return { error: 'Image upload failed: ' + e.message };
        }
    }

    try {
        const updateData = {
            name,
            description,
            imageUrl,
            moq,
            // New Fields
            priceMin: formData.get('priceMin') ? parseFloat(formData.get('priceMin')) : null,
            priceMax: formData.get('priceMax') ? parseFloat(formData.get('priceMax')) : null,
            attributes: JSON.stringify({
                "Material": formData.get('attr_material'),
                "Voltage": formData.get('attr_voltage'),
                "Power": formData.get('attr_power'),
                "Dimensions": formData.get('attr_dimensions'),
                "Weight": formData.get('attr_weight'),
                "Warranty": formData.get('attr_warranty'),
                "Certification": formData.get('attr_certification')
            }),
            customization: JSON.stringify({
                "logo": formData.get('cust_logo') === 'on',
                "packaging": formData.get('cust_packaging') === 'on',
                "design": formData.get('cust_design') === 'on'
            }),
            leadTime: JSON.stringify([
                { qty: "1-100", days: formData.get('lead_1') || "7" },
                { qty: "101-500", days: formData.get('lead_2') || "15" },
                { qty: "500+", days: formData.get('lead_3') || "30" }
            ])
        };

        // console.log("Update Data prepared", updateData);

        await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });

        // console.log("Product updated in DB");
        revalidatePath('/factory/products');
        revalidatePath(`/products/${productId}`);
    } catch (error) {
        console.error('Failed to update product:', error);
        return { error: 'Failed to update product' };
    }

    redirect('/factory/products');
}

export async function deleteProduct(productId) {
    const session = await auth();
    if (!session || session.user.role !== 'FACTORY') {
        return { error: 'Unauthorized' };
    }

    // Ensure ownership
    const factory = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    try {
        await prisma.product.deleteMany({
            where: {
                id: productId,
                factoryId: factory.id // Security check
            }
        });
        revalidatePath('/factory/products');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to delete' };
    }
}

export async function getRandomProducts(limit = 10) {
    const count = await prisma.product.count({
        // where: { status: 'APPROVED' }
    });

    // Determine random skip
    const skip = Math.max(0, Math.floor(Math.random() * (count - limit)));

    const products = await prisma.product.findMany({
        // where: { status: 'APPROVED' }, // Show all for demo
        take: limit,
        skip: skip,
        include: {
            factory: {
                select: {
                    businessName: true,
                    city: true
                }
            }
        }
    });

    return products.sort(() => Math.random() - 0.5);
}

export async function getProduct(id) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                factory: {
                    select: {
                        id: true,
                        businessName: true,
                        city: true,
                        description: true,
                        isVerified: true,
                        verificationStatus: true
                    }
                }
            }
        });

        // Parse JSON strings back to objects for frontend convenience
        if (product) {
            try {
                if (product.attributes && typeof product.attributes === 'string')
                    product.attributes = JSON.parse(product.attributes);
                if (product.customization && typeof product.customization === 'string')
                    product.customization = JSON.parse(product.customization);
                if (product.leadTime && typeof product.leadTime === 'string')
                    product.leadTime = JSON.parse(product.leadTime);
            } catch (e) {
                console.error("Error parsing product JSON fields", e);
            }
        }

        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
