'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, CheckCircle, AlertCircle, FileText, AlertTriangle } from 'lucide-react';
import { submitVerification } from '@/app/actions/factory';
import { useLanguage } from '@/components/LanguageContext';

export default function VerificationForm({ factory }) {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [crFile, setCrFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [taxFile, setTaxFile] = useState(null);
    const [sasoFile, setSasoFile] = useState(null);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await submitVerification(formData);
            if (res.error) {
                setError(res.error);
                setLoading(false);
            } else {
                setSuccess('Verification request submitted successfully!');
                // Optional: Redirect or refresh page
                window.location.reload();
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Verification Documents</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('cr_number')} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="crNumber"
                            defaultValue={factory.crNumber}
                            placeholder={t('cr_placeholder')}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            required
                            dir="ltr" // Numbers usually LTR
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('license_number')} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="licenseNumber"
                            defaultValue={factory.licenseNumber}
                            placeholder={t('license_placeholder')}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            required
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('tax_number')} <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="taxNumber"
                            defaultValue={factory.taxNumber}
                            placeholder={t('tax_placeholder')}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            required
                            dir="ltr"
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="grid md:grid-cols-2 gap-6 pt-4">
                    {/* CR Document */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-400 transition-colors bg-gray-50/50 group">
                        <label className="cursor-pointer block text-center">
                            <input
                                type="file"
                                name="crDocument"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => setCrFile(e.target.files[0])}
                                required
                            />
                            <div className="mb-4 text-gray-400 group-hover:text-primary-500 transition-colors flex justify-center">
                                {crFile ? <FileText size={40} className="text-primary-600" /> : <Upload size={40} />}
                            </div>
                            <span className="block font-medium text-gray-900 mb-1">
                                {crFile ? crFile.name : t('upload_cr')} <span className="text-red-500">*</span>
                            </span>
                            <span className="block text-xs text-gray-500">
                                {crFile ? `${(crFile.size / 1024 / 1024).toFixed(2)} MB` : t('file_size_limit')}
                            </span>
                        </label>
                    </div>

                    {/* License Document */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-400 transition-colors bg-gray-50/50 group">
                        <label className="cursor-pointer block text-center">
                            <input
                                type="file"
                                name="licenseDocument"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => setLicenseFile(e.target.files[0])}
                                required
                            />
                            <div className="mb-4 text-gray-400 group-hover:text-primary-500 transition-colors flex justify-center">
                                {licenseFile ? <FileText size={40} className="text-primary-600" /> : <Upload size={40} />}
                            </div>
                            <span className="block font-medium text-gray-900 mb-1">
                                {licenseFile ? licenseFile.name : t('upload_license')} <span className="text-red-500">*</span>
                            </span>
                            <span className="block text-xs text-gray-500">
                                {licenseFile ? `${(licenseFile.size / 1024 / 1024).toFixed(2)} MB` : t('file_size_limit')}
                            </span>
                        </label>
                    </div>

                    {/* Tax Document */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-400 transition-colors bg-gray-50/50 group">
                        <label className="cursor-pointer block text-center">
                            <input
                                type="file"
                                name="taxDocument"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => setTaxFile(e.target.files[0])}
                                required
                            />
                            <div className="mb-4 text-gray-400 group-hover:text-primary-500 transition-colors flex justify-center">
                                {taxFile ? <FileText size={40} className="text-primary-600" /> : <Upload size={40} />}
                            </div>
                            <span className="block font-medium text-gray-900 mb-1">
                                {taxFile ? taxFile.name : t('upload_tax')} <span className="text-red-500">*</span>
                            </span>
                            <span className="block text-xs text-gray-500">
                                {taxFile ? `${(taxFile.size / 1024 / 1024).toFixed(2)} MB` : t('file_size_limit')}
                            </span>
                        </label>
                    </div>

                    {/* SASO Document */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary-400 transition-colors bg-gray-50/50 group">
                        <label className="cursor-pointer block text-center">
                            <input
                                type="file"
                                name="sasoDocument"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => setSasoFile(e.target.files[0])}
                            />
                            <div className="mb-4 text-gray-400 group-hover:text-primary-500 transition-colors flex justify-center">
                                {sasoFile ? <FileText size={40} className="text-primary-600" /> : <Upload size={40} />}
                            </div>
                            <span className="block font-medium text-gray-900 mb-1">
                                {sasoFile ? sasoFile.name : t('upload_saso')}
                            </span>
                            <span className="block text-xs text-gray-500">
                                {sasoFile ? `${(sasoFile.size / 1024 / 1024).toFixed(2)} MB` : t('file_size_limit')}
                            </span>
                        </label>
                    </div>
                </div>

                <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full bg-primary-600 hover:bg-primary-700" disabled={loading}>
                        {loading ? t('submitting') : t('submit_verification')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
