import React, { useState } from 'react';

const EditProductModal = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || 0,
        stock: product.quantity || 0,
        category: product.category || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(product.id, formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'price') {
            finalValue = value === '' ? '' : parseFloat(value);
        } else if (name === 'stock') {
            finalValue = value === '' ? '' : parseInt(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Modify Asset</h3>
                    <div className="text-[10px] font-mono text-sky-400 uppercase tracking-widest px-3 py-1 bg-sky-500/5 rounded border border-sky-500/20">
                        {product.sku}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Asset Title</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Valuation (USD)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Capacity</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[8px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">Classification</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input-premium w-full p-4 rounded-xl outline-none text-sm bg-white/5 border border-white/10 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-4 text-slate-500 font-black tracking-widest hover:text-white transition-colors uppercase text-[10px] bg-white/5 rounded-xl border border-white/10"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary py-4 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                        >
                            Commit Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
