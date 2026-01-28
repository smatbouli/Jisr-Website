import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default async function AdminLayout({ children }) {
    const session = await auth();

    // 🔒 Security Check: Only ADMIN role allowed
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/');
    }

    const navItems = [
        { label: 'admin_overview', href: '/admin', icon: '📊' },
        { label: 'verification_center', href: '/admin/verification', icon: '✅' },
        { label: 'user_management', href: '/admin/users', icon: '👥' },
        { label: 'admin_disputes', href: '/admin/disputes', icon: '🛑' },
        { label: 'admin_orders', href: '/admin/orders', icon: '🛍️' },
        { label: 'admin_products', href: '/admin/products', icon: '📦' },
        { label: 'content_management', href: '/admin/content', icon: '🎨' },
        { label: 'message_logs', href: '/admin/messages', icon: '✉️' },
        { label: 'platform_analytics', href: '/admin/analytics', icon: '📈' },
    ];

    return (
        <div className="min-h-screen flex bg-surface-50">
            <Sidebar items={navItems} />
            {/* Main Content Area - Pushed right by sidebar (md:pl-64) */}
            <main className="flex-1 md:ps-64 transition-all duration-300">
                <div className="container p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
