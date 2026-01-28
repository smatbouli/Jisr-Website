'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getSiteContent(key) {
    try {
        const content = await prisma.siteContent.findUnique({
            where: { key }
        });

        if (!content) return null;
        return JSON.parse(content.content);
    } catch (error) {
        console.error(`Error fetching content for ${key}:`, error);
        return null;
    }
}

export async function updateSiteContent(key, data) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prisma.siteContent.upsert({
            where: { key },
            update: { content: JSON.stringify(data) },
            create: {
                key,
                content: JSON.stringify(data)
            }
        });

        revalidatePath('/'); // Revalidate homepage
        revalidatePath('/admin/content');
        return { success: true };
    } catch (error) {
        console.error(`Error updating content for ${key}:`, error);
        return { success: false, error: 'Failed to update content' };
    }
}

export async function updateSiteHeader(formData) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const logoText = formData.get('logoText');
        const logoFile = formData.get('logoFile');

        // Fetch existing logic to preserve URL if no new file
        const key = 'site_header';
        const existing = await getSiteContent(key) || {};
        let logoUrl = existing.logoUrl || null;

        if (logoFile && logoFile.size > 0) {
            const fs = require('fs');
            const path = require('path');

            const buffer = Buffer.from(await logoFile.arrayBuffer());
            const filename = `logo-${Date.now()}-${logoFile.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'site');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            logoUrl = `/uploads/site/${filename}`;
        }

        const data = {
            logoText,
            logoUrl
        };

        await prisma.siteContent.upsert({
            where: { key },
            update: { content: JSON.stringify(data) },
            create: { key, content: JSON.stringify(data) }
        });

        revalidatePath('/');
        revalidatePath('/admin/content');
        return { success: true, logoUrl };
    } catch (error) {
        console.error('Error updating site header:', error);
        return { success: false, error: error.message || 'Failed to update header' };
    }
}
