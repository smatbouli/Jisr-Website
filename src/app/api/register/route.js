import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req) {
    try {
        const body = await req.json();
        let { email, password, role, businessName, fullName } = body;

        // Default role to BUYER if not provided or invalid
        if (!role) {
            role = 'BUYER';
        }

        if (!email || !password || !businessName || !fullName) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await hash(password, 10);

        // Create user and profile in transaction
        const newUser = await prisma.$transaction(async (tx) => {
            // Generate 6-digit OTP
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: role,
                    // isVerified and verificationCode removed temporarily due to schema mismatch
                },
            });

            if (role === 'FACTORY') {
                await tx.factoryProfile.create({
                    data: {
                        userId: user.id,
                        businessName: businessName,
                        verificationStatus: 'UNVERIFIED',
                        // Additional factory defaults can go here
                    },
                });
            } else if (role === 'BUYER') {
                await tx.buyerProfile.create({
                    data: {
                        userId: user.id,
                        businessName: businessName,
                        // Buyer specific defaults
                    },
                });
            }
            // Add ADMIN logic here if needed, or handle separately (admins usually created manually/seeded)

            return user;
        });

        /* 
        // Email disabled temporarily - Code not stored
        const { sendEmail } = await import('@/lib/notifications-external');
        await sendEmail({
            to: email,
            subject: 'Verify your Jisr Account',
            text: `Your verification code is: ${newUser.verificationCode}`
        });
        */
    } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
        { message: 'User created. Please verify email.', email: newUser.email },
        { status: 201 }
    );
} catch (error) {
    console.error('Registration error details:', error);
    return NextResponse.json(
        { message: 'Internal server error: ' + (error.message || 'Unknown') },
        { status: 500 }
    );
}
}
