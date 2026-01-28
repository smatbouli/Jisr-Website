'use client';

import { useState } from 'react';
import { updateFactoryProfile } from '@/app/actions/factory';
import styles from '@/app/signup/page.module.css';

export default function SettingsForm({ initialData }) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const hasPendingChanges = !!initialData?.pendingChanges;

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
