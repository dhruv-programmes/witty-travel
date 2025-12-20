import React, { useState, useMemo, useEffect } from 'react';
import usePlannerStore from '../store/plannerStore';
import { agentService } from '../services/agentService';
import { MapPin, Calendar, Wallet, Wand2, Camera, Utensils, Theater, Mountain, Palmtree, ShoppingBag, Music, Coffee, Users, Plane, Hotel, Info, Train, Car, Bike, Footprints, Leaf, Sprout, Moon, Star, Wheat, Check, Search, X } from 'lucide-react';
import cities from 'cities.json';

const POPULAR_CITIES = ['Tokyo', 'Paris', 'New York', 'Bali', 'Dubai', 'London', 'Singapore', 'Barcelona'];

const TRANSPORT_MODES = [
  { id: 'auto', label: 'Auto', icon: Wand2, color: '#a855f7', desc: 'AI Decides' },
  { id: 'plane', label: 'Plane', icon: Plane, color: '#3b82f6', desc: 'Fastest option' },
  { id: 'train', label: 'Train', icon: Train, color: '#10b981', desc: 'Scenic routes' },
  { id: 'car', label: 'Car/Bus', icon: Car, color: '#f59e0b', desc: 'Flexible travel' },
  { id: 'bike', label: 'Bike', icon: Bike, color: '#8b5cf6', desc: 'Adventure mode' },
];

const FOOD_PREFERENCES = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Leaf, color: '#10b981' },
  { id: 'vegan', label: 'Vegan', icon: Sprout, color: '#22c55e' },
  { id: 'halal', label: 'Halal', icon: Moon, color: '#06b6d4' },
  { id: 'kosher', label: 'Kosher', icon: Star, color: '#8b5cf6' },
  { id: 'gluten-free', label: 'Gluten Free', icon: Wheat, color: '#f59e0b' },
  { id: 'no-restrictions', label: 'No Restrictions', icon: Check, color: '#6b7280' },
];

const PREFERENCES = [
  { id: 'sightseeing', label: 'Sightseeing', icon: Camera, color: '#6366f1' },
  { id: 'food', label: 'Food & Dining', icon: Utensils, color: '#f97316' },
  { id: 'culture', label: 'Culture', icon: Theater, color: '#ec4899' },
  { id: 'adventure', label: 'Adventure', icon: Mountain, color: '#10b981' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: '#8b5cf6' },
  { id: 'relaxation', label: 'Relaxation', icon: Palmtree, color: '#06b6d4' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#eab308' },
  { id: 'nightlife', label: 'Nightlife', icon: Coffee, color: '#ef4444' },
];

const TRAVEL_STYLES = [
  { id: 'budget', label: 'Budget', desc: 'Cost-effective choices', color: '#10b981' },
  { id: 'balanced', label: 'Balanced', desc: 'Mix of value & comfort', color: '#3b82f6' },
  { id: 'luxury', label: 'Luxury', desc: 'Premium experiences', color: '#8b5cf6' },
];

const PACE_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed', desc: '2-3 activities/day', color: '#06b6d4' },
  { id: 'moderate', label: 'Moderate', desc: '4-5 activities/day', color: '#f59e0b' },
  { id: 'packed', label: 'Packed', desc: '6+ activities/day', color: '#ef4444' },
];

// Format number in Indian comma system (lakhs)
const formatIndianNumber = (num) => {
    if (!num && num !== 0) return '0';
    const numStr = num.toString();
    const lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== '') {
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
};

