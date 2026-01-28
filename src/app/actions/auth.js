'use server';

import prisma from '@/lib/prisma';

export async function verifyUser(email, code) {
    if (!email || !code) {
        return { success: false, error: 'Missing fields' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (user.isVerified) {
            return { success: true }; // Already verified
        }

        if (user.verificationCode !== code) {
            return { success: false, error: 'Invalid verification code' };
        }

        await prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationCode: null // Clear code after usage
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Verification error:', error);
        return { success: false, error: 'Verification failed' };
    }
}
