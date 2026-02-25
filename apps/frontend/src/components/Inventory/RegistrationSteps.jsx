import React from 'react';

export const StepInfo = ({ onNext, data, onCancel }) => (
    <form className="text-center w-full flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); onNext({ name: e.target.name.value, sku: e.target.sku.value }); }}>
        <h3 className="text-2xl font-black mb-8 text-white italic tracking-tighter border-b border-sky-500 pb-2 inline-block uppercase">Identity</h3>
        <div className="space-y-6 w-full max-w-sm text-left">
            <div>
                <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest" htmlFor="name">ASSET TITLE</label>
                <input id="name" name="name" defaultValue={data.name} placeholder="e.g. QUANTUM CORE" required className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white" aria-label="Product Name" />
            </div>
            <div>
                <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest" htmlFor="sku">SERIAL_KEY_ID</label>
                <input id="sku" name="sku" defaultValue={data.sku} placeholder="e.g. QC-001" required className="input-premium w-full p-4 rounded-xl outline-none font-mono text-sm bg-white/5 border border-white/10 text-white" aria-label="SKU Identifier" />
            </div>
        </div>
        <div className="flex flex-row justify-center space-x-4 mt-10 w-full max-w-sm">
            <button type="button" onClick={onCancel} className="flex-1 py-3 text-slate-500 font-black tracking-widest hover:text-white transition-colors uppercase text-[9px] bg-white/5 rounded-xl border border-white/10">Abort</button>
            <button type="submit" className="flex-1 btn-primary py-3 rounded-xl text-[9px] min-w-[120px]">Proceed →</button>
        </div>
    </form>
);

export const StepStock = ({ onNext, onBack, data }) => (
    <form className="text-center w-full flex flex-col items-center" onSubmit={(e) => { e.preventDefault(); onNext({ price: parseFloat(e.target.price.value), stock: parseInt(e.target.stock.value) }); }}>
        <h3 className="text-2xl font-black mb-8 text-white italic tracking-tighter border-b border-sky-500 pb-2 inline-block uppercase">Values</h3>
        <div className="space-y-6 w-full max-w-sm text-left">
            <div>
                <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest" htmlFor="price">VALUATION (USD)</label>
                <input id="price" name="price" type="number" step="0.01" defaultValue={data.price} placeholder="0.00" required className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white" aria-label="Unit Price" />
            </div>
            <div>
                <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest" htmlFor="stock">CAPACITY</label>
                <input id="stock" name="stock" type="number" defaultValue={data.stock} placeholder="0" required className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white" aria-label="Initial Stock" />
            </div>
        </div>
        <div className="flex flex-row justify-center space-x-4 mt-10 w-full max-w-sm">
            <button type="button" onClick={onBack} className="flex-1 py-3 text-slate-500 font-black tracking-widest hover:text-white transition-colors uppercase text-[9px] bg-white/5 rounded-xl border border-white/10">Retreat</button>
            <button type="submit" className="flex-1 btn-primary py-3 rounded-xl text-[9px] min-w-[120px]">Verify Output</button>
        </div>
    </form>
);

export const StepSummary = ({ data, onNext, onBack }) => (
    <div className="text-center w-full flex flex-col items-center">
        <h3 className="text-2xl font-black mb-8 text-emerald-400 italic tracking-tighter border-b border-emerald-500 pb-2 inline-block uppercase">Sync</h3>
        <div className="p-6 rounded-3xl mb-8 space-y-4 w-full max-w-sm bg-black/40 border border-white/10">
            <div className="flex flex-row justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-500 font-black text-[8px] uppercase">Identity</span><span className="font-black text-white text-xs">{data.name}</span></div>
            <div className="flex flex-row justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-500 font-black text-[8px] uppercase">Serial</span><span className="font-bold text-sky-400 font-mono text-xs tracking-tighter">{data.sku}</span></div>
            <div className="flex flex-row justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-500 font-black text-[8px] uppercase">Value</span><span className="font-black text-emerald-400 text-lg">${data.price}</span></div>
            <div className="flex flex-row justify-between items-center"><span className="text-slate-500 font-black text-[8px] uppercase">Units</span><span className="font-black text-white text-lg">{data.stock}</span></div>
        </div>
        <div className="flex flex-row justify-center space-x-4 w-full max-w-sm">
            <button type="button" onClick={onBack} className="flex-1 py-3 text-slate-500 font-black tracking-widest hover:text-white transition-colors uppercase text-[9px] bg-white/5 rounded-xl border border-white/10">Modify</button>
            <button onClick={() => onNext({})} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black py-4 rounded-xl hover:brightness-110 transition-all text-[9px] uppercase tracking-widest min-w-[120px] shadow-[0_0_15px_rgba(16,185,129,0.3)]">Commit Asset</button>
        </div>
    </div>
);
