import React, { useState, useEffect, Suspense, lazy } from 'react';
import { dashboardConfig } from './config/dashboard.config';
import { EVENTS } from '@inventory/shared';

// Lazy load the heavy form component
const MultiStepForm = lazy(() => import('./components/Inventory/MultiStepForm'));

// Performance: Custom loading state
const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center p-20 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl animate-pulse">
        <div className="text-slate-400 font-black tracking-widest uppercase">Initializing Layer...</div>
    </div>
);

// Step components simplified for light-themed modal card
const StepInfo = ({ onNext, data, onCancel }) => (
    <form onSubmit={(e) => { e.preventDefault(); onNext({ name: e.target.name.value, sku: e.target.sku.value }); }}>
        <h3 className="text-2xl font-black mb-6 text-slate-900 border-b-4 border-slate-900 pb-2 inline-block">Product Identity</h3>
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest" htmlFor="name">PRODUCT NAME</label>
                <input id="name" name="name" defaultValue={data.name} placeholder="e.g. NVIDIA H100 GPU" required className="input-field" aria-label="Product Name" />
            </div>
            <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest" htmlFor="sku">SKU IDENTIFIER</label>
                <input id="sku" name="sku" defaultValue={data.sku} placeholder="e.g. WH-GPU-001" required className="input-field" aria-label="SKU Identifier" />
            </div>
        </div>
        <div className="flex space-x-4 mt-10">
            <button type="button" onClick={onCancel} className="flex-1 py-3 text-slate-500 font-black tracking-widest hover:text-red-500 transition-colors">CANCEL</button>
            <button type="submit" className="flex-1 system-button-primary uppercase tracking-widest">Next Step</button>
        </div>
    </form>
);

const StepStock = ({ onNext, onBack, data }) => (
    <form onSubmit={(e) => { e.preventDefault(); onNext({ price: parseFloat(e.target.price.value), stock: parseInt(e.target.stock.value) }); }}>
        <h3 className="text-2xl font-black mb-6 text-slate-900 border-b-4 border-slate-900 pb-2 inline-block">Quantity & Value</h3>
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest" htmlFor="price">UNIT PRICE (USD)</label>
                <input id="price" name="price" type="number" step="0.01" defaultValue={data.price} placeholder="0.00" required className="input-field" aria-label="Unit Price" />
            </div>
            <div>
                <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest" htmlFor="stock">INITIAL STOCK</label>
                <input id="stock" name="stock" type="number" defaultValue={data.stock} placeholder="0" required className="input-field" aria-label="Initial Stock" />
            </div>
        </div>
        <div className="flex space-x-4 mt-10">
            <button type="button" onClick={onBack} className="flex-1 py-3 text-slate-500 font-black tracking-widest">BACK</button>
            <button type="submit" className="flex-1 system-button-primary uppercase tracking-widest">Review</button>
        </div>
    </form>
);

const StepSummary = ({ data, onNext, onBack }) => (
    <div>
        <h3 className="text-2xl font-black mb-6 text-emerald-700 border-b-4 border-emerald-700 pb-2 inline-block">Final Review</h3>
        <div className="bg-emerald-50 p-6 rounded-xl border-2 border-emerald-200 mb-8 space-y-4">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-2"><span className="text-emerald-900 font-bold text-xs uppercase">Product</span><span className="font-black text-slate-900">{data.name}</span></div>
            <div className="flex justify-between items-center border-b border-emerald-100 pb-2"><span className="text-emerald-900 font-bold text-xs uppercase">SKU</span><span className="font-black text-slate-900">{data.sku}</span></div>
            <div className="flex justify-between items-center border-b border-emerald-100 pb-2"><span className="text-emerald-900 font-bold text-xs uppercase">Price</span><span className="font-black text-emerald-700 text-xl">${data.price}</span></div>
            <div className="flex justify-between items-center"><span className="text-emerald-900 font-bold text-xs uppercase">Stock</span><span className="font-black text-slate-900">{data.stock} units</span></div>
        </div>
        <div className="flex space-x-4">
            <button type="button" onClick={onBack} className="flex-1 py-3 text-slate-500 font-black tracking-widest">BACK</button>
            <button onClick={() => onNext({})} className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-lg hover:bg-emerald-700 transition-all shadow-lg uppercase tracking-widest">Confirm & Add</button>
        </div>
    </div>
);

const ObservabilityDashboard = lazy(() => import('./components/Observability/ObservabilityDashboard'));

const App = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showObservability, setShowObservability] = useState(false);
    const [healthStatus, setHealthStatus] = useState('Checking...');

    const steps = [
        { id: 'info', title: 'Identity', component: StepInfo },
        { id: 'stock', title: 'Values', component: StepStock },
        { id: 'summary', title: 'Review', component: StepSummary },
    ];

    useEffect(() => {
        const startTime = performance.now();
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
                const healthRes = await fetch(`${apiUrl}/health`);
                const healthData = await healthRes.json();
                setHealthStatus(healthData.status === 'ok' ? 'Online' : 'Warning');

                // Track Performance
                const loadTime = performance.now() - startTime;
                console.log(`[PERF] Frontend Latency: ${loadTime.toFixed(2)}ms`);
            } catch (err) { setHealthStatus('Offline'); }
        };
        fetchData();
    }, []);

    const handleSimulationFailure = async () => {
        if (confirm("SYSTEM OWNER ALERT: Simulating critical backend failure will degrade the system. Proceed?")) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
                // Trigger a special endpoint or just simulate locally for the demo
                setHealthStatus('Degraded (Offline)');
                alert("Simulated Failure complete. System currently in DEGRADED mode.");
            } catch (err) { console.error(err); }
        }
    };

    const handleOnboardingComplete = async (data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const res = await fetch(`${apiUrl}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create product');
            alert('Success! Product registered.');
            setShowOnboarding(false);
        } catch (err) {
            alert('API Error: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans p-6 md:p-12 lg:p-20">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 border-b-8 border-slate-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Inventory Cmd
                        </h1>
                        <div className="mt-4 flex items-center space-x-4">
                            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${healthStatus === 'Online' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                {healthStatus}
                            </span>
                            <span
                                onClick={() => setShowObservability(!showObservability)}
                                className="cursor-pointer text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                {showObservability ? '[ CLOSE HUB ]' : '[ OPEN OBSERVABILITY HUB ]'}
                            </span>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-8 md:mt-0">
                        <button
                            onClick={handleSimulationFailure}
                            className="system-button-secondary text-xs px-6 py-5 uppercase tracking-widest border-2 border-slate-300 text-slate-400 hover:border-red-500 hover:text-red-500"
                        >
                            Simulate Failure
                        </button>
                        <button
                            onClick={() => setShowOnboarding(true)}
                            className="system-button-primary text-xl px-12 py-5 shadow-[8px_8px_0_0_#0f172a] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                        >
                            + REGISTER PRODUCT
                        </button>
                    </div>
                </header>

                {showObservability && (
                    <div className="mb-16 animate-in slide-in-from-top duration-500">
                        <Suspense fallback={<LoadingScreen />}>
                            <ObservabilityDashboard />
                        </Suspense>
                    </div>
                )}

                {showOnboarding && (
                    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowOnboarding(false)}>
                        <div className="w-full max-w-xl animate-in zoom-in duration-200">
                            <Suspense fallback={<LoadingScreen />}>
                                <MultiStepForm
                                    steps={steps}
                                    onComplete={handleOnboardingComplete}
                                    onCancel={() => setShowOnboarding(false)}
                                />
                            </Suspense>
                        </div>
                    </div>
                )}

                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {dashboardConfig.widgets.map((widget) => (
                        <div key={widget.id} className="system-card flex flex-col justify-between min-h-[220px] transition-all hover:border-slate-900 hover:scale-[1.02]">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                                {widget.title}
                            </h3>
                            <div className="text-4xl font-black text-slate-900 break-words line-clamp-2">
                                {widget.id === 'total_inventory' ? '0 UNITS' : (widget.id === 'system_health' ? healthStatus : 'PRIMARY NODE')}
                            </div>
                            <div className="mt-8 pt-4 border-t-2 border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-300 uppercase italic">status: verified</span>
                                <span className="text-slate-900 text-xl font-black">→</span>
                            </div>
                        </div>
                    ))}
                </main>

                <footer className="mt-32 text-slate-300 text-xs font-black uppercase tracking-[0.5em] text-center italic">
                    System architect mastery • high-visibility node
                </footer>
            </div>
        </div>
    );
};

export default App;
