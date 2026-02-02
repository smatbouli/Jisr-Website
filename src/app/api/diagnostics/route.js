import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req) {
    const body = await req.json();
    const { action } = body;

    try {
        if (action === 'check') {
            // 1. Check DB Connection
            const userCount = await prisma.user.count();

            // 2. Check Admin
            const adminUser = await prisma.user.findUnique({
                where: { email: 'admin@sinaa.com' },
                include: { factoryProfile: true, buyerProfile: true }
            });

            // 3. Check Buyer
            const buyerUser = await prisma.user.findUnique({
                where: { email: 'buyer1@sinaa.com' }
            });

            return NextResponse.json({
                status: 'ok',
                database: 'connected',
                userCount,
                adminUser: adminUser ? {
                    id: adminUser.id,
                    email: adminUser.email,
                    role: adminUser.role,
                    isVerified: adminUser.isVerified,
                    profiles: {
                        factory: !!adminUser.factoryProfile,
                        buyer: !!adminUser.buyerProfile
                    }
                } : 'NOT FOUND',
                buyerUser: buyerUser ? {
                    id: buyerUser.id,
                    role: buyerUser.role
                } : 'NOT FOUND',
                nodeEnv: process.env.NODE_ENV,
            });
        }

        if (action === 'fix_admin') {
            const email = 'admin@sinaa.com';

            // Upsert Admin
            const user = await prisma.user.upsert({
                where: { email },
                update: { role: 'ADMIN' },
                create: {
                    email,
                    password: await hash('Admin123!', 10),
                    role: 'ADMIN',
                    isVerified: true
                }
            });

            return NextResponse.json({
                message: 'Admin Fixed',
                user: {
                    email: user.email,
                    role: user.role
                }
            });
        }

        return NextResponse.json({ error: 'Invalid action' });

    } catch (error) {
        console.error('Diagnostics Error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
