'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/locales/en';
import { ar } from '@/locales/ar';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLanguage = 'en' }) {
    const [language, setLanguage] = useState(initialLanguage);

    const updateDirection = (lang) => {
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
        }
    };

    // Sync with initial language on mount if needed, or rely on server injection
    useEffect(() => {
        // If we are on the client, we might want to double check custom logic, 
        // but for now relying on the prop passed from layout is best for avoiding hydration mismatch.
        // We still update the document direction.
        updateDirection(language);
    }, [language]);

    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        setCookie('NEXT_LOCALE', newLang, 365); // Save for 1 year
        localStorage.setItem('language', newLang); // Keep for legacy compatibility if needed
        updateDirection(newLang);

        // Reloading is often safer to ensure all server components re-render with new locale
        // but for a SPA feel we can try without reload. 
        // However, since we are moving to server-side injection, a refresh might be needed 
        // for some parts if they were fully server-rendered and not dynamic.
        // For now, let's keep it client-side state update + cookie, 
        // effectively hybrid. Responsive immediately, next visit is persisted.
        window.location.reload();
    };

    const translations = { en, ar };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
