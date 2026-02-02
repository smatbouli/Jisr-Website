'use client';

import { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markAsRead } from '@/app/actions/notification';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function NotificationBell({ iconColor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Initial fetch of count
    useEffect(() => {
        const fetchCount = async () => {
            const count = await getUnreadCount();
            setUnreadCount(count);
        };
        fetchCount();

        // Poll every 30 seconds
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Toggle dropdown and fetch notifications
    const toggleDropdown = async () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            const data = await getNotifications();
            setNotifications(data);
        }
    };

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleRead = async (id, link) => {
        await markAsRead(id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setIsOpen(false);
        // Navigate happens automatically via Link
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={`relative p-2 rounded-full hover:bg-black/5 transition ${iconColor || 'text-gray-600'}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-xl z-50">
                    <div className="p-3 border-b font-semibold text-gray-700 flex justify-between">
                        <span>Notifications</span>
                        <span className="text-xs text-gray-400 font-normal">Recent 20</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No notifications.
                            </div>
                        ) : (
                            notifications.map(note => (
                                <Link
                                    key={note.id}
                                    href={note.link || '#'}
                                    onClick={() => handleRead(note.id, note.link)}
                                    className={`block p-3 border-b hover:bg-gray-50 transition ${!note.read ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-sm text-gray-800">{note.title}</span>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{note.message}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
