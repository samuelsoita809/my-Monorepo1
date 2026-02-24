const InventoryTable = ({ items }) => {
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
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
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
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                No items found in the inventory system.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
