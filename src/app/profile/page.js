import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function ProfileRedirectPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role === 'FACTORY') {
        redirect('/factory/settings');
    } else if (session.user.role === 'BUYER') {
        redirect('/buyer/settings');
    } else if (session.user.role === 'ADMIN') {
        redirect('/admin');
    } else {
        redirect('/dashboard');
    }
}
