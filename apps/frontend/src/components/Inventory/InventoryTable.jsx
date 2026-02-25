const InventoryTable = ({ items }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
                <thead className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em]">
                    <tr>
                        <th className="px-8 py-4">Item Identity</th>
                        <th className="px-8 py-4">SKU / Serial</th>
                        <th className="px-8 py-4 text-center">Volume</th>
                        <th className="px-8 py-4 text-right">Value (USD)</th>
                        <th className="px-8 py-4">Classification</th>
                    </tr>
                </thead>
                <tbody className="">
                    {items.map((item) => (
                        <tr key={item.id} className="group cursor-pointer">
                            <td className="px-8 py-6 bg-white/[0.03] border-y border-l border-white/5 rounded-l-3xl group-hover:bg-white/[0.07] transition-all font-bold text-white text-lg">
                                {item.name}
                            </td>
                            <td className="px-8 py-6 bg-white/[0.03] border-y border-white/5 group-hover:bg-white/[0.07] transition-all font-mono text-sky-400/70 text-sm tracking-tighter">
                                {item.sku}
                            </td>
                            <td className="px-8 py-6 bg-white/[0.03] border-y border-white/5 group-hover:bg-white/[0.07] transition-all text-center">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${item.quantity < 10 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                    {item.quantity} UNITS
                                </span>
                            </td>
                            <td className="px-8 py-6 bg-white/[0.03] border-y border-white/5 group-hover:bg-white/[0.07] transition-all text-right text-white font-black text-xl font-mono">
                                ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                            </td>
                            <td className="px-8 py-6 bg-white/[0.03] border-y border-r border-white/5 rounded-r-3xl group-hover:bg-white/[0.07] transition-all">
                                <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-lg border border-white/10 uppercase tracking-widest text-slate-400">
                                    {item.category || 'GENERAL'}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-8 py-24 text-center">
                                <div className="text-slate-600 font-black uppercase tracking-[0.5em] text-xs">
                                    Node Stream Empty: Awaiting Asset Sync
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
