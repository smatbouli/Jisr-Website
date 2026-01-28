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
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${playfair.variable} ${notoSansArabic.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="pt-20">
        <Providers>
          <LanguageProvider initialLanguage={locale}>
            <Header initialLogoText={headerContent?.logoText} initialLogoUrl={headerContent?.logoUrl} />
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
