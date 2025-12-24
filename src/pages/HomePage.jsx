import React from 'react';
import usePlannerStore from '../store/plannerStore';
import { useNavigate } from 'react-router-dom';
import { 
    MapPin, Calendar, Sparkles, ArrowRight, Zap, Shield, Clock, 
    Wallet, Globe, Heart, Star, TrendingUp, Github, ExternalLink 
} from 'lucide-react';

const HomePage = () => {
    const { createSession } = usePlannerStore();
    const navigate = useNavigate();

    const handleStart = () => {
        const id = createSession();
        navigate(`/plan/${id}`);
    };

    const features = [
        {
            icon: Zap,
            title: 'AI-Powered Planning',
            description: 'Gemini AI creates personalized itineraries in seconds',
            color: '#fbbf24'
        },
        {
            icon: Wallet,
            title: 'Smart Budgeting',
            description: 'Automatic budget optimization with INR support',
            color: '#10b981'
        },
        {
            icon: Clock,
            title: 'Instant Generation',
            description: 'Complete 7-day itinerary in under 30 seconds',
            color: '#3b82f6'
        },
        {
            icon: Globe,
            title: 'Any Destination',
            description: 'Plan trips anywhere in the world with local insights',
            color: '#8b5cf6'
        },
        {
            icon: Heart,
            title: 'Personalized',
            description: 'Tailored to your preferences, style, and pace',
            color: '#ec4899'
        },
        {
            icon: Shield,
            title: 'Reliable',
            description: 'Realistic prices, verified activities, and practical routes',
            color: '#06b6d4'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden">
            
            {/* Hero Section */}
            <div className="relative">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        
                        {/* Left: Content */}
                        <div className="space-y-8 animate-slide-up">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Powered by gemini-2.5-flash</span>
                            </div>

                            {/* Title */}
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
                                    Travel planning,<br />
                                    <span className="bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-transparent">
                                        perfected.
                                    </span>
                                </h1>
                                <p className="text-xl text-white/60 leading-relaxed max-w-lg">
                                    Your personal AI travel agent. Smart itineraries, instant budgeting, and personalized experiences—all in seconds.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={handleStart}
                                    className="group bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 active:scale-95 transition-all shadow-2xl shadow-white/20 flex items-center gap-3"
                                >
                                    Start Planning Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button 
                                    onClick={() => navigate('/demo')}
                                    className="px-8 py-4 rounded-2xl font-bold text-white border-2 border-white/20 hover:bg-white/5 hover:border-white/30 transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    View Demo
                                </button>
                            </div>

                            {/* Premium Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 pt-8">
                                {/* AI Powered Card */}
                                <div className="group relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md rounded-2xl p-5 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-600/0 group-hover:from-blue-400/10 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300" />
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Sparkles className="w-5 h-5 text-blue-300" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-1">100%</h3>
                                        <p className="text-sm text-blue-200/80 font-semibold">AI Powered</p>
                                    </div>
                                </div>

                                {/* Generation Speed Card */}
                                <div className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md rounded-2xl p-5 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300" />
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Zap className="w-5 h-5 text-purple-300" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-1">{'<'}30s</h3>
                                        <p className="text-sm text-purple-200/80 font-semibold">Generation</p>
                                    </div>
                                </div>

                                {/* INR Support Card */}
                                <div className="group relative bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-md rounded-2xl p-5 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-emerald-600/0 group-hover:from-emerald-400/10 group-hover:to-emerald-600/5 rounded-2xl transition-all duration-300" />
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Wallet className="w-5 h-5 text-emerald-300" />
                                        </div>
                                        <h3 className="text-3xl font-black text-white mb-1">₹</h3>
                                        <p className="text-sm text-emerald-200/80 font-semibold">INR Support</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Floating Boarding Pass + Mini Cards */}
                        <div className="relative hidden md:block">
                            <div className="relative space-y-8">
                                {/* Main Boarding Pass */}
                                <div className="relative">
                                    {/* Background Cards */}
                                    <div className="absolute top-8 right-[-30px] w-full h-[480px] bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 transform rotate-6 scale-95 shadow-2xl opacity-40" />
                                    <div className="absolute top-4 right-[-15px] w-full h-[480px] bg-gradient-to-br from-white/8 to-white/[0.03] backdrop-blur-md rounded-3xl border border-white/10 transform rotate-3 scale-[0.97] shadow-2xl opacity-60" />
                                    
                                    {/* Main Boarding Pass */}
                                    <div className="relative bg-gradient-to-br from-white/10 to-white/[0.05] backdrop-blur-xl rounded-3xl border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
                                    
                                    {/* Header */}
                                    <div className="p-8 border-b border-white/10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-bold mb-2">Destination</p>
                                                <h3 className="text-4xl font-black text-white">Tokyo</h3>
                                            </div>
                                            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
                                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Confirmed</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2 text-white/60">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-semibold">5 Days</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60">
                                                <Wallet className="w-4 h-4" />
                                                <span className="font-semibold">₹50,000</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforated Edge */}
                                    <div className="relative h-6 bg-gradient-to-br from-white/10 to-white/[0.05]">
                                        <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
                                            {[...Array(15)].map((_, i) => (
                                                <div key={i} className="w-3 h-3 -mt-1.5 rounded-full bg-black border border-white/10" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Activities */}
                                    <div className="p-8 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold mb-1">Senso-ji Temple</h4>
                                                <p className="text-white/40 text-sm">Ancient Buddhist temple in Asakusa</p>
                                            </div>
                                            <span className="text-white/60 font-bold">Free</span>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold mb-1">Tokyo Skytree</h4>
                                                <p className="text-white/40 text-sm">Observation deck with city views</p>
                                            </div>
                                            <span className="text-white/60 font-bold">₹2,500</span>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
                                                <Star className="w-5 h-5 text-pink-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold mb-1">Shibuya Crossing</h4>
                                                <p className="text-white/40 text-sm">World's busiest intersection</p>
                                            </div>
                                            <span className="text-white/60 font-bold">Free</span>
                                        </div>
                                    </div>

                                    {/* Footer Barcode */}
                                    <div className="px-8 pb-8">
                                        <div className="flex gap-[2px] items-end h-12 opacity-20">
                                            {[...Array(30)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-[3px] bg-white rounded-t-sm" 
                                                    style={{ height: `${Math.max(30, Math.random() * 100)}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Why Choose Witty Travel?</h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            Experience the future of travel planning with AI-powered intelligence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div 
                                key={idx}
                                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${feature.color}20`, borderColor: `${feature.color}40`, borderWidth: '1px' }}
                                >
                                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/60 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-24 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/10 shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Ready to plan your next adventure?
                        </h2>
                        <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                            Join thousands of travelers who trust AI to create their perfect itineraries
                        </p>
                        <button 
                            onClick={handleStart}
                            className="group bg-white text-black px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/90 active:scale-95 transition-all shadow-2xl shadow-white/20 inline-flex items-center gap-3"
                        >
                            Get Started Free
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Credits */}
                        <div className="text-center md:text-left">
                            <p className="text-white/40 text-sm mb-2 inline-flex items-center gap-1">
                                Crafted with <Heart className="w-4 h-4 text-red-400" fill="currentColor" /> by
                            </p>
                            <p className="text-white font-bold text-lg">Dhruv Padhiyar</p>
                        </div>

                        {/* GitHub Link */}
                        <a 
                            href="https://github.com/dhruv-programmes/witty-travel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-6 py-3 transition-all"
                        >
                            <Github className="w-5 h-5 text-white" />
                            <span className="text-white font-semibold">View on GitHub</span>
                            <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-center mt-8 pt-8 border-t border-white/5">
                        <p className="text-white/30 text-sm">
                            © 2024 Witty Travel. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
