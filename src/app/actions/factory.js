'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const fs = require('fs');
const path = require('path');

export async function submitVerification(formData) {
    const session = await auth();
    if (!session || session.user.role !== 'FACTORY') {
        return { error: 'Unauthorized' };
    }

    const userId = session.user.id;
    const crNumber = formData.get('crNumber');
    const licenseNumber = formData.get('licenseNumber');
    const taxNumber = formData.get('taxNumber');

    const crFile = formData.get('crDocument');
    const licenseFile = formData.get('licenseDocument');
    const taxFile = formData.get('taxDocument');
    const sasoFile = formData.get('sasoDocument');

    // Basic validation (SASO is optional)
    if (!crNumber || !licenseNumber || !taxNumber || !crFile || !licenseFile || !taxFile) {
        return { error: 'All mandatory fields and documents are required' };
    }

    try {
        console.log('Starting verification submission for user:', userId);

        // Helper to upload file
        const uploadFile = async (file, prefix) => {
            if (!file || typeof file === 'string' || file.size === 0) return null; // Handle optional files
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${prefix}-${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            return `/uploads/documents/${filename}`;
        };

        const crDocumentUrl = await uploadFile(crFile, 'CR');
        const licenseDocumentUrl = await uploadFile(licenseFile, 'LIC');
        const taxDocumentUrl = await uploadFile(taxFile, 'TAX'); // New Mandatory
        const sasoDocumentUrl = await uploadFile(sasoFile, 'SASO'); // New Optional

        console.log('Files uploaded, updating database...');

        await prisma.factoryProfile.update({
            where: { userId },
            data: {
                crNumber,
                licenseNumber,
                taxNumber,
                crDocumentUrl,
                licenseDocumentUrl,
                taxDocumentUrl,
                sasoDocumentUrl,
                verificationStatus: 'PENDING'
            }
        });

        console.log('Database updated successfully.');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Verification submission failed:', error);
        return { error: 'Failed to submit documents: ' + error.message };
    }
}

export async function updateFactoryProfile(formData) {
    const session = await auth();
    if (!session || session.user.role !== 'FACTORY') {
        return { error: 'Unauthorized' };
    }

    const userId = session.user.id;
    const businessName = formData.get('businessName');
    const industry = formData.get('industry');
    const city = formData.get('city');
    const description = formData.get('description');
    const businessNameAr = formData.get('businessNameAr');
    const crNumber = formData.get('crNumber');

    try {
        const factory = await prisma.factoryProfile.findUnique({ where: { userId } });

        // If factory is already verified, save to pendingChanges instead
        if (factory.verificationStatus === 'VERIFIED') {
            const pendingData = {
                businessName,
                businessNameAr,
                industry,
                city,
                description,
                crNumber,
                timestamp: new Date().toISOString()
            };

            await prisma.factoryProfile.update({
                where: { userId },
                data: {
                    pendingChanges: JSON.stringify(pendingData)
                }
            });

            revalidatePath('/factory/settings');
            return { success: 'Changes submitted for review. Your profile will update after approval.' };
        }

        // Normal update for unverified factories
        await prisma.factoryProfile.update({
            where: { userId },
            data: {
                businessName,
                businessNameAr,
                industry,
                city,
                description,
                crNumber,
            },
        });

        revalidatePath('/factory/settings');
        revalidatePath('/factory'); // Update dashboard if name changed
        return { success: 'Profile updated successfully' };
    } catch (error) {
        console.error('Failed to update profile:', error);
        return { error: 'Failed to update profile' };
    }
}
