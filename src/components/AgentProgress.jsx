import React, { useEffect, useState } from 'react';
import usePlannerStore from '../store/plannerStore';
import { Sparkles, MapPin, Plane, Compass, AlertCircle, Zap } from 'lucide-react';

const AgentProgress = () => {
    const { currentPhase, progressMessage, error, iterations, inputs } = usePlannerStore();
    const [activeOrb, setActiveOrb] = useState(0);

    // Rotate through orbs to show activity
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveOrb(prev => (prev + 1) % 3);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const activities = [
        { icon: Compass, label: 'Exploring', color: '#3b82f6' },
        { icon: MapPin, label: 'Mapping', color: '#8b5cf6' },
        { icon: Plane, label: 'Planning', color: '#06b6d4' },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen animate-fade-in relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
                
                {error ? (
                    /* Error State */
                    <div className="text-center space-y-8 animate-slide-up">
                        <div className="inline-flex w-28 h-28 rounded-3xl bg-red-500/10 border border-red-500/20 items-center justify-center backdrop-blur-xl">
                            <AlertCircle className="w-14 h-14 text-red-400" strokeWidth={1.5} />
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-white tracking-tight">Something went wrong</h2>
                            <p className="text-white/50 text-[17px] max-w-md mx-auto leading-relaxed">{error}</p>
                        </div>

                        <button 
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 bg-white text-black font-bold px-10 py-4 rounded-2xl transition-all active:scale-[0.96] shadow-2xl hover:bg-white/90 text-[17px]"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    /* Active State */
                    <div className="space-y-16 text-center">
                        
                        {/* Text Content */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h2 className="text-5xl font-black text-white tracking-tight">
                                    Creating Your Journey
                                </h2>
                                <p className="text-white/40 text-[17px] font-medium">
                                    {activities[activeOrb].label} destinations and experiences
                                </p>
                            </div>

                            {/* Destination Card */}
                            <div className="flex items-center justify-center">
                                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                                        <span className="text-[17px] font-bold text-white">
                                            {inputs.city || 'Destination'}
                                        </span>
                                    </div>
                                    <div className="w-px h-5 bg-white/[0.15]" />
                                    <span className="text-[15px] text-white/50 font-semibold">
                                        {inputs.days} days
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Activity Status Cards */}
                        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                            {activities.map((activity, idx) => {
                                const Icon = activity.icon;
                                const isActive = activeOrb === idx;
                                
                                return (
                                    <div 
                                        key={idx}
                                        className={`relative rounded-2xl p-5 border backdrop-blur-xl transition-all duration-500 ${
                                            isActive 
                                            ? 'bg-white/[0.08] border-white/[0.15] shadow-xl' 
                                            : 'bg-white/[0.03] border-white/[0.06]'
                                        }`}
                                    >
                                        {/* Active Indicator */}
                                        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-500 ${
                                            isActive ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' : 'bg-white/20'
                                        }`} />
                                        
                                        <div className="space-y-3 text-left">
                                            <Icon 
                                                className={`w-6 h-6 transition-all duration-500 ${
                                                    isActive ? 'text-white' : 'text-white/25'
                                                }`}
                                                strokeWidth={2}
                                            />
                                            <p className={`text-[13px] font-semibold leading-tight transition-all duration-500 ${
                                                isActive ? 'text-white/90' : 'text-white/30'
                                            }`}>
                                                {activity.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress Message */}
                        {progressMessage && (
                            <div className="max-w-lg mx-auto">
                                <p className="text-[15px] text-white/40 font-medium leading-relaxed">
                                    {progressMessage}
                                </p>
                            </div>
                        )}

                        {/* Iteration Badge */}
                        {iterations > 0 && (
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
                                    <Zap className="w-4 h-4 text-blue-400" fill="currentColor" />
                                    <span className="text-[14px] font-bold text-blue-400">
                                        Optimizing · Round {iterations}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Subtle Hint */}
                        <div className="pt-4">
                            <p className="text-[13px] text-white font-medium">
                                This usually takes 10-30 seconds
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentProgress;
