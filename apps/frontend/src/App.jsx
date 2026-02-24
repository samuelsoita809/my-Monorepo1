import React, { useState, useEffect } from 'react';
import { EVENTS, delay } from '@inventory/shared';

const App = () => {
    const [healthStatus, setHealthStatus] = useState('Checking...');
    const [serverTimestamp, setServerTimestamp] = useState('');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                await delay(500); // Verify shared utility
                const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
                const response = await fetch(`${apiUrl}/health`);
                const data = await response.json();
                setHealthStatus(data.status === 'ok' ? 'System Online ⚡' : 'System Degraded ⚠️');
                setServerTimestamp(data.timestamp);
            } catch (error) {
                setHealthStatus('Backend Offline 🔴');
            }
        };

        checkHealth();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-6 text-slate-100">
            <div className="glass-card max-w-2xl w-full p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"></div>

                <header className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Inventory Manager
                    </h1>
                    <p className="text-slate-400 font-light italic">System Architect Mastery: Phase 1</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Core Connectivity</h3>
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${healthStatus.includes('Online') ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                            <span className="text-lg font-medium tracking-tight">{healthStatus}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Server Timestamp</h3>
                        <span className="text-sm font-mono text-cyan-400">{serverTimestamp || 'Waiting for heartbeat...'}</span>
                    </div>
                </div>

                <footer className="mt-12 flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                        <span>Branch: <code className="text-slate-300">feature/foundations</code></span>
                        <span>Environment: <code className="text-slate-300 capitalize">{import.meta.env.VITE_APP_ENV || 'Development'}</code></span>
                    </div>
                    <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                        Zero-Error State
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default App;
