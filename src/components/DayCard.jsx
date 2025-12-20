import React from 'react';
import { Clock, MapPin, Tag } from 'lucide-react';

const DayCard = ({ day, activities, destination, dayImage, imageLoading, daySummary, highlights }) => {
    // Calculate total cost for the day
    const totalDayCost = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);

    return (
        <div className="relative group">
            {/* Boarding Pass Card */}
            <div className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/[0.08] transition-all duration-300 hover:border-white/[0.15] hover:shadow-2xl">
                
                {/* Hero Image Section */}
                {imageLoading ? (
                    <div className="relative w-full h-72 bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.05] overflow-hidden">
                        {/* Shimmer animation */}
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                ) : dayImage ? (
                    <div className="relative w-full h-72 overflow-hidden">
                        <img 
                            src={dayImage.srcMedium} 
                            alt={dayImage.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {/* Gradient Overlay for seamless blend */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#0a0a0a]" />
                        
                        {/* Floating Day Badge */}
                        <div className="absolute top-5 left-5">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-2xl">
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.15em] mb-1">Day Pass</p>
                                <h3 className="text-3xl font-black text-white tracking-tight">Day {day}</h3>
                            </div>
                        </div>

                        {/* Destination Badge */}
                        <div className="absolute top-5 right-5">
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-white/60" strokeWidth={2.5} />
                                <span className="text-[12px] font-semibold text-white tracking-wide">{destination}</span>
                            </div>
                        </div>

                        {/* Photographer Credit
                        <div className="absolute bottom-3 right-3 text-[9px] text-white/30 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                            Photo by {dayImage.photographer}
                        </div> */}
                    </div>
                ) : (
                    /* Fallback Header */
                    <div className="relative w-full h-72 bg-gradient-to-br from-white/[0.08] to-white/[0.03] flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2">Day Pass</p>
                            <h3 className="text-4xl font-black text-white/80">Day {day}</h3>
                        </div>
                    </div>
                )}

                {/* Perforated Edge Effect */}
                <div className="relative h-6 bg-[#0a0a0a]">
                    <div className="absolute top-0 left-0 right-0 flex justify-between px-2">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="w-3 h-3 -mt-1.5 rounded-full bg-ios-bg border border-white/[0.08]" />
                        ))}
                    </div>
                </div>

                {/* Day Summary Section */}
                {daySummary && (
                    <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                        <div className="max-w-2xl">
                            <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-3">Today's Theme</p>
                            <p className="text-[18px] text-white/90 leading-relaxed font-medium">{daySummary}</p>
                        </div>
                    </div>
                )}

                {/* Activities Section */}
                <div className="p-6 space-y-5">
                    {/* Section Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em]">Itinerary</h4>
                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                            <Tag className="w-3 h-3" strokeWidth={2.5} />
                            <span className="font-bold">₹{totalDayCost.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Activities List */}
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div 
                                key={index} 
                                className="group/activity relative pl-5 pb-4 border-l-2 border-white/[0.08] last:border-0 last:pb-0 hover:border-blue-500/50 transition-all duration-300"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-white/20 border-2 border-[#0a0a0a] group-hover/activity:bg-blue-400 group-hover/activity:scale-125 transition-all duration-300" />
                                
                                <div className="space-y-2">
                                    {/* Activity Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-[16px] font-bold text-white leading-tight mb-1 group-hover/activity:text-blue-400 transition-colors">
                                                {activity.name}
                                            </h5>
                                            <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2">
                                                {activity.description}
                                            </p>
                                        </div>
                                        
                                        {/* Cost Badge */}
                                        <div className="shrink-0 text-right">
                                            <div className="inline-flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1.5">
                                                <span className="text-[14px] font-bold text-white">₹{activity.cost}</span>
                                            </div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1 font-semibold">
                                                {activity.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Activity Meta */}
                                    <div className="flex items-center gap-4 text-[12px] text-white/40 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            <span>{activity.time}</span>
                                        </div>
                                        <span className="text-white/20">•</span>
                                        <span>{activity.duration}h duration</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer - Barcode */}
                <div className="px-6 pb-6 pt-4 border-t border-white/[0.06]">
                    {/* Barcode */}
                    <div className="flex gap-[2px] items-end h-10 opacity-30">
                        {[...Array(25)].map((_, i) => (
                            <div 
                                key={i} 
                                className="w-[3px] bg-white rounded-t-sm" 
                                style={{ height: `${Math.max(30, Math.random() * 100)}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Side Notches */}
            <div className="absolute -left-4 top-72 w-8 h-8 bg-ios-bg rounded-full border border-white/[0.08]" />
            <div className="absolute -right-4 top-72 w-8 h-8 bg-ios-bg rounded-full border border-white/[0.08]" />
        </div>
    );
};

export default DayCard;
