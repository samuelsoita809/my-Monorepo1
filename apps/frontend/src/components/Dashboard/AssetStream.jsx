import React, { Suspense, lazy } from 'react';

const InventoryTable = lazy(() => import('../Inventory/InventoryTable'));

export const AssetStream = ({ healthStatus, isLoading, products, LoadingScreen }) => (
    <section className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl w-full">
        <div className="px-8 py-6 border-b border-white/5 flex flex-row items-center justify-between bg-white/[0.02]">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest italic text-white/90 m-0 leading-none">Global Stream</h2>
            <div className="flex flex-row items-center space-x-4 px-4 py-2 rounded-full bg-black/40 border border-white/5">
                <div className="flex flex-row items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${healthStatus === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`}></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{healthStatus}</span>
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <span className="text-[8px] font-mono text-sky-400 tracking-widest uppercase font-bold">DC-PRIME-01</span>
            </div>
        </div>

        <div className="p-2 md:p-6 bg-black/20 overflow-x-auto w-full">
            <Suspense fallback={<LoadingScreen />}>
                {isLoading ? <LoadingScreen /> : <InventoryTable items={products} />}
            </Suspense>
        </div>
    </section>
);
