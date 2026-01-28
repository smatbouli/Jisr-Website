'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateBuyerProfile(formData) {
    const session = await auth();
    if (!session || session.user.role !== 'BUYER') {
        throw new Error('Unauthorized');
    }

    const businessName = formData.get('businessName');
    const city = formData.get('city');

    await prisma.buyerProfile.update({
        where: { userId: session.user.id },
        data: {
            businessName,
            city
        }
    });

    revalidatePath('/buyer/settings');
    revalidatePath('/dashboard');
}