const ModernSlider = ({ label, value, min, max, step, onChange, icon: Icon, color, suffix = '', prefix = '', description }) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start px-1">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                        <Icon className="w-4.5 h-4.5" style={{ color }} strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="text-[15px] font-semibold text-white block">{label}</span>
                        {description && <span className="text-[12px] text-white/40">{description}</span>}
                    </div>
                </div>
                <span className="text-[20px] font-black text-white tracking-tight">
                    {prefix}{prefix === '₹' ? formatIndianNumber(value) : value.toLocaleString()}{suffix}
                </span>
            </div>

            <div className="relative h-7 flex items-center select-none touch-none px-1">
                {/* Track */}
                <div className="absolute w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    {/* Active Fill */}
                    <div 
                        className="h-full rounded-full transition-all duration-100 ease-out"
                        style={{ 
                            width: `${percentage}%`,
                            backgroundColor: color,
                        }}
                    />
                </div>

                {/* Input */}
                <input 
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={onChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                />

                {/* Thumb */}
                <div 
                    className="absolute h-6 w-6 bg-white rounded-full shadow-xl border-2 z-10 pointer-events-none transition-all duration-100 ease-out hover:scale-110"
                    style={{ 
                        left: `${percentage}%`,
                        transform: 'translateX(-50%)',
                        borderColor: color,
                        boxShadow: `0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px ${color}20`
                    }}
                />
            </div>
            
            <div className="flex justify-between text-[11px] font-medium text-white/30 px-1">
                <span>{prefix}{prefix === '₹' ? formatIndianNumber(min) : min.toLocaleString()}{suffix}</span>
                <span>{prefix}{prefix === '₹' ? formatIndianNumber(max) : max.toLocaleString()}{suffix}</span>
            </div>
        </div>
    );
};

