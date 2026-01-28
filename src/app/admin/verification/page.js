import { getVerificationQueue } from '@/app/actions/admin';
import VerificationPageClient from '@/components/admin/VerificationPageClient';

export default async function VerificationPage() {
    const queue = await getVerificationQueue();

    return <VerificationPageClient queue={queue} />;
}
