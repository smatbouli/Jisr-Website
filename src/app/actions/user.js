'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';

export async function changePassword(formData) {
    const session = await auth();
    if (!session) return { error: 'Unauthorized' };

    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match' };
    }

    if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user || !user.password) {
        return { error: 'User not found' };
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
        return { error: 'Incorrect current password' };
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}
