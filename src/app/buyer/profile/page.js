import { redirect } from 'next/navigation';

export default function BuyerProfileRedirect() {
    redirect('/buyer/settings');
}
