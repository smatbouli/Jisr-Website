'use client';
import { useState } from 'react';

export default function SimplePage() {
    const [status, setStatus] = useState('Waiting...');

    const check = async () => {
        try {
            const res = await fetch('/api/diagnostics', {
                method: 'POST',
                body: JSON.stringify({ action: 'check_session' })
            });
            const data = await res.json();
            setStatus(JSON.stringify(data, null, 2));
        } catch (e) {
            setStatus('Error: ' + e.message);
        }
    };

    return (
        <div style={{ padding: 50, fontFamily: 'monospace' }}>
            <h1>Session Checker</h1>
            <button
                onClick={check}
                style={{ padding: '10px 20px', background: 'blue', color: 'white', marginBottom: 20 }}
            >
                Check Session
            </button>
            <pre style={{ background: '#eee', padding: 20 }}>{status}</pre>
        </div>
    );
}
