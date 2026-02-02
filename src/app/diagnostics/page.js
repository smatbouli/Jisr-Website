'use client';

import { useState } from 'react';

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

    const checkSession = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/diagnostics', { method: 'POST', body: JSON.stringify({ action: 'check_session' }) });
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
                <button
                    onClick={runDiagnostics}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Run Check
                </button>
                <button
                    onClick={fixAdmin}
                    disabled={loading}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                    Force Fix Admin
                </button>
                <button
                    onClick={checkSession}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Check Session
                </button>
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