// Premium City Search Input Component
const CitySearchInput = ({ label, placeholder, value, onChange, icon: Icon }) => {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Sync internal query with external value (e.g., from popular cities)
    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    // Filter cities based on search query
    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val); // Update parent state on every change
        
        if (val.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const filtered = cities
            .filter(city => 
                city.name.toLowerCase().includes(val.toLowerCase())
            )
            .slice(0, 8); // Limit results for performance
        
        setResults(filtered);
        setIsOpen(true);
    };

    const handleSelect = (city) => {
        const selection = `${city.name}, ${city.country}`;
        setQuery(selection);
        onChange(selection);
        setIsOpen(false);
    };

    return (
        <div className="relative group">
            <div className={`bg-[#0a0a0a] rounded-2xl border transition-all duration-300 ${
                isFocused ? 'border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/[0.08]'
            } overflow-hidden`}>
                <div className="px-4 pt-3 pb-1">
                    <label className="text-[11px] text-white/40 font-bold uppercase tracking-wider">{label}</label>
                </div>
                <div className="relative flex items-center pr-10">
                    <div className="pl-4 text-white/20">
                        {Icon && <Icon className="w-4.5 h-4.5" />}
                    </div>
                    <input 
                        type="text" 
                        onFocus={() => {
                            setIsFocused(true);
                            if (query.length >= 2) setIsOpen(true);
                        }}
                        onBlur={() => {
                            setIsFocused(false);
                            // Delay hiding to allow for click selection
                            setTimeout(() => setIsOpen(false), 200);
                        }}
                        className="w-full bg-transparent text-white pl-3.5 pr-4 pb-4 pt-1 text-[17px] font-medium outline-none placeholder-white/30 transition-colors"
                        placeholder={placeholder}
                        value={query}
                        onChange={handleSearch}
                    />
                    {query && (
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation();
                                setQuery(''); 
                                onChange(''); 
                                setResults([]); 
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Premium Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 p-1.5 bg-[#0d0d0d]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.map((city, index) => (
                        <button
                            key={`${city.name}-${city.country}-${index}`}
                            onClick={() => handleSelect(city)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-all group/item text-left"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover/item:bg-white/10 transition-colors">
                                <MapPin className="w-4 h-4 text-white/30 group-hover/item:text-white/60" />
                            </div>
                            <div>
                                <div className="text-[15px] font-bold text-white group-hover/item:text-white transition-colors">
                                    {city.name}
                                </div>
                                <div className="text-[11px] text-white/40 font-medium">
                                    {city.subcountry && `${city.subcountry}, `}{city.country}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const InputForm = () => {
    const { inputs, setInputs, setPlanning, setPhase, setProgress, setError, setResults, addLog, saveSession } = usePlannerStore();
    const [localError, setLocalError] = useState('');

    const handleCitySelect = (city) => {
        setInputs({ city });
    };

    const togglePreference = (prefId) => {
        const current = inputs.preferences;
        if (current.includes(prefId)) {
            setInputs({ preferences: current.filter(p => p !== prefId) });
        } else {
            setInputs({ preferences: [...current, prefId] });
        }
    };

    const toggleFoodPreference = (prefId) => {
        // If selecting "no-restrictions", clear all others
        if (prefId === 'no-restrictions') {
            setInputs({ foodPreferences: ['no-restrictions'] });
            return;
        }
        
        // Remove "no-restrictions" if selecting a specific preference
        let updated = (inputs.foodPreferences || ['no-restrictions']).filter(p => p !== 'no-restrictions');
        
        if (updated.includes(prefId)) {
            updated = updated.filter(p => p !== prefId);
            // If nothing selected, default to no-restrictions
            if (updated.length === 0) updated = ['no-restrictions'];
        } else {
            updated.push(prefId);
        }
        setInputs({ foodPreferences: updated });
    };

    const getTransportWarning = (destination, mode) => {
        const dest = destination.toLowerCase();
        if (mode === 'bike' && (dest.includes('antarctica') || dest.includes('arctic') || dest.includes('greenland'))) {
            return '⚠️ Biking not recommended for extreme climates';
        }
        if (mode === 'bike' && dest.includes('mountain')) {
            return '💡 Consider difficulty level for mountainous terrain';
        }
        return null;
    };

    const handleSubmit = async () => {
        if (!inputs.city) {
            setLocalError('Please enter a destination city');
            return;
        }
        if (!origin) {
            setLocalError('Please enter your origin city');
            return;
        }
        setLocalError('');
        setPlanning(true);
        setPhase('planning');
        setProgress('Initializing agent...');
        setError(null);
        saveSession();
        
        try {
            const result = await agentService.generateItinerary(inputs, (phase, message) => {
                setPhase(phase);
                setProgress(message);
                addLog({ phase, message });
            });
            setResults(result.itinerary, result.breakdown, result.theme, result.heroImageQuery);
            setPhase('complete');
            saveSession();
        } catch (err) {
            setError(err.message);
            setPlanning(false);
            setPhase('error');
            saveSession();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up p-6">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] mb-2">
                    <Plane className="w-4 h-4 text-white/60" />
                    <span className="text-[12px] font-bold text-white/60 tracking-wider uppercase">Trip Planner</span>
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Plan Your Journey</h2>
                <p className="text-white/50 text-[16px] max-w-md mx-auto">Customize every detail of your perfect trip with AI-powered recommendations</p>
            </div>

            {/* Origin & Destination Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <MapPin className="w-4 h-4 text-white/40" strokeWidth={2.5} />
                    <h3 className="text-[13px] text-white/60 font-bold tracking-wider uppercase">Journey</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CitySearchInput 
                        label="From"
                        placeholder="Your city"
                        value={inputs.origin}
                        onChange={(val) => setInputs({ origin: val })}
                        icon={MapPin}
                    />
                    <CitySearchInput 
                        label="To"
                        placeholder="Destination"
                        value={inputs.city}
                        onChange={(val) => setInputs({ city: val })}
                        icon={MapPin}
                    />
                </div>
                
                {/* Popular Cities */}
                <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-white/[0.08] text-center">
                    <span className="text-[11px] text-white/30 font-bold uppercase tracking-[0.2em] block mb-4">Popular Destinations</span>
                    <div className="flex gap-2 flex-wrap justify-center">
                        {POPULAR_CITIES.map(city => (
                            <button 
                                key={city}
                                onClick={() => handleCitySelect(city)}
                                className={`text-[13px] font-semibold px-4 py-2 rounded-xl transition-all ${
                                    inputs.city === city 
                                    ? 'bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                                }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transport Mode Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Plane className="w-4 h-4 text-white/40" strokeWidth={2.5} />
                    <h3 className="text-[13px] text-white/60 font-bold tracking-wider uppercase">Transport Mode</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {TRANSPORT_MODES.map(mode => {
                        const Icon = mode.icon;
                        const isSelected = inputs.transportMode === mode.id;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => setInputs({ transportMode: mode.id })}
                                className={`p-4 rounded-xl text-center transition-all border ${
                                    isSelected
                                    ? 'text-white border-white/[0.15]'
                                    : 'bg-[#0a0a0a] text-white/60 hover:text-white border-white/[0.08] hover:bg-white/[0.04]'
                                }`}
                                style={isSelected ? { backgroundColor: `${mode.color}20`, borderColor: mode.color } : {}}
                            >
                                <div 
                                    className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                                    style={{ backgroundColor: isSelected ? `${mode.color}30` : 'rgba(255,255,255,0.06)' }}
                                >
                                    <Icon 
                                        className="w-5 h-5" 
                                        style={{ color: isSelected ? mode.color : 'rgba(255,255,255,0.4)' }}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <div className="text-[14px] font-bold mb-0.5 text-white">
                                    {mode.label}
                                </div>
                                <div className="text-[10px] text-white/50">
                                    {mode.desc}
                                </div>
                            </button>
                        );
                    })}
                </div>
                
                {/* Transport Warning */}
                {getTransportWarning(inputs.city, inputs.transportMode) && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-2 items-start">
                        <Info className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" strokeWidth={2} />
                        <p className="text-[13px] text-yellow-200/90 leading-relaxed">
                            {getTransportWarning(inputs.city, transportMode)}
                        </p>
                    </div>
                )}
            </div>

            {/* Trip Parameters */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Calendar className="w-4 h-4 text-white/40" strokeWidth={2.5} />
                    <h3 className="text-[13px] text-white/60 font-bold tracking-wider uppercase">Trip Details</h3>
                </div>
                <div className="bg-[#0a0a0a] rounded-2xl p-6 space-y-8 border border-white/[0.08]">
                    <ModernSlider 
                        label="Budget"
                        description="Total trip budget"
                        value={inputs.budget}
                        min={5000}
                        max={500000}
                        step={5000}
                        color="#10b981"
                        icon={Wallet}
                        prefix="₹"
                        onChange={(e) => setInputs({ budget: parseInt(e.target.value) })}
                    />
                    
                    <div className="h-[1px] bg-white/[0.06]" />

                    <ModernSlider 
                        label="Duration"
                        description="Number of days"
                        value={inputs.days}
                        min={1}
                        max={7}
                        step={1}
                        color="#3b82f6"
                        icon={Calendar}
                        suffix=" days"
                        onChange={(e) => setInputs({ days: parseInt(e.target.value) })}
                    />
                </div>
            </div>

            {/* Trip Vibe Section (Combined Style & Pace) */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 px-1">
                    <Music className="w-4 h-4 text-white/40" strokeWidth={2.5} />
                    <h3 className="text-[13px] text-white/60 font-bold tracking-wider uppercase">Trip Vibe</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Travel Style Column */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <Hotel className="w-3.5 h-3.5 text-white/30" strokeWidth={2.5} />
                            <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Travel Style</span>
                        </div>
                        <div className="space-y-2">
                        {TRAVEL_STYLES.map(style => (
                            <button
                                key={style.id}
                                onClick={() => setInputs({ travelStyle: style.id })}
                                className={`w-full p-3.5 rounded-xl flex items-center justify-between transition-all border ${
                                    inputs.travelStyle === style.id
                                    ? 'text-white border-white/[0.15]'
                                    : 'bg-[#0a0a0a] text-white/60 hover:text-white border-white/[0.08] hover:bg-white/[0.04]'
                                }`}
                                style={inputs.travelStyle === style.id ? { backgroundColor: `${style.color}20`, borderColor: style.color } : {}}
                            >
                                <div className="text-left">
                                    <div className="text-[14px] font-bold text-white leading-none mb-1">{style.label}</div>
                                    <div className="text-[10px] text-white/40">{style.desc}</div>
                                </div>
                                {inputs.travelStyle === style.id && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />}
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Pace Column */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <Users className="w-3.5 h-3.5 text-white/30" strokeWidth={2.5} />
                            <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Trip Pace</span>
                        </div>
                        <div className="space-y-2">
                        {PACE_OPTIONS.map(option => (
                            <button
                                key={option.id}
                                onClick={() => setInputs({ pace: option.id })}
                                className={`w-full p-3.5 rounded-xl flex items-center justify-between transition-all border ${
                                    inputs.pace === option.id
                                    ? 'text-white border-white/[0.15]'
                                    : 'bg-[#0a0a0a] text-white/60 hover:text-white border-white/[0.08] hover:bg-white/[0.04]'
                                }`}
                                style={inputs.pace === option.id ? { backgroundColor: `${option.color}20`, borderColor: option.color } : {}}
                            >
                                <div className="text-left">
                                    <div className="text-[14px] font-bold text-white leading-none mb-1">{option.label}</div>
                                    <div className="text-[10px] text-white/40">{option.desc}</div>
                                </div>
                                {inputs.pace === option.id && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: option.color }} />}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Food Preferences */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Utensils className="w-4 h-4 text-white/40" strokeWidth={2.5} />
                    <h3 className="text-[13px] text-white/60 font-bold tracking-wider uppercase">Food Preferences</h3>
                    <span className="text-[11px] text-white/30 ml-auto">Select all that apply</span>
                </div>
                <div className="bg-[#0a0a0a] rounded-2xl p-3 border border-white/[0.08]">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {FOOD_PREFERENCES.map(pref => {
                            const Icon = pref.icon;
                            const isSelected = (inputs.foodPreferences || ['no-restrictions']).includes(pref.id);
                            return (
                                <button
                                    key={pref.id}
                                    onClick={() => toggleFoodPreference(pref.id)}
                                    className={`flex items-center gap-2.5 p-3 rounded-xl text-[13px] font-semibold transition-all border ${
                                        isSelected
                                        ? 'text-white border-white/[0.15]'
                                        : 'bg-transparent text-white/50 hover:text-white border-white/[0.06] hover:bg-white/[0.04]'
                                    }`}
                                    style={isSelected ? { backgroundColor: `${pref.color}20`, borderColor: pref.color } : {}}
                                >
                                    <div 
                                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: isSelected ? `${pref.color}30` : 'rgba(255,255,255,0.06)' }}
                                    >
                                        <Icon 
                                            className="w-3.5 h-3.5" 
                                            style={{ color: isSelected ? pref.color : 'rgba(255,255,255,0.4)' }}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <span className="flex-1 text-left">{pref.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Interests */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <Theater className="w-4 h-4 text-white/40" strokeWidth={2.5} />
                    <h3 className="text-[13px] text-white/60 font-bold tracking-wider uppercase">Interests</h3>
                    <span className="text-[11px] text-white/30 ml-auto">Select all that apply</span>
                </div>
                <div className="bg-[#0a0a0a] rounded-2xl p-3 border border-white/[0.08]">
                    <div className="grid grid-cols-2 gap-2">
                        {PREFERENCES.map(pref => {
                            const Icon = pref.icon;
                            const isSelected = inputs.preferences.includes(pref.id);
                            return (
                                <button
                                    key={pref.id}
                                    onClick={() => togglePreference(pref.id)}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl text-[14px] font-semibold transition-all border ${
                                        isSelected
                                        ? 'text-white border-white/[0.15]'
                                        : 'bg-transparent text-white/50 hover:text-white border-white/[0.06] hover:bg-white/[0.04]'
                                    }`}
                                    style={isSelected ? { backgroundColor: `${pref.color}20`, borderColor: pref.color } : {}}
                                >
                                    <div 
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: isSelected ? `${pref.color}30` : 'rgba(255,255,255,0.06)' }}
                                    >
                                        <Icon 
                                            className="w-4 h-4" 
                                            style={{ color: isSelected ? pref.color : 'rgba(255,255,255,0.4)' }}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <span>{pref.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" strokeWidth={2} />
                <div className="text-[13px] text-blue-200/80 leading-relaxed">
                    <span className="font-semibold text-blue-100">Pro Tip:</span> The more details you provide, the better our AI can tailor your perfect itinerary. Don't worry—you can always regenerate!
                </div>
            </div>

            {/* Error Message */}
            {localError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center font-semibold text-[15px] animate-shake">
                    {localError}
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 pb-8">
                <button 
                    onClick={handleSubmit}
                    className="w-full bg-white hover:bg-white/90 text-black font-bold text-[17px] py-4 rounded-xl transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2.5"
                >
                    <Wand2 className="w-5 h-5" strokeWidth={2.5} />
                    Generate My Itinerary
                </button>
            </div>
        </div>
    );
};

export default InputForm;
