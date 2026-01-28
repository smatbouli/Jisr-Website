import ContactView from '@/components/ContactView';
import { getSiteContent } from '@/app/actions/content';

export const metadata = {
    title: 'Contact Us | Jisr B2B Marketplace',
    description: 'Get in touch with the Jisr team for support or inquiries.',
};

export default async function ContactPage() {
    const contactContent = await getSiteContent('contact_page');

    return <ContactView content={contactContent} />;
}
