import { useState, useEffect } from 'react';
import { delay } from '@inventory/shared';
import { dashboardConfig } from './config/dashboard.config';

const App = () => {
    const [healthStatus, setHealthStatus] = useState('Checking...');
    const [serverTimestamp, setServerTimestamp] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const trackEvent = (signal, action, payload = {}) => {
        console.log(`[ANALYTICS] ${signal}: ${action}`, payload);
        // In Level 2, we would send this to the BE
    };

    useEffect(() => {
        trackEvent('PAGE_VIEW', 'DASHBOARD_LOAD');

        const fetchData = async () => {
            setIsLoading(true);
            try {
                await delay(300);
                const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

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
                            {dashboardConfig.title}
                        </h1>
                        <p className="text-slate-400 font-light flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span>{dashboardConfig.version} - Intermediate Mastery</span>
                        </p>
                    </div>

                    <button
                        onClick={() => trackEvent('BUTTON_CLICK', 'REFRESH_DATA')}
                        className="glass-card px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all font-medium text-sm"
                    >
                        Refresh Hub
                    </button>
                </header>

                <main className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {dashboardConfig.widgets.map(widget => (
                            <div key={widget.id} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 relative overflow-hidden group">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
                                    {widget.title}
                                </h3>
                                {widget.id === 'total_inventory' && (
                                    <div className="text-4xl font-mono text-white">0 <span className="text-xs text-slate-600 font-sans">ITEMS</span></div>
                                )}
                                {widget.id === 'system_health' && (
                                    <div className="text-sm font-medium">{healthStatus}</div>
                                )}
                                {widget.id === 'environment' && (
                                    <div className="text-sm font-mono text-slate-200 uppercase tracking-tighter bg-white/5 py-1 px-3 rounded inline-block border border-white/10">
                                        {import.meta.env.VITE_APP_ENV || 'Development'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-200 flex items-center space-x-3 mt-12">
                        <span>System Activity</span>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
                    </h2>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500 italic glass-card rounded-2xl border border-slate-800/50 mt-8">
                            Last encrypted sync: {serverTimestamp ? new Date(serverTimestamp).toLocaleTimeString() : 'Pending'}
                        </div>
                    )}
                </main>

                <footer className="mt-20 py-8 w-full border-t border-slate-800/50 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest text-center">
                    <div>Built by <span className="text-slate-300 font-bold">Antigravity</span> - Intentional Engineering &copy; 2026</div>
                </footer>
            </div>
        </div>
    );
};

export default App;
