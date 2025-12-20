import React, { useState, useEffect } from 'react';
import usePlannerStore from '../store/plannerStore';
import DayCard from './DayCard';
import BudgetChart from './BudgetChart';
import { Download, RefreshCw, MapPin, Wallet, Layers, Map } from 'lucide-react';
import { searchDayImage } from '../services/pexelsService';

const ItineraryView = () => {
    const { itinerary, breakdown, inputs, setPhase, reset, iterations, theme, heroImageQuery } = usePlannerStore();;
    const [dayImages, setDayImages] = useState({});
    const [imagesLoading, setImagesLoading] = useState(true);
    const [heroImage, setHeroImage] = useState(null);
    const [heroImageLoading, setHeroImageLoading] = useState(true);

    // Fetch hero image for the broader region/country
    useEffect(() => {
        const fetchHeroImage = async () => {
            if (!heroImageQuery || !inputs.city) {
                setHeroImageLoading(false);
                return;
            }

            setHeroImageLoading(true);
            try {
                // Use unique cache key combining city and query
                const cacheKey = `hero-${inputs.city.toLowerCase()}-${heroImageQuery.toLowerCase().substring(0, 30)}`;
                
                // Use the Gemini-provided hero query for region/country image
                const image = await searchDayImage(inputs.city, 0, heroImageQuery);
                setHeroImage(image);
            } catch (error) {
                console.error('Failed to fetch hero image:', error);
            } finally {
                setHeroImageLoading(false);
            }
        };

        fetchHeroImage();
    }, [heroImageQuery, inputs.city]);

    // Fetch all day images once on mount
    useEffect(() => {
        const fetchAllDayImages = async () => {
            if (!itinerary || !inputs.city) {
                setImagesLoading(false);
                return;
            }

            setImagesLoading(true);
            const imagePromises = itinerary.map(async (day) => {
                // Use Gemini-provided search query if available
                const image = await searchDayImage(
                    inputs.city, 
                    day.day, 
                    day.imageSearchQuery || null
                );
                return { day: day.day, image };
            });

            try {
                const results = await Promise.all(imagePromises);
                const imagesMap = {};
                results.forEach(({ day, image }) => {
                    imagesMap[day] = image;
                });
                setDayImages(imagesMap);
            } catch (error) {
                console.error('Failed to fetch day images:', error);
            } finally {
                setImagesLoading(false);
            }
        };

        fetchAllDayImages();
    }, [itinerary, inputs.city]);

    if (!itinerary || !breakdown) return null;

    // Dynamic Gradient based on City Name (Fallback if no AI theme)
    const getCityGradient = (cityInput) => {
        const city = cityInput.toLowerCase();
        
        // Special Countries / Cities Fallback
        if (city.includes('japan') || city.includes('tokyo')) return ['from-red-600', 'to-white'];
        if (city.includes('usa') || city.includes('francisco')) return ['from-blue-700', 'to-red-600'];
        if (city.includes('italy') || city.includes('rome')) return ['from-green-600', 'to-red-600'];
        if (city.includes('france') || city.includes('paris')) return ['from-blue-600', 'to-red-500'];

        const colors = [
            ['from-blue-600', 'to-purple-600'],   // Default/Modern
            ['from-emerald-600', 'to-teal-600'],  // Nature/Tropical
            ['from-orange-500', 'to-red-600'],    // Warm/Desert
            ['from-indigo-500', 'to-blue-600'],   // City/Night
            ['from-rose-500', 'to-pink-600'],     // Romantic/Floral
            ['from-amber-400', 'to-orange-500'],  // Sunny/Beach
        ];
        
        // Simple hash to pick a consistent color theme for the same city
        let hash = 0;
        for (let i = 0; i < city.length; i++) {
            hash = city.charCodeAt(i) + ((hash << 5) - hash);
        }
        const fallbackTheme = colors[Math.abs(hash) % colors.length];
        return fallbackTheme;
    };

    // Use AI theme if available, otherwise fallback
    const [gradientFrom, gradientTo] = (theme && theme.length === 2) ? theme : getCityGradient(inputs.city);

    const formatMoney = (amount) => {
        if (amount === 0) return 'Free';
        if (!amount && amount !== 0) return '-'; 
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get random gradient based on destination
    const getDestinationGradient = () => {
        const gradients = [
            'from-purple-600 via-violet-600 to-indigo-600',
            'from-pink-500 via-rose-500 to-red-500',
            'from-blue-500 via-cyan-500 to-teal-500',
            'from-green-500 via-emerald-500 to-teal-500',
            'from-orange-500 via-amber-500 to-yellow-500',
            'from-fuchsia-600 via-purple-600 to-pink-600',
            'from-indigo-600 via-blue-600 to-cyan-600',
            'from-rose-600 via-pink-600 to-fuchsia-600',
        ];
        
        // Hash the destination to get consistent color for same destination
        let hash = 0;
        const dest = inputs.city || 'default';
        for (let i = 0; i < dest.length; i++) {
            hash = dest.charCodeAt(i) + ((hash << 5) - hash);
        }
        return gradients[Math.abs(hash) % gradients.length];
    };

    const gradientClass = getDestinationGradient();

    return (
        <div className="relative isolate min-h-screen -mx-4 -mt-4">
            {/* Hero Image Section */}
            {heroImage && !heroImageLoading ? (
                <div className="relative h-[400px] overflow-hidden">
                    <img 
                        src={heroImage.srcMedium} 
                        alt={`${inputs.city} region hero`}
                        className="w-full h-full object-cover"
                    />
                    {/* Static gradient overlay based on destination */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-30`} />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-ios-bg" />
                    
                    {/* Photographer credit
                    <div className="absolute bottom-4 right-4 text-[10px] text-white/40 bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        Photo by {heroImage.photographer}
                    </div> */}
                </div>
            ) : (
                /* Fallback gradient background */
                <div className="relative h-[400px]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-30`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ios-bg/50 to-ios-bg" />
                </div>
            )}

            <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto px-8 -mt-80 relative z-10">
                
                {/* Header / Summary */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-white/5">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-sm mb-1 w-fit">
                            <MapPin className="w-3.5 h-3.5 text-ios-purple" />
                            <span className="text-[12px] font-bold text-white tracking-widest uppercase shadow-black drop-shadow-md">Trip Overview</span>
                        </div>
                        <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                            {inputs.city}
                        </h2>
                        <div className="flex items-center gap-4 text-ios-label-secondary text-[17px] font-medium">
                            <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{inputs.days} Days</span>
                            <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{formatMoney(inputs.budget)} Budget</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => { reset(); setPhase('input'); }}
                            className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>New Plan</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Overview - Apple Health Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cost Card */}
                    <div className="ios-glass-card p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-ios-green/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6 text-ios-green" />
                        </div>
                        <p className="text-[13px] font-bold text-ios-label-secondary uppercase tracking-widest mb-2">Total Cost</p>
                        <p className="text-4xl font-bold text-white tracking-tighter">{formatMoney(breakdown.totalCost)}</p>
                        <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase ${
                            inputs.budget - breakdown.totalCost >= 0 ? 'bg-ios-green/20 text-ios-green' : 'bg-ios-red/20 text-ios-red'
                        }`}>
                            {inputs.budget - breakdown.totalCost >= 0 ? 'Within Budget' : 'Over Budget'}
                        </div>
                    </div>

                    {/* Remaining Card */}
                    <div className="ios-glass-card p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                         <div className="absolute top-4 right-4 w-12 h-12 bg-ios-blue/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6 text-ios-blue" />
                        </div>
                        <p className="text-[13px] font-bold text-ios-label-secondary uppercase tracking-widest mb-2">Remaining</p>
                        <p className={`text-4xl font-bold tracking-tighter ${inputs.budget - breakdown.totalCost >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                            {inputs.budget - breakdown.totalCost === 0 
                                ? '₹0' 
                                : formatMoney(Math.abs(inputs.budget - breakdown.totalCost))
                            }
                        </p>
                        <p className="text-[12px] text-ios-label-tertiary mt-4 font-medium">
                            {iterations} optimizations performed
                        </p>
                    </div>

                    {/* Activities Card */}
                    <div className="ios-glass-card p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-ios-orange/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Map className="w-6 h-6 text-ios-orange" />
                        </div>
                        <p className="text-[13px] font-bold text-ios-label-secondary uppercase tracking-widest mb-2">Activities</p>
                        <p className="text-4xl font-bold text-white tracking-tighter">
                            {itinerary.reduce((acc, day) => acc + (day.activities?.length || 0), 0)}
                        </p>
                        <p className="text-[12px] text-ios-label-tertiary mt-4 font-medium">
                            Planned across {inputs.days} days
                        </p>
                    </div>
                </div>

                {/* Timeline - Apple Wallet Style */}
                <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between px-2">
                         <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-1 h-8 bg-ios-purple rounded-full"></span>
                            Itinerary Timeline
                        </h3>
                        <span className="text-[13px] font-bold text-ios-blue bg-ios-blue/10 px-4 py-2 rounded-full border border-ios-blue/20">
                            {itinerary.length} Day Passes
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                        {itinerary.map((day, index) => (
                            <div key={day.day} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                 <DayCard 
                                    day={day.day} 
                                    activities={day.activities} 
                                    destination={inputs.city}
                                    dayImage={dayImages[day.day]}
                                    imageLoading={imagesLoading}
                                    daySummary={day.daySummary}
                                    highlights={day.highlights}
                                 />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Breakdown - Added to Trip Overview */}
                <div className="ios-glass-card p-8 mt-8 border-t border-white/5">
                    <h3 className="text-[15px] font-bold text-white uppercase tracking-widest mb-6">Budget Breakdown</h3>
                    <BudgetChart breakdown={breakdown} />
                </div>
            </div>
        </div>
    );
};

export default ItineraryView;
