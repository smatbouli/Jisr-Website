import prisma from '@/lib/prisma';
import { approveFactory, approveChanges, rejectChanges, revokeVerification } from '@/app/actions/admin';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle, XCircle, Building2, MapPin, FileText, AlertTriangle } from 'lucide-react';

export default async function ReviewFactoryPage({ params }) {
    const { id } = await params;
    const factory = await prisma.factoryProfile.findUnique({
        where: { id }
    });

    if (!factory) return <div className="p-8">Factory not found</div>;

    const pendingChanges = factory.pendingChanges ? JSON.parse(factory.pendingChanges) : null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Link href="/admin/verification" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-900 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Queue
            </Link>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 mb-1">Review: {factory.businessName}</h1>
                    <p className="text-gray-500">ID: <span className="font-mono text-xs">{factory.id}</span></p>
                </div>
            </div>

            {/* Scenario C: Already Verified (Unverify Option) */}
            {!pendingChanges && factory.verificationStatus === 'VERIFIED' && (
                <Card className="p-8 border-t-4 border-t-green-600">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-50 rounded-full text-green-700">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Verified Factory</h2>
                            <p className="text-gray-500 text-sm">This factory has the Golden Badge and full access.</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Verification Date</p>
                            <p className="font-medium text-gray-900">{new Date(factory.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <Link href={`/factories/${factory.id}`} target="_blank">
                                <Button variant="outline" size="sm">View Public Profile</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Industry</label>
                                <p className="text-lg font-medium text-gray-900">{factory.industry}</p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Commercial Registration (CR)</label>
                                <p className="text-lg font-medium text-gray-900 font-mono">{factory.crNumber || 'Not Provided'}</p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Industrial License</label>
                                <p className="text-lg font-medium text-gray-900 font-mono">{factory.licenseNumber || 'Not Provided'}</p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">VAT/Tax Number</label>
                                <p className="text-lg font-medium text-gray-900 font-mono">{factory.taxNumber || 'Not Provided'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Location</label>
                                <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" /> {factory.city}
                                </p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Documents</label>
                                <div className="space-y-2 mt-2">
                                    {factory.crDocumentUrl ? (
                                        <a href={factory.crDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> Commercial Registration (CR)
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No CR Uploaded</span>}

                                    {factory.licenseDocumentUrl ? (
                                        <a href={factory.licenseDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> Industrial License
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No License Uploaded</span>}

                                    {factory.taxDocumentUrl ? (
                                        <a href={factory.taxDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> VAT/Tax Certificate
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No Tax Certificate</span>}

                                    {factory.sasoDocumentUrl ? (
                                        <a href={factory.sasoDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> SASO/SABER Certificate
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No SASO Certificate</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <form action={revokeVerification.bind(null, factory.id)}>
                            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                <XCircle className="mr-2" size={18} /> Revoke Verification
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Scenario A: New Factory Verification */}
            {!pendingChanges && factory.verificationStatus !== 'VERIFIED' && (
                <Card className="p-8 border-t-4 border-t-primary-600">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 rounded-full text-primary-700">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">New Registration Request</h2>
                            <p className="text-gray-500 text-sm">Review credentials before granting verified status.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Industry</label>
                                <p className="text-lg font-medium text-gray-900">{factory.industry}</p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Commercial Registration (CR)</label>
                                <p className="text-lg font-medium text-gray-900 font-mono">{factory.crNumber || 'Not Provided'}</p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">VAT/Tax Number</label>
                                <p className="text-lg font-medium text-gray-900 font-mono">{factory.taxNumber || 'Not Provided'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Location</label>
                                <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" /> {factory.city}
                                </p>
                            </div>
                            <div className="pb-4 border-b border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Documents</label>
                                <div className="space-y-2 mt-2">
                                    {factory.crDocumentUrl ? (
                                        <a href={factory.crDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> Commercial Registration (CR)
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No CR Uploaded</span>}

                                    {factory.licenseDocumentUrl ? (
                                        <a href={factory.licenseDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> Industrial License
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No License Uploaded</span>}

                                    {factory.taxDocumentUrl ? (
                                        <a href={factory.taxDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> VAT/Tax Certificate
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No Tax Certificate</span>}

                                    {factory.sasoDocumentUrl ? (
                                        <a href={factory.sasoDocumentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-600 hover:underline">
                                            <FileText size={16} /> SASO/SABER Certificate
                                        </a>
                                    ) : <span className="text-gray-400 text-sm">No SASO Certificate</span>}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-surface-50 p-6 rounded-lg">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Company Description</label>
                            <p className="text-gray-700 leading-relaxed">{factory.description}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                        <Link href={`/factories/${factory.id}`} target="_blank">
                            <Button variant="outline">View Public Profile</Button>
                        </Link>
                        <form action={approveFactory.bind(null, factory.id)}>
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 border-none shadow-green-900/20">
                                <CheckCircle className="mr-2" size={18} /> Approve & Verify
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Scenario B: Pending Changes Approval */}
            {pendingChanges && (
                <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 text-amber-800">
                        <AlertTriangle className="shrink-0" />
                        <div>
                            <p className="font-bold">Profile Update Request</p>
                            <p className="text-sm">This verified factory has requested changes. Review the differences below.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Current State */}
                        <Card className="opacity-70 bg-gray-50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wide">Current Profile</h3>
                                <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">Live</span>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">Business Name</label>
                                    <div className="font-medium text-gray-700">{factory.businessName}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">Industry</label>
                                    <div className="font-medium text-gray-700">{factory.industry}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">City</label>
                                    <div className="font-medium text-gray-700">{factory.city}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">Description</label>
                                    <div className="text-sm text-gray-600 line-clamp-4">{factory.description}</div>
                                </div>
                            </div>
                        </Card>

                        {/* Proposed State */}
                        <Card className="ring-2 ring-blue-500 shadow-blue-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-blue-600 uppercase text-xs tracking-wide flex items-center gap-2">
                                    <FileText size={14} /> Proposed Changes
                                </h3>
                                <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">Pending</span>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">Business Name</label>
                                    <div className={`font-medium text-gray-900 p-1 rounded -ml-1 ${pendingChanges.businessName !== factory.businessName ? 'bg-yellow-100 ring-1 ring-yellow-200' : ''}`}>
                                        {pendingChanges.businessName}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">Industry</label>
                                    <div className={`font-medium text-gray-900 p-1 rounded -ml-1 ${pendingChanges.industry !== factory.industry ? 'bg-yellow-100 ring-1 ring-yellow-200' : ''}`}>
                                        {pendingChanges.industry}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">City</label>
                                    <div className={`font-medium text-gray-900 p-1 rounded -ml-1 ${pendingChanges.city !== factory.city ? 'bg-yellow-100 ring-1 ring-yellow-200' : ''}`}>
                                        {pendingChanges.city}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">Description</label>
                                    <div className={`text-sm text-gray-600 p-1 rounded -ml-1 ${pendingChanges.description !== factory.description ? 'bg-yellow-100 ring-1 ring-yellow-200' : ''}`}>
                                        {pendingChanges.description}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        <form action={rejectChanges.bind(null, factory.id)}>
                            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <XCircle className="mr-2" size={18} /> Reject Changes
                            </Button>
                        </form>
                        <form action={approveChanges.bind(null, factory.id)}>
                            <Button className="bg-blue-600 hover:bg-blue-700 border-none">
                                <CheckCircle className="mr-2" size={18} /> Approve Changes
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
