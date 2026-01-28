'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Factory,
    FileText,
    Package,
    MessageSquare,
    User,
    Settings,
    CheckCircle,
    Inbox,
    ShoppingBag,
    Palette,
    TrendingUp,
    Users,
    AlertOctagon
} from 'lucide-react';

const iconMap = {
    '📊': LayoutDashboard,
    '🏭': Factory,
    '📝': FileText,
    '📦': Package,
    '✉️': MessageSquare,
    '👤': User,
    '📥': Inbox,
    '✅': CheckCircle,
    '⚙️': Settings,
    '🛍️': ShoppingBag,
    '🎨': Palette,
    '📈': TrendingUp,
    '👥': Users,
    '🛑': AlertOctagon
};

import { useLanguage } from '@/components/LanguageContext';

export default function Sidebar({ items }) {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';

    return (
        <aside className={`hidden md:flex flex-col w-64 fixed top-20 bottom-0 bg-white border-r border-gray-100 z-40 overflow-y-auto transition-all ${isArabic ? 'right-0 border-l border-r-0' : 'left-0 border-r'}`}>
            <div className="p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t('menu')}</h3>
                <nav className="space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = iconMap[item.icon] || LayoutDashboard;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary-50 text-primary-900 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon
                                    size={18}
                                    className={cn(
                                        "transition-colors",
                                        isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600",
                                        isArabic && "rotate-180" // Optional: mirror icons if needed
                                    )}
                                />
                                {t(item.label) || item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-100">
                <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-primary-900/25 transition-shadow">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                    <h4 className="font-bold mb-1 relative z-10">{t('premium_plan')}</h4>
                    <p className="text-xs text-primary-200 relative z-10 mb-3">{t('premium_desc')}</p>
                    <button className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-md transition-colors w-full font-medium">
                        {t('upgrade_now')}
                    </button>
                </div>
            </div>
        </aside>
    );
}
