const InventoryTable = ({ items, onDelete, onEdit }) => {
    return (
        <div className="overflow-x-auto glass-card rounded-2xl border border-slate-800/50 mt-8">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs tracking-widest font-semibold">
                    <tr>
                        <th className="px-6 py-4">Item Name</th>
                        <th className="px-6 py-4">SKU</th>
                        <th className="px-6 py-4 text-center">Quantity</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-200">{item.name}</td>
                            <td className="px-6 py-4 font-mono text-cyan-400/80 text-sm">{item.sku}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity < 10 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                    {item.quantity}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-slate-300 font-mono">
                                ${item.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-slate-500 text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 uppercase tracking-tighter">
                                    {item.category || 'General'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg"
                                >
                                    Decommission
                                </button>
                                <button
                                    onClick={() => onEdit(item)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 text-sky-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg"
                                >
                                    Modify
                                </button>
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
