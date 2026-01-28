import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';
import { redirect } from 'next/navigation';
import VerificationForm from '@/components/VerificationForm';

export default async function FactoryVerificationPage() {
    const session = await auth();
    if (!session) return redirect('/login');

    const factory = await prisma.factoryProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!factory) return <div>Factory profile not found.</div>;

    const status = factory.verificationStatus;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-heading font-bold text-gray-900">Verification Status</h1>
                <p className="text-gray-600 mt-2">Manage your verification badge and trust level.</p>
            </div>

            <Card className="p-8 text-center">
                {status === 'VERIFIED' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-green-700 mb-2">You are Verified!</h2>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            Your factory has the Golden Badge. You appear at the top of search results and have higher trust with buyers.
                        </p>
                        <div className="bg-surface-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-500">
                            Verified on: {new Date(factory.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                )}

                {status === 'PENDING' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                            <Clock size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-amber-700 mb-2">Under Review</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Our team is currently reviewing your documents. This process usually takes 24-48 hours. You will be notified once complete.
                        </p>
                    </div>
                )}

                {(status === 'UNVERIFIED' || status === 'REJECTED') && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mb-6">
                            <ShieldAlert size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Verified</h2>
                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                            Upload your Commercial Registration (CR) and detailed company info to get the Golden Badge and unlimited RFQ access.
                        </p>

                        {status === 'REJECTED' && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-700 mb-6 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Previous application was rejected. Please check your details and try again.
                            </div>
                        )}

                        <div className="w-full">
                            {/* Import VerificationForm dynamically to avoid SSR issues if any, though regular import is fine here since it's client component */}
                            <VerificationForm factory={factory} />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
