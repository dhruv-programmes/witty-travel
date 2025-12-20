import React, { useState } from 'react';
import usePlannerStore from '../../store/plannerStore';
import { Plus, Trash2, Map, Home, ChevronLeft, ChevronRight, Calendar, Clock, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { sessions, activeSessionId, createSession, loadSession, deleteSession } = usePlannerStore();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleNewTrip = () => {
        const id = createSession();
        navigate(`/plan/${id}`);
    };

    const handleSessionClick = (id) => {
        loadSession(id);
        navigate(`/plan/${id}`);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        
        // If deleting the active session, determine navigation
        if (id === activeSessionId) {
            deleteSession(id);
            // If there are other sessions, go to the first one
            const remaining = sessions.filter(s => s.id !== id);
            if (remaining.length > 0) {
                const next = remaining[0];
                loadSession(next.id);
                navigate(`/plan/${next.id}`);
            } else {
                // If no sessions left, create a new one
                handleNewTrip();
            }
        } else {
            deleteSession(id);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    // Group sessions by date (only show completed trips with itineraries)
    const groupedSessions = sessions
        .filter(session => session.status === 'complete') // Only show completed trips
        .reduce((groups, session) => {
            const date = new Date(session.updatedAt);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let key = 'Earlier';
            if (date.toDateString() === today.toDateString()) key = 'Today';
            else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday';
            else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) key = 'Previous 7 Days';

            if (!groups[key]) groups[key] = [];
            groups[key].push(session);
            return groups;
        }, {});

    const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Earlier'];

    // Collapsed view - only show New Trip and Reopen buttons
    if (isCollapsed) {
        return (
            <aside className="h-full bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col shadow-2xl relative z-50 w-20 transition-all duration-300">
                <div className="p-3 shrink-0 border-b border-white/[0.08]">
                    <div className="flex flex-col gap-3 items-center">
                        {/* New Trip Button */}
                        <button 
                            onClick={handleNewTrip}
                            className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center font-semibold hover:bg-white/90 active:scale-[0.95] transition-all duration-200 shadow-lg"
                            title="New Trip"
                        >
                            <Plus className="w-6 h-6" strokeWidth={2.5} />
                        </button>

                        {/* Reopen Button */}
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="w-14 h-14 bg-white/[0.08] text-white rounded-xl flex items-center justify-center hover:bg-white/[0.12] active:scale-[0.95] transition-all duration-200 border border-white/[0.08]"
                            title="Expand Sidebar"
                        >
                            <PanelLeftOpen className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
                {/* Empty space to maintain layout */}
                <div className="flex-1"></div>
            </aside>
        );
    }

    // Expanded view - show everything
    return (
        <aside className="h-full bg-[#0a0a0a] border-r border-white/[0.08] flex flex-col shadow-2xl relative z-50 w-80 transition-all duration-300">
            {/* Header */}
            <div className="p-5 pb-4 shrink-0 border-b border-white/[0.08]">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center border border-white/[0.12] shadow-lg">
                            <Map className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-lg font-bold text-white tracking-tight">Witty Travel</h1>
                    </div>
                    
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="p-2 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white transition-all"
                        title="Collapse Sidebar"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <button 
                        onClick={handleNewTrip}
                        className="w-full bg-white text-black rounded-lg py-3 px-4 flex items-center justify-center gap-3 font-semibold hover:bg-white/90 active:scale-[0.98] transition-all duration-200 shadow-lg"
                        title="New Trip"
                    >
                        <Plus className="w-5 h-5" strokeWidth={2.5} />
                        <span>New Trip</span>
                    </button>

                    <button 
                        onClick={handleBackToHome}
                        className="w-full bg-white/[0.08] text-white/80 rounded-lg py-2.5 px-4 flex items-center justify-center gap-3 font-medium hover:bg-white/[0.12] hover:text-white active:scale-[0.98] transition-all duration-200 border border-white/[0.08]"
                        title="Back to Home"
                    >
                        <Home className="w-4 h-4" strokeWidth={2.5} />
                        <span>Home</span>
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                {sessions.length === 0 ? (
                    <div className="text-center py-10 space-y-3 px-4">
                        <div className="w-12 h-12 bg-white/[0.05] rounded-xl flex items-center justify-center mx-auto border border-white/[0.08]">
                            <Calendar className="w-5 h-5 text-white/30" />
                        </div>
                        <p className="text-[13px] text-white/40 font-medium">No trips yet</p>
                    </div>
                ) : (
                    groupOrder.map(group => {
                        const groupSessions = groupedSessions[group];
                        if (!groupSessions || groupSessions.length === 0) return null;

                        return (
                            <div key={group} className="mb-6">
                                <h3 className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-2 sticky top-0 bg-[#0a0a0a] py-1 z-10">
                                    {group}
                                </h3>
                                <div className="space-y-1">
                                    {groupSessions.map(session => (
                                        <div 
                                            key={session.id}
                                            onClick={() => handleSessionClick(session.id)}
                                            className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                activeSessionId === session.id 
                                                ? 'bg-white/[0.12] text-white border border-white/[0.15]' 
                                                : 'text-white/60 hover:bg-white/[0.06] hover:text-white border border-transparent'
                                            }`}
                                        >
                                            {/* Status Indicator */}
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                session.status === 'complete' ? 'bg-emerald-400' : 'bg-white/30'
                                            }`} />
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-semibold truncate leading-snug">
                                                    {session.title || 'Untitled Trip'}
                                                </p>
                                                <div className="flex items-center gap-2 text-[11px] text-white/40 truncate mt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {session.inputs?.days ? `${session.inputs.days}d` : 'Draft'}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(session.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={(e) => handleDelete(e, session.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 hover:text-red-400 text-white/40 transition-all"
                                                title="Delete Trip"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-white/[0.08] shrink-0">
                <div className="bg-white/[0.05] rounded-lg p-3 border border-white/[0.08]">
                    <div className="flex items-center gap-2 text-white/60">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center text-[11px] font-bold text-white border border-white/[0.12]">
                            AI
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-white leading-none truncate">Travel Agent</p>
                            <p className="text-[10px] text-white/40 mt-1">Powered by gemini-2.5-flash</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
