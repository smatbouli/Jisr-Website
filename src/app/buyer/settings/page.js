import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import BuyerSettingsForm from './BuyerSettingsForm';
import SettingsHeader from '@/components/SettingsHeader';

export default async function BuyerSettingsPage() {
    const session = await auth();

    if (!session) {
        return <div>Unauthorized</div>;
    }

    const profile = await prisma.buyerProfile.findUnique({
        where: { userId: session.user.id }
    });

    return (
        <div className="max-w-2xl mx-auto py-8">
            <SettingsHeader />

            <BuyerSettingsForm initialData={profile} />

            <ChangePasswordForm />
        </div>
    );
}

import ChangePasswordForm from '@/components/ChangePasswordForm';
