const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Starting seed...');

    // 1. Create Users (Admin, 2 Factories, 2 Buyers)
    const password = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@sinaa.com' },
        update: {},
        create: { email: 'admin@sinaa.com', password, role: 'ADMIN' },
    });

    const factory1 = await prisma.user.upsert({
        where: { email: 'factory1@sinaa.com' },
        update: {},
        create: { email: 'factory1@sinaa.com', password, role: 'FACTORY' },
    });

    const factory2 = await prisma.user.upsert({
        where: { email: 'factory2@sinaa.com' },
        update: {},
        create: { email: 'factory2@sinaa.com', password, role: 'FACTORY' },
    });

    const buyer1 = await prisma.user.upsert({
        where: { email: 'buyer1@sinaa.com' },
        update: {},
        create: { email: 'buyer1@sinaa.com', password, role: 'BUYER' },
    });

    const buyer2 = await prisma.user.upsert({
        where: { email: 'buyer2@sinaa.com' },
        update: {},
        create: { email: 'buyer2@sinaa.com', password, role: 'BUYER' },
    });

    console.log('Users created.');

    // 2. Create Profiles
    // Factory 1: Verified, established
    const fp1 = await prisma.factoryProfile.create({
        data: {
            userId: factory1.id,
            businessName: 'Saudi Steel Co.',
            city: 'Riyadh',
            industry: 'Metals',
            description: 'Leading manufacturer of steel pipes and infrastructure materials.',
            isVerified: true,
            verificationStatus: 'VERIFIED',
            // Simulating some past date
            createdAt: new Date('2025-11-01'),
        }
    });

    // Factory 2: Pending
    const fp2 = await prisma.factoryProfile.create({
        data: {
            userId: factory2.id,
            businessName: 'Al-Khobar Plastics',
            city: 'Al Khobar',
            industry: 'Plastics',
            description: 'Injection molding experts.',
            isVerified: false,
            verificationStatus: 'PENDING',
            createdAt: new Date('2026-01-10'),
        }
    });

    // Buyer 1
    const bp1 = await prisma.buyerProfile.create({
        data: {
            userId: buyer1.id,
            businessName: 'Riyadh Construction Group',
            city: 'Riyadh'
        }
    });

    // Buyer 2
    const bp2 = await prisma.buyerProfile.create({
        data: {
            userId: buyer2.id,
            businessName: 'Jeddah Retailers',
            city: 'Jeddah'
        }
    });

    console.log('Profiles created.');

    // 3. Create Products for Factory 1
    await prisma.product.create({
        data: {
            factoryId: fp1.id,
            name: 'Steel Pipes 10mm',
            description: 'High durability steel pipes for industrial use.',
            price: 150.00,
            moq: 100,
            imageUrl: '',
            status: 'APPROVED'
        }
    });

    await prisma.product.create({
        data: {
            factoryId: fp1.id,
            name: 'Rebar Grade 60',
            description: 'Construction grade reinforced steel bars.',
            price: 2200.00,
            moq: 10,
            imageUrl: '',
            status: 'APPROVED'
        }
    });

    // 4. Create RFQ and Quote and Order (To show data in graphs)
    const rfq = await prisma.rfq.create({
        data: {
            buyerId: bp1.id,
            title: 'Need 5000 Steel Pipes',
            description: 'Looking for 10mm steel pipes for a project in Dammam.',
            quantity: 5000,
            status: 'AWARDED',
            createdAt: new Date('2025-12-01')
        }
    });

    const quote = await prisma.rfqResponse.create({
        data: {
            rfqId: rfq.id,
            factoryId: fp1.id,
            price: 140.00,
            notes: 'We can simulate delivery in 2 weeks.',
            status: 'AWARDED',
            createdAt: new Date('2025-12-05')
        }
    });

    // Historical Orders (Distributed over a few months for chart)
    await prisma.order.createMany({
        data: [
            { buyerId: bp1.id, factoryId: fp1.id, totalPrice: 700000, status: 'DELIVERED', createdAt: new Date('2025-12-10') },
            { buyerId: bp2.id, factoryId: fp1.id, totalPrice: 15000, status: 'SHIPPED', createdAt: new Date('2026-01-05') },
            { buyerId: bp1.id, factoryId: fp1.id, totalPrice: 50000, status: 'PROCESSING', createdAt: new Date('2026-01-15') },
            { buyerId: bp2.id, factoryId: fp1.id, totalPrice: 25000, status: 'PENDING', createdAt: new Date('2026-01-18') },
        ]
    });

    // Link the specific RFQ order
    await prisma.order.create({
        data: {
            buyerId: bp1.id,
            factoryId: fp1.id,
            rfqId: rfq.id,
            quoteId: quote.id,
            totalPrice: 5000 * 140, // 700,000
            status: 'DELIVERED', // Duplicate of above logic but linked
            createdAt: new Date('2025-12-20')
        }
    });

    console.log('Orders created.');

    // 5. Create Conversations & Messages with Attachments
    const convo = await prisma.conversation.create({
        data: {
            starterId: buyer1.id,
            receiverId: factory1.id,
            subject: 'Inquiry about Steel Pipes',
            lastMessageAt: new Date()
        }
    });

    await prisma.message.create({
        data: {
            conversationId: convo.id,
            senderId: buyer1.id,
            content: 'Hi, do you have these in stock?',
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        }
    });

    // Message with Image Attachment
    await prisma.message.create({
        data: {
            conversationId: convo.id,
            senderId: factory1.id,
            content: 'Yes, here is a photo of our stock.',
            attachmentUrl: 'https://via.placeholder.com/400x300.png?text=Stock+Photo',
            attachmentType: 'IMAGE',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
        }
    });

    // Message with Document Attachment
    await prisma.message.create({
        data: {
            conversationId: convo.id,
            senderId: factory1.id,
            content: 'And here is the spec sheet.',
            attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            attachmentType: 'DOCUMENT',
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
        }
    });

    console.log('Messages created.');
    console.log('Seed finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
