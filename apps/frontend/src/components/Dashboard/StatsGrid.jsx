import React from 'react';
import { dashboardConfig } from '../../config/dashboard.config';

export const StatsGrid = ({ stats }) => (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardConfig.widgets.map((widget) => (
            <div
                key={widget.id}
                className="glass-card-square rounded-3xl p-6 group flex flex-col items-start justify-between min-h-[140px] shadow-lg border border-white/5 hover:border-white/10 transition-colors"
            >
                <span className="text-sky-400/50 font-black tracking-widest text-[7px] uppercase mb-4 group-hover:text-sky-400 transition-colors">
                    {widget.title}
                </span>

                <div className="text-3xl font-black tracking-tight text-white mb-1 group-hover:scale-110 transition-transform duration-500">
                    {stats[widget.id] || 0}
                </div>

                <div className="mt-auto flex flex-row items-center space-x-1 pt-3">
                    <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse"></div>
                    <span className="text-[6px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors italic">
                        active stream
                    </span>
                </div>
            </div>
        ))}
    </div>
);