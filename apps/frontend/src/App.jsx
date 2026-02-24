import React, { useState, useEffect } from 'react';
import { dashboardConfig } from './config/dashboard.config';
import MultiStepForm from './components/Inventory/MultiStepForm';

// Slot Injection: Step Components
const StepInfo = ({ onNext, data, onCancel }) => (
    <form onSubmit={(e) => { e.preventDefault(); onNext({ name: e.target.name.value, sku: e.target.sku.value }); }}>
        <h3 className="text-xl font-bold mb-4">Product Identity</h3>
        <input name="name" defaultValue={data.name} placeholder="Product Name" required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl mb-4" />
        <input name="sku" defaultValue={data.sku} placeholder="SKU (e.g. WH-001)" required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl mb-8" />
        <div className="flex space-x-4">
            <button type="button" onClick={onCancel} className="flex-1 p-3 text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-cyan-600 p-3 rounded-xl font-bold hover:bg-cyan-500 transition-all">Next</button>
        </div>
    </form>
);

const StepStock = ({ onNext, onBack, data }) => (
    <form onSubmit={(e) => { e.preventDefault(); onNext({ price: parseFloat(e.target.price.value), stock: parseInt(e.target.stock.value) }); }}>
        <h3 className="text-xl font-bold mb-4">Quantity & Value</h3>
        <input name="price" type="number" step="0.01" defaultValue={data.price} placeholder="Price ($)" required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl mb-4" />
        <input name="stock" type="number" defaultValue={data.stock} placeholder="Initial Stock" required className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl mb-8" />
        <div className="flex space-x-4">
            <button type="button" onClick={onBack} className="flex-1 p-3 text-slate-400">Back</button>
            <button type="submit" className="flex-1 bg-cyan-600 p-3 rounded-xl font-bold">Review</button>
        </div>
    </form>
);

const StepSummary = ({ data, onNext, onBack }) => (
    <div>
        <h3 className="text-xl font-bold mb-4 text-emerald-400">Review Product</h3>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 mb-8 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span>{data.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">SKU</span><span>{data.sku}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Price</span><span>${data.price}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Stock</span><span>{data.stock}</span></div>
        </div>
        <div className="flex space-x-4">
            <button type="button" onClick={onBack} className="flex-1 p-3 text-slate-400">Back</button>
            <button onClick={() => onNext({})} className="flex-1 bg-emerald-600 p-3 rounded-xl font-bold">Confirm & Add</button>
        </div>
    </div>
);

const App = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [healthStatus, setHealthStatus] = useState('Checking...');

    const steps = [
        { id: 'info', title: 'Identity', component: StepInfo },
        { id: 'stock', title: 'Values', component: StepStock },
        { id: 'summary', title: 'Review', component: StepSummary },
    ];

    const trackEvent = (signal, action, payload = {}) => {
        console.log(`[ANALYTICS] ${signal}: ${action}`, payload);
    };

    useEffect(() => {
        trackEvent('PAGE_VIEW', 'DASHBOARD_LOAD');
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
                const healthRes = await fetch(`${apiUrl}/health`);
                const healthData = await healthRes.json();
                setHealthStatus(healthData.status === 'ok' ? 'Online' : 'Warning');
            } catch (err) { setHealthStatus('Offline'); }
        };
        fetchData();
    }, []);

    const handleOnboardingComplete = async (data) => {
        trackEvent('FUNNEL_COMPLETED', 'PRODUCT_ONBOARDING', data);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const res = await fetch(`${apiUrl}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create');
            alert('Product created successfully!');
            setShowOnboarding(false);
        } catch (err) {
            alert('Error: ' + err.message);
            trackEvent('STEP_FAILED', 'PRODUCT_ONBOARDING_SUBMIT', { error: err.message });
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center selection:bg-cyan-500/30">
            <div className="max-w-6xl w-full p-6 lg:p-12">
                <header className="flex justify-between items-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-500">
                            {dashboardConfig.title}
                        </h1>
                        <p className="mt-2 text-slate-500 font-medium flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${healthStatus === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                            <span>{healthStatus} • V{dashboardConfig.version}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => { setShowOnboarding(true); trackEvent('STEP_STARTED', 'PRODUCT_ONBOARDING'); }}
                        className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        New Product
                    </button>
                </header>

                {showOnboarding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                        <MultiStepForm
                            steps={steps}
                            onComplete={handleOnboardingComplete}
                            onCancel={() => setShowOnboarding(false)}
                        />
                    </div>
                )}

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {dashboardConfig.widgets.map((widget, i) => (
                        <div
                            key={widget.id}
                            className={`glass-card p-8 rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all duration-500 ${i === 0 ? 'lg:col-span-2' : ''}`}
                        >
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                                {widget.title}
                            </h3>
                            <div className="py-12 text-center text-slate-500 italic glass-card rounded-2xl border border-slate-800/50 mt-8">
                                System optimized for high-throughput inventory management
                            </div>
                            <div className="text-2xl font-semibold">
                                {widget.id === 'total_inventory' ? '0 items' : (widget.id === 'system_health' ? healthStatus : 'Production')}
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default App;
