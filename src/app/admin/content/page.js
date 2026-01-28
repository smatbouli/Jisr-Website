import { getSiteContent } from '@/app/actions/content';
import ContentPageClient from '@/components/admin/ContentPageClient';

export default async function AdminContentPage() {
    const heroContent = await getSiteContent('homepage_hero') || {
        title1: 'The heart of Saudi',
        highlight1: 'Manufacturing',
        title2: 'Connecting you to',
        highlight2: 'verified factories',
        description: 'Discover the power of local production. Connect directly with over 500+ verified Saudi factories and streamline your supply chain today.',
        ctaPrimary: 'Get Started',
        ctaSecondary: 'Browse Factories'
    };

    const headerContent = await getSiteContent('site_header') || {
        logoText: "Jisr"
    };

    const aboutContent = await getSiteContent('about_page') || {};
    const contactContent = await getSiteContent('contact_page') || {};

    return (
        <ContentPageClient
            initialHero={heroContent}
            initialHeader={headerContent}
            initialAbout={aboutContent}
            initialContact={contactContent}
        />
    );
}
