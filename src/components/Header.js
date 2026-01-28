'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "./NotificationBell";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

import { useLanguage } from "@/components/LanguageContext";

export default function Header({ initialLogoText, initialLogoUrl }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();
    const { t, toggleLanguage } = useLanguage();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/80 backdrop-blur-md border-gray-200 py-3 shadow-sm"
                    : "bg-white border-transparent py-5" // Start transparent-ish or clean white
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-primary-900 tracking-tight">
                    {initialLogoUrl ? (
                        <img src={initialLogoUrl} alt={initialLogoText || "Jisr"} className="h-10 w-auto object-contain" />
                    ) : (
                        <span>{initialLogoText || "Jisr"}</span>
                    )}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                        {t('Home')}
                    </Link>
                    <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                        {t('Products')}
                    </Link>
                    <Link href="/factories" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                        {t('Factories')}
                    </Link>
                    <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                        {t('How it Works')}
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                        {t('About Us')}
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                        {t('Contact Us')}
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-6 pl-6 border-l border-gray-200">
                            <Link href="/dashboard" className="text-sm font-medium text-primary-900 hover:text-primary-700 transition-colors">
                                {t('Dashboard')}
                            </Link>
                            <NotificationBell />
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-bold text-gray-900">{session.user.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{session.user.role}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    {t('Sign Out')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 pl-4">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
                                {t('Login')}
                            </Link>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => window.location.href = '/signup'}
                                className="rounded-full px-6"
                            >
                                {t('Get Started')}
                            </Button>
                        </div>
                    )}
                    <button
                        onClick={toggleLanguage}
                        className="text-sm font-bold text-gray-400 hover:text-primary-900 transition-colors"
                    >
                        {t('Switch Language')}
                    </button>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 flex flex-col gap-4 shadow-xl md:hidden">
                    <Link href="/" className="text-base font-medium text-gray-700 py-2">{t('Home')}</Link>
                    <Link href="/products" className="text-base font-medium text-gray-700 py-2">{t('Products')}</Link>
                    <Link href="/factories" className="text-base font-medium text-gray-700 py-2">{t('Factories')}</Link>
                    <Link href="/how-it-works" className="text-base font-medium text-gray-700 py-2">{t('How it Works')}</Link>
                    <Link href="/about" className="text-base font-medium text-gray-700 py-2">{t('About Us')}</Link>
                    <Link href="/contact" className="text-base font-medium text-gray-700 py-2">{t('Contact Us')}</Link>
                    <div className="h-px bg-gray-100" />
                    {session ? (
                        <>
                            <Link href="/dashboard" className="text-base font-medium text-primary-900 py-2">{t('Dashboard')}</Link>
                            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-base font-medium text-red-600 py-2 text-left">{t('Sign Out')}</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-base font-medium text-gray-700 py-2">{t('Login')}</Link>
                            <Link href="/signup" className="text-base font-medium text-primary-900 py-2">{t('Get Started')}</Link>
                        </>
                    )}
                    <button onClick={toggleLanguage} className="text-base font-medium text-gray-700 py-2 text-left">
                        {t('Switch Language')}
                    </button>
                </div>
            )}
        </header>
    );
}
