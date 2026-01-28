import Sidebar from '@/components/Sidebar';

export default function FactoryLayout({ children }) {
    const navItems = [
        { label: 'Overview', href: '/factory', icon: '📊' },
        { label: 'RFQ Market', href: '/factory/rfq', icon: '📥' },
        { label: 'Orders', href: '/factory/orders', icon: '📦' },
        { label: 'My Products', href: '/factory/products', icon: '🏭' },
        { label: 'Verification', href: '/factory/verification', icon: '✅' },
        { label: 'Messages', href: '/messages', icon: '✉️' },
        { label: 'Settings', href: '/factory/settings', icon: '⚙️' },
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
