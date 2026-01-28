'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from './NotificationBell';

export default function DashboardHeader({ title }) {
    const { data: session } = useSession();

    return (
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4">
                {/* Could put breadcrumbs or title here if passed */}
                <h2 className="text-xl font-bold text-gray-800">{title || 'Dashboard'}</h2>
            </div>

            <div className="flex items-center gap-6">
                <NotificationBell />

                <div className="flex items-center gap-3 border-l pl-6">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-gray-900">{session?.user?.name}</div>
                        <div className="text-xs text-gray-500">{session?.user?.role}</div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}
