'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session?.user?.role === 'BUYER') {
            router.replace('/buyer');
        } else if (session?.user?.role === 'FACTORY') {
            router.replace('/factory');
        } else if (session?.user?.role === 'ADMIN') {
            router.replace('/admin');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return <div className="container" style={{ paddingTop: '40px' }}>Loading...</div>;
    }

    // If we are redirecting, we can return null to avoid flash
    if (session?.user?.role && ['BUYER', 'FACTORY', 'ADMIN'].includes(session.user.role)) {
        return null;
    }

    // If no specific role dashboard (or unexpected role), render default dashboard content
    if (!session) {
        return null;
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className="container">
                <header className={styles.header}>
                    <h1 className={styles.welcome}>Welcome back, {session.user.name || 'User'}</h1>
                    <span className={styles.role}>{session.user.role} Account</span>
                </header>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>My Profile</h3>
                        <p className={styles.cardContent}>Manage your personal information, password, and preferences.</p>
                        <Link href={session.user.role === 'FACTORY' ? '/factory/settings' : '/buyer/settings'} className={styles.actionButton}>Edit Profile →</Link>
                    </div>

                    <div className={styles.card}>
                        {session.user.role === 'FACTORY' ? (
                            <>
                                <h3 className={styles.cardTitle}>Production Hub</h3>
                                <p className={styles.cardContent}>Manage your products, capabilities, and incoming orders.</p>
                                <Link href="/products" className={styles.actionButton}>Manage Products →</Link>
                            </>
                        ) : (
                            <>
                                <h3 className={styles.cardTitle}>My RFQs</h3>
                                <p className={styles.cardContent}>Track your Request for Quotations and view factory responses.</p>
                                <Link href="/rfqs" className={styles.actionButton}>View RFQs →</Link>
                            </>
                        )}
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Messages</h3>
                        <p className={styles.cardContent}>Check your inbox for new messages and notifications.</p>
                        <Link href="/messages" className={styles.actionButton}>Go to Inbox →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
