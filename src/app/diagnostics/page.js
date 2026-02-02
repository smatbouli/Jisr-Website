'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function DiagnosticsPage() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const runDiagnostics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/diagnostics', { method: 'POST', body: JSON.stringify({ action: 'check' }) });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            setResults({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const fixAdmin = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/diagnostics', { method: 'POST', body: JSON.stringify({ action: 'fix_admin' }) });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            setResults({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">System Diagnostics</h1>
            <div className="space-x-4 mb-6">
                <Button onClick={runDiagnostics} disabled={loading}>Run Check</Button>
                <Button onClick={fixAdmin} disabled={loading} variant="secondary">Force Fix Admin</Button>
            </div>

            {loading && <div>Running...</div>}

            {results && (
                <div className="bg-gray-100 p-4 rounded overflow-auto border border-gray-300">
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
