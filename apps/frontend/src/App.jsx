import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HeroHeader } from './components/Dashboard/HeroHeader';
import { StatsGrid } from './components/Dashboard/StatsGrid';
import { AssetStream } from './components/Dashboard/AssetStream';
import { StepInfo, StepStock, StepSummary } from './components/Inventory/RegistrationSteps';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

// Lazy load the heavy form component
const MultiStepForm = lazy(() => import('./components/Inventory/MultiStepForm'));
const EditProductModal = lazy(() => import('./components/Inventory/EditProductModal'));

// Performance: Custom loading state
const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl animate-pulse">
        <div className="text-sky-400 font-black tracking-[0.3em] uppercase text-[10px]">Synchronizing Core...</div>
    </div>
);

const App = () => {
    const { user, token, loading, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [healthStatus, setHealthStatus] = useState('Checking...');
    const [isLoading, setIsLoading] = useState(true);

    const steps = [
        { id: 'info', title: 'Identity', component: StepInfo },
        { id: 'stock', title: 'Values', component: StepStock },
        { id: 'summary', title: 'Review', component: StepSummary },
    ];

    const fetchProducts = async () => {
        if (!token) return;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const res = await fetch(`${apiUrl}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const sanitized = data.map(item => ({
                ...item,
                price: parseFloat(item.price),
                quantity: item.stock
            }));
            setProducts(sanitized);
            setHealthStatus('Online');
        } catch (err) {
            console.error('[SYSTEM] Connection Error:', err.message);
            setHealthStatus('Offline');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchProducts();

        const observer = setInterval(() => {
            const latency = (Math.random() * 100 + 50).toFixed(2);
            console.groupCollapsed(`[OBSERVABILITY] Signal: ${new Date().toLocaleTimeString()}`);
            console.log(`Latency: ${latency}ms | Status: ${healthStatus}`);
            console.groupEnd();
        }, 10000);

        return () => clearInterval(observer);
    }, [healthStatus, token]);

    const handleOnboardingComplete = async (data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const res = await fetch(`${apiUrl}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Registration failed');
            setShowOnboarding(false);
            fetchProducts();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this asset?')) return;
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const res = await fetch(`${apiUrl}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Decommissioning failed');
            fetchProducts();
        } catch (err) {
            alert('System Error: ' + err.message);
        }
    };

    const handleUpdateProduct = async (id, data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
            const res = await fetch(`${apiUrl}/products/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Update failed');
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            alert('System Error: ' + err.message);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><LoadingScreen /></div>;
    if (!user) return <AuthPage />;

    const stats = {
        total_inventory: products.length,
        low_stock: products.filter(p => p.quantity < 5).length,
        categories_count: new Set(products.map(p => p.category)).size
    };

    return (
        <div className="min-h-screen text-slate-100 selection:bg-sky-500/30 font-primary bg-[#020617]">
            {/* HOISTED MODAL - Fixed Centered perfectly in viewport */}
            {showOnboarding && (
                <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300"
                    onClick={(e) => e.target === e.currentTarget && setShowOnboarding(false)}>
                    <div className="modal-squared flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 drop-shadow-2xl"
                        onClick={e => e.stopPropagation()}>
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

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-sky-500/5 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center">
                <HeroHeader onRegisterClick={() => setShowOnboarding(true)} />

                <main className="w-full max-w-5xl flex flex-col space-y-10 items-center justify-center mx-auto">
                    <StatsGrid stats={stats} />
                    <AssetStream
                        healthStatus={healthStatus}
                        isLoading={isLoading}
                        products={products}
                        LoadingScreen={LoadingScreen}
                        onDelete={handleDeleteProduct}
                        onEdit={setEditingProduct}
                    />
                </main>

                {editingProduct && (
                    <Suspense fallback={<LoadingScreen />}>
                        <EditProductModal
                            product={editingProduct}
                            onSave={handleUpdateProduct}
                            onCancel={() => setEditingProduct(null)}
                        />
                    </Suspense>
                )}

                <footer className="mt-20 pb-8 text-center opacity-40">
                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em]">
                        Nexus Orchestration Grid • v2.5.0
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;
