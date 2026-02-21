'use client';

import { useState } from 'react';
import { updateFactoryProfile } from '@/app/actions/factory';
import styles from '@/app/signup/page.module.css';
import { Camera } from 'lucide-react';
import Image from 'next/image';

export default function SettingsForm({ initialData }) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(initialData?.logoUrl || null);

    const hasPendingChanges = !!initialData?.pendingChanges;

    function handleLogoChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    async function handleSubmit(formData) {
        setLoading(true);
        setMessage('');
        setError('');

        const result = await updateFactoryProfile(formData);

        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else {
            setMessage(result.success);
        }
    }

    return (
        <form action={handleSubmit} className={styles.form}>
            {hasPendingChanges && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                You have changes pending administrative approval. Your profile will update once they are accepted.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 group cursor-pointer">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl text-gray-400 font-bold opacity-50">
                                {initialData?.businessName?.charAt(0) || '?'}
                            </span>
                        )}
                    </div>
                    <label htmlFor="logo-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-sm">
                        <Camera size={24} className="mr-1" />
                        <span className="sr-only">Change Logo</span>
                    </label>
                    <input
                        id="logo-upload"
                        name="logo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                    />
                </div>
                <p className="text-sm text-gray-500 font-medium">Company Logo</p>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Business Name (English)</label>
                <input
                    name="businessName"
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Saudi Steel Co."
                    required
                    defaultValue={initialData?.businessName || ''}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Business Name (Arabic)</label>
                <input
                    name="businessNameAr"
                    type="text"
                    className={styles.input}
                    placeholder="ex. شركة الصلب السعودية"
                    defaultValue={initialData?.businessNameAr || ''}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>Industry</label>
                    <select
                        name="industry"
                        className={styles.input}
                        required
                        defaultValue={initialData?.industry || ''}
                    >
                        <option value="">Select Industry</option>
                        <option value="Construction">Construction Materials</option>
                        <option value="Plastics">Plastics & Rubber</option>
                        <option value="Food">Food & Beverage</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Chemicals">Chemicals</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Machinery">Machinery & Equipment</option>
                        <option value="Electronics">Electronics</option>
                    </select>
                </div>

                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label className={styles.label}>City</label>
                    <select
                        name="city"
                        className={styles.input}
                        required
                        defaultValue={initialData?.city || ''}
                    >
                        <option value="">Select City</option>
                        <option value="Riyadh">Riyadh</option>
                        <option value="Jeddah">Jeddah</option>
                        <option value="Dammam">Dammam</option>
                        <option value="Jubail">Jubail</option>
                        <option value="Mecca">Mecca</option>
                        <option value="Medina">Medina</option>
                    </select>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Commercial Registration (CR) Number</label>
                <input
                    name="crNumber"
                    type="text"
                    className={styles.input}
                    placeholder="1010xxxxxx"
                    defaultValue={initialData?.crNumber || ''}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>About Company</label>
                <textarea
                    name="description"
                    className={styles.input}
                    rows="4"
                    placeholder="Describe your capabilities, history, and key products..."
                    style={{ resize: 'vertical', minHeight: '100px' }}
                    defaultValue={initialData?.description || ''}
                ></textarea>
            </div>

            {message && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded text-center">{message}</div>}
            {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded text-center">{error}</div>}

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
}
