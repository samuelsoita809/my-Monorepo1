import React from 'react';

export const HeroHeader = ({ onRegisterClick }) => (
    <header className="flex flex-col items-center justify-center text-center mb-20 w-full">
        <div className="inline-flex flex-row items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel text-[7px] font-black uppercase tracking-[0.4em] text-sky-400 mb-4 border border-sky-500/10 shadow-lg">
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
            </span>
            <span>Nexus Core Operational v2.5.0</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tightest uppercase leading-none italic mb-4 w-full flex flex-col items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 block">Inventory</span>
            <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.25)] block mt-1">Manager</span>
        </h1>
        <div className="h-0.5 w-16 bg-sky-500 rounded-full mb-8 mx-auto"></div>

        <button onClick={onRegisterClick} className="btn-primary mx-auto">
            <span className="relative z-10 flex flex-row items-center space-x-2 text-white font-black tracking-widest text-[9px] uppercase justify-center">
                <span className="text-lg font-light leading-none">+</span>
                <span>Register Asset</span>
            </span>
        </button>
    </header>
);
