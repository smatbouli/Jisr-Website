import { Inter, Playfair_Display, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Standard name for body font
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading", // Standard name for heading font
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata = {
  title: "Jisr | Saudi B2B Marketplace",
  description: "Connecting verified Saudi factories with businesses. The premium platform for 'Made in Saudi' manufacturing.",
};

import Providers from "@/components/Providers";
import Header from "@/components/Header";
import { LanguageProvider } from "@/components/LanguageContext";
import { getSiteContent } from "@/app/actions/content";
import { cookies } from "next/headers";


export default async function RootLayout({ children }) {
  const headerContent = await getSiteContent('site_header');

  // Fetch all dynamic content
  const heroContent = await getSiteContent('homepage_hero');
  const aboutContent = await getSiteContent('about_page');
  const contactContent = await getSiteContent('contact_page');
  // New generalized content block for other homepage sections
  const otherContent = await getSiteContent('homepage_content');

  // Helper to merge content into { en: {}, ar: {} } structure
  const mergeContent = (source = {}, target = { en: {}, ar: {} }) => {
    if (!source) return target;
    Object.keys(source).forEach(key => {
      // Convention: key_en, key_ar
      if (key.endsWith('_en')) {
        const baseKey = key.replace('_en', '');
        target.en[baseKey] = source[key];
      } else if (key.endsWith('_ar')) {
        const baseKey = key.replace('_ar', '');
        target.ar[baseKey] = source[key];
      } else {
        // If no suffix, it might be common or handle separately. 
        // For hero, we might have specific mapping or stick to strict naming locally.
        // For 'hero', currently structure is { title1, highlight1... }
        // We will need to update ContentEditor to save as title1_en, title1_ar etc if we want full dynamic.
        // Or we map manually for now for specific legacy keys.
        target.en[key] = source[key];
        target.ar[key] = source[key]; // Fallback/Common
      }
    });
    return target;
  };

  const dynamicTranslations = { en: {}, ar: {} };
  mergeContent(heroContent, dynamicTranslations);
  mergeContent(aboutContent, dynamicTranslations);
  mergeContent(contactContent, dynamicTranslations);
  mergeContent(otherContent, dynamicTranslations);

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${playfair.variable} ${notoSansArabic.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <LanguageProvider initialLanguage={locale} dynamicTranslations={dynamicTranslations}>
            <Header initialLogoText={headerContent?.logoText} initialLogoUrl={headerContent?.logoUrl} />
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
