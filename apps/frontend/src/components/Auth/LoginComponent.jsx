import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginComponent = ({ onSwitch }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-white/10 shadow-2xl animate-in scale-in-95 duration-500">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center border border-sky-500/30 mb-4">
                    <div className="w-4 h-4 bg-sky-400 rounded-sm animate-pulse"></div>
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Nexus Entry</h1>
                <p className="text-[10px] text-sky-400 font-bold tracking-[0.3em] uppercase mt-1">Authorized Access Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Identity Vector</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="EMAIL_ADDRESS"
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all placeholder:text-slate-700"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-1">Access Protocol</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 outline-none transition-all placeholder:text-slate-700"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-[11px] font-bold text-center tracking-wide">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                >
                    {isLoading ? 'SYNCING...' : 'INITIALIZE'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-slate-500 text-[11px] font-medium">
                    No credentials?{' '}
                    <button onClick={onSwitch} className="text-sky-400 font-black uppercase tracking-widest hover:text-sky-300 transition-colors">
                        Request Access
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginComponent;
