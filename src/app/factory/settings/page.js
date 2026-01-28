import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import SettingsForm from './SettingsForm';
import SettingsHeader from '@/components/SettingsHeader';

export default async function FactorySettingsPage() {
    const session = await auth();

    if (!session) {
        return <div>Unauthorized</div>;
    }

    const profile = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    return (
        <div style={{ maxWidth: '600px' }}>
            <SettingsHeader titleKey="factory_settings" descKey="factory_settings_desc" />

            <SettingsForm initialData={profile} />

            <div className="mt-8 border-t pt-8">
                <ChangePasswordForm />
            </div>
        </div >
    );
}

import ChangePasswordForm from '@/components/ChangePasswordForm';
