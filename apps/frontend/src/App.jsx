import { useState, useEffect } from 'react';
import { delay } from '@inventory/shared';

const App = () => {
    const [healthStatus, setHealthStatus] = useState('Checking...');
    const [serverTimestamp, setServerTimestamp] = useState(null);
    const [inventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await delay(300); // Aesthetic delay
                const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

                // Fetch health
                const healthRes = await fetch(`${apiUrl}/health`);
                const healthData = await healthRes.json();
                setHealthStatus(healthData.status === 'ok' ? 'System Online ⚡' : 'System Degraded ⚠️');
                setServerTimestamp(healthData.timestamp);
            } catch (error) {
                setHealthStatus('Backend Offline 🔴');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center p-6 text-slate-100">
            <div className="max-w-6xl w-full">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                            Inventory Manager
                        </h1>
                        <p className="text-slate-400 font-light flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span>Command Center v2.0 - Phase 2: Architecture & Scale</span>
                        </p>
                    </div>

                    <div className="glass-card px-6 py-3 rounded-2xl border border-white/5 flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Network Status</div>
                            <div className="text-sm font-medium">{healthStatus}</div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${healthStatus.includes('Online') ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                    </div>
                </header>

                <main className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Total Inventory</h3>
                            <div className="text-4xl font-mono text-white">{inventory.length} <span className="text-xs text-slate-600 font-sans">ITEMS</span></div>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Last Sync</h3>
                            <div className="text-sm font-mono text-cyan-400">{serverTimestamp ? new Date(serverTimestamp).toLocaleTimeString() : '...'}</div>
                        </div>

                        <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Environment</h3>
                            <div className="text-sm font-mono text-slate-200 uppercase tracking-tighter bg-white/5 py-1 px-3 rounded inline-block border border-white/10">
                                {import.meta.env.VITE_APP_ENV || 'Development'}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-200 flex items-center space-x-3">
                        <span>Inventory Records</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
                    </h2>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                            <p className="text-slate-500 animate-pulse font-mono text-xs">Accessing encrypted archives...</p>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500 italic glass-card rounded-2xl border border-slate-800/50 mt-8">
                            No items found in the inventory system.
                        </div>
                    )}
                </main>

                <footer className="mt-20 py-8 w-full border-t border-slate-800/50 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center space-x-2">
                            <span className="text-slate-700">BRANCH</span>
                            <code className="text-slate-400 normal-case bg-slate-800/50 px-2 py-1 rounded">feature/frontend-ui</code>
                        </span>
                        <span className="flex items-center space-x-2">
                            <span className="text-slate-700">STATUS</span>
                            <span className="text-emerald-500 font-bold">ZERO-ERROR ACTIVE</span>
                        </span>
                    </div>
                    <div>
                        Built by <span className="text-slate-300 font-bold">Antigravity</span> &copy; 2026
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default App;
