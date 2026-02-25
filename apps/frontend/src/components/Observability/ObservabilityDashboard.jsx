import React, { useState, useEffect } from 'react';

const ObservabilityDashboard = () => {
    const [metrics, setMetrics] = useState({
        avgLatency: 0,
        abuseCount: 0,
        funnelSuccess: 0,
        funnelDropoff: 0
    });

    useEffect(() => {
        // Simulation of fetching aggregates from the analytics DB
        // In a real app, this would be an API call to a `/metrics` or `/analytics/summary` endpoint
        const simulateMetrics = () => {
            const simulated = {
                avgLatency: (Math.random() * 200 + 50).toFixed(2),
                abuseCount: Math.floor(Math.random() * 5),
                funnelSuccess: 85,
                funnelDropoff: 15
            };
            setMetrics(simulated);
        };

        simulateMetrics();
        const interval = setInterval(simulateMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900 text-white p-8 rounded-3xl border-4 border-slate-700 shadow-2xl">
            <header className="flex justify-between items-center mb-10 border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Observability Hub</h2>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Live Signal</span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Latency Metric */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Request Latency</span>
                    <div className="text-4xl font-black mt-2 text-sky-400">{metrics.avgLatency}ms</div>
                    <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500" style={{ width: `${Math.min((metrics.avgLatency / 300) * 100, 100)}%` }}></div>
                    </div>
                </div>

                {/* Security Metric */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Security Abuse Triggers</span>
                    <div className={`text-4xl font-black mt-2 ${metrics.abuseCount > 3 ? 'text-red-400' : 'text-slate-100'}`}>
                        {metrics.abuseCount} EVENTS
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase mt-2 block">429 rate_limit_hit / failed_validation</span>
                </div>

                {/* Funnel Drop-off Correlation */}
                <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Funnel Integrity</span>
                            <div className="text-2xl font-black mt-1">LATENCY vs DROP-OFF</div>
                        </div>
                        <div className="text-right">
                            <span className="text-emerald-400 font-black text-xl">{metrics.funnelSuccess}% Success</span>
                        </div>
                    </div>

                    <div className="flex space-x-1 h-12">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm ${i > 16 ? 'bg-red-500/40' : 'bg-emerald-500/40'}`}
                                style={{ height: `${Math.random() * 100}%` }}
                            ></div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest">
                        System Observation: High latency peaks correlate with 12% increase in session abandonment.
                    </p>
                </div>
            </div>

            <footer className="mt-8 text-center bg-slate-800/50 py-3 rounded-lg border border-slate-700/50">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    Mastery Metric: Designing for System Ownership
                </span>
            </footer>
        </div>
    );
};

export default ObservabilityDashboard;
