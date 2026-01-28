import AboutView from '@/components/AboutView';
import { getSiteContent } from '@/app/actions/content';

export const metadata = {
    title: 'About Us | Jisr B2B Marketplace',
    description: 'Learn about Jisr, the premier B2B marketplace for Saudi manufacturing.',
};

export default async function AboutPage() {
    const aboutContent = await getSiteContent('about_page');

    return <AboutView content={aboutContent} />;
}
