'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Shield, Ban, CheckCircle, Search, Filter } from 'lucide-react';
import { toggleUserBan } from '@/app/actions/admin';
import { useLanguage } from '@/components/LanguageContext';

export default function UserManagement({ initialUsers }) {
    const { t, language } = useLanguage();
    const isArabic = language === 'ar';
    const [filter, setFilter] = useState('ALL'); // ALL, FACTORY, BUYER, ADMIN, BANNED
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState(initialUsers);

    // Derived filtered users
    const filteredUsers = users.filter(user => {
        // Role/Status Filter
        if (filter === 'BANNED' && !user.isBanned) return false;
        if (filter !== 'ALL' && filter !== 'BANNED' && user.role !== filter) return false;

        // Search Filter
        if (search) {
            const term = search.toLowerCase();
            const email = user.email.toLowerCase();
            const businessName = (user.factoryProfile?.businessName || user.buyerProfile?.businessName || '').toLowerCase();
            return email.includes(term) || businessName.includes(term);
        }

        return true;
    });

    const exportCSV = () => {
        const headers = ["ID", "Email", "Role", "Business Name", "Status", "Joined Date"];
        const rows = filteredUsers.map(u => [
            u.id,
            u.email,
            u.role,
            u.factoryProfile?.businessName || u.buyerProfile?.businessName || '',
            u.isBanned ? 'BANNED' : 'ACTIVE',
            new Date(u.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`space-y-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                    <input
                        type="text"
                        placeholder={t('search_users_placeholder')}
                        className={`w-full py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button onClick={exportCSV} variant="outline" size="sm" className="whitespace-nowrap">
                        {t('export_csv')}
                    </Button>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    {['ALL', 'FACTORY', 'BUYER', 'ADMIN', 'BANNED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition whitespace-nowrap ${filter === f
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t(`filter_${f.toLowerCase()}`) || f}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 border-b border-gray-100">
                            <tr>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('user')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('role')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('business_name')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-right' : 'text-left'}`}>{t('status')}</th>
                                <th className={`p-4 font-semibold text-xs text-gray-500 uppercase ${isArabic ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-surface-50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{user.email}</div>
                                            <div className="text-xs text-gray-400 font-mono">{user.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'FACTORY' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.role === 'ADMIN' && <Shield size={10} />}
                                                {t(`role_${user.role.toLowerCase()}`) || user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {user.factoryProfile?.businessName || user.buyerProfile?.businessName || '-'}
                                        </td>
                                        <td className="p-4">
                                            {user.isBanned ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800">
                                                    <Ban size={10} /> {t('status_banned')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-green-100 text-green-800">
                                                    <CheckCircle size={10} /> {t('status_active')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {user.role !== 'ADMIN' && (
                                                <form action={async () => {
                                                    await toggleUserBan(user.id);
                                                    // Optimistic update locally
                                                    setUsers(prev => prev.map(u =>
                                                        u.id === user.id ? { ...u, isBanned: !u.isBanned } : u
                                                    ));
                                                }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={user.isBanned ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                                                    >
                                                        {user.isBanned ? 'Unban' : 'Ban'}
                                                    </Button>
                                                </form>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
