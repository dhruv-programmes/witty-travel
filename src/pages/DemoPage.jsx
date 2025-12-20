import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DayCard from '../components/DayCard';
import BudgetChart from '../components/BudgetChart';
import { RefreshCw, MapPin, Wallet, ArrowLeft, Layers, Map } from 'lucide-react';
import { searchDayImage } from '../services/pexelsService';

// Enhanced demo data for Japan trip with new features
const demoData = {
    inputs: {
        city: 'Tokyo',
        days: 3,
        budget: 50000,
        preferences: ['sightseeing', 'food', 'culture']
    },
    heroImageQuery: 'Japan Mount Fuji cherry blossom landscape',
    itinerary: [
        {
            day: 1,
            daySummary: 'Discover Tokyo\'s iconic landmarks and traditional culture',
            highlights: ['Ancient temples', 'Tokyo Skytree', 'Shibuya Crossing'],
            imageSearchQuery: 'Tokyo Skytree sunset cityscape',
            activities: [
                {
                    name: 'Senso-ji Temple',
                    description: 'Visit Tokyo\'s oldest temple in Asakusa, explore the Nakamise shopping street',
                    time: '09:00',
                    duration: 2,
                    cost: 0,
                    category: 'sightseeing'
                },
                {
                    name: 'Tokyo Skytree',
                    description: 'Observation deck visit with panoramic views of Tokyo',
                    time: '12:00',
                    duration: 2,
                    cost: 2500,
                    category: 'sightseeing'
                },
                {
                    name: 'Sushi Lunch at Tsukiji',
                    description: 'Fresh sushi at the outer Tsukiji market',
                    time: '14:30',
                    duration: 1.5,
                    cost: 3500,
                    category: 'food'
                },
                {
                    name: 'Shibuya Crossing & Shopping',
                    description: 'Experience the famous scramble crossing and explore Shibuya',
                    time: '17:00',
                    duration: 3,
                    cost: 2000,
                    category: 'sightseeing'
                }
            ]
        },
        {
            day: 2,
            daySummary: 'Immerse in modern art and traditional Japanese dining',
            highlights: ['Meiji Shrine', 'Digital art museum', 'Izakaya experience'],
            imageSearchQuery: 'Shibuya Crossing Tokyo night lights',
            activities: [
                {
                    name: 'Meiji Shrine',
                    description: 'Peaceful Shinto shrine in a forested area',
                    time: '08:30',
                    duration: 1.5,
                    cost: 0,
                    category: 'culture'
                },
                {
                    name: 'Harajuku & Takeshita Street',
                    description: 'Explore trendy fashion district and street food',
                    time: '10:30',
                    duration: 2,
                    cost: 1500,
                    category: 'shopping'
                },
                {
                    name: 'Ramen Lunch',
                    description: 'Authentic Tokyo-style ramen experience',
                    time: '13:00',
                    duration: 1,
                    cost: 1200,
                    category: 'food'
                },
                {
                    name: 'teamLab Borderless',
                    description: 'Digital art museum with immersive installations',
                    time: '15:00',
                    duration: 3,
                    cost: 3200,
                    category: 'culture'
                },
                {
                    name: 'Izakaya Dinner',
                    description: 'Traditional Japanese pub experience in Shinjuku',
                    time: '19:00',
                    duration: 2,
                    cost: 3000,
                    category: 'food'
                }
            ]
        },
        {
            day: 3,
            daySummary: 'Explore historic gardens and vibrant pop culture districts',
            highlights: ['Imperial Palace', 'Akihabara', 'Kaiseki dinner'],
            imageSearchQuery: 'Tokyo Imperial Palace gardens cherry blossom',
            activities: [
                {
                    name: 'Tsukiji Outer Market',
                    description: 'Morning food tour and breakfast',
                    time: '07:00',
                    duration: 2,
                    cost: 2000,
                    category: 'food'
                },
                {
                    name: 'Imperial Palace East Gardens',
                    description: 'Stroll through historic palace gardens',
                    time: '10:00',
                    duration: 1.5,
                    cost: 0,
                    category: 'sightseeing'
                },
                {
                    name: 'Akihabara Electric Town',
                    description: 'Explore anime, manga, and electronics district',
                    time: '12:00',
                    duration: 3,
                    cost: 2500,
                    category: 'shopping'
                },
                {
                    name: 'Ueno Park & Museums',
                    description: 'Visit Tokyo National Museum and park',
                    time: '16:00',
                    duration: 2.5,
                    cost: 1000,
                    category: 'culture'
                },
                {
                    name: 'Farewell Kaiseki Dinner',
                    description: 'Traditional multi-course dinner in Ginza',
                    time: '19:30',
                    duration: 2,
                    cost: 5000,
                    category: 'food'
                }
            ]
        }
    ],
    breakdown: {
        totalCost: 29900,
        byCategory: {
            sightseeing: 4500,
            food: 15200,
            culture: 4200,
            shopping: 4000
        }
    },
    theme: ['from-red-600', 'to-white']
};

const DemoPage = () => {
    const navigate = useNavigate();
    const [dayImages, setDayImages] = useState({});
    const [imagesLoading, setImagesLoading] = useState(true);
    const [heroImage, setHeroImage] = useState(null);
    const [heroImageLoading, setHeroImageLoading] = useState(true);

    // Fetch hero image
    useEffect(() => {
        const fetchHeroImage = async () => {
            const cachedHero = sessionStorage.getItem('demoHeroImage');
            if (cachedHero) {
                setHeroImage(JSON.parse(cachedHero));
                setHeroImageLoading(false);
                return;
            }

            setHeroImageLoading(true);
            try {
                const image = await searchDayImage('Tokyo', 0, demoData.heroImageQuery);
                setHeroImage(image);
                sessionStorage.setItem('demoHeroImage', JSON.stringify(image));
            } catch (error) {
                console.error('Failed to fetch hero image:', error);
            } finally {
                setHeroImageLoading(false);
            }
        };

        fetchHeroImage();
    }, []);

    // Fetch day images
    useEffect(() => {
        const fetchDemoImages = async () => {
            const cachedImages = sessionStorage.getItem('demoImages');
            if (cachedImages) {
                setDayImages(JSON.parse(cachedImages));
                setImagesLoading(false);
                return;
            }

            setImagesLoading(true);
            const imagePromises = demoData.itinerary.map(async (day) => {
                const image = await searchDayImage('Tokyo', day.day, day.imageSearchQuery);
                return { day: day.day, image };
            });

            try {
                const results = await Promise.all(imagePromises);
                const imagesMap = {};
                results.forEach(({ day, image }) => {
                    imagesMap[day] = image;
                });
                setDayImages(imagesMap);
                sessionStorage.setItem('demoImages', JSON.stringify(imagesMap));
            } catch (error) {
                console.error('Failed to fetch demo images:', error);
            } finally {
                setImagesLoading(false);
            }
        };

        fetchDemoImages();
    }, []);

    const formatMoney = (amount) => {
        if (amount === 0) return '₹0';
        if (!amount && amount !== 0) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get gradient for Tokyo
    const gradientFrom = demoData.theme[0];
    const gradientTo = demoData.theme[1];

    return (
        <div className="relative isolate min-h-screen -mx-4 -mt-4">
            {/* Hero Image Section */}
            {heroImage && !heroImageLoading ? (
                <div className="relative h-[400px] overflow-hidden">
                    <img 
                        src={heroImage.srcMedium} 
                        alt="Tokyo region hero"
                        className="w-full h-full object-cover"
                    />
                    {/* Static gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-30`} />
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
                            <span className="text-[12px] font-bold text-white tracking-widest uppercase shadow-black drop-shadow-md">Demo Trip</span>
                        </div>
                        <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                            {demoData.inputs.city}
                        </h2>
                        <div className="flex items-center gap-4 text-ios-label-secondary text-[17px] font-medium">
                            <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{demoData.inputs.days} Days</span>
                            <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{formatMoney(demoData.inputs.budget)} Budget</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => navigate('/')}
                            className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                    </div>
                </div>

                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cost Card */}
                    <div className="ios-glass-card p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-ios-green/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wallet className="w-6 h-6 text-ios-green" />
                        </div>
                        <p className="text-[13px] font-bold text-ios-label-secondary uppercase tracking-widest mb-2">Total Cost</p>
                        <p className="text-4xl font-bold text-white tracking-tighter">{formatMoney(demoData.breakdown.totalCost)}</p>
                        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase bg-ios-green/20 text-ios-green">
                            Within Budget
                        </div>
                    </div>

                    {/* Remaining Card */}
                    <div className="ios-glass-card p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-ios-blue/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Layers className="w-6 h-6 text-ios-blue" />
                        </div>
                        <p className="text-[13px] font-bold text-ios-label-secondary uppercase tracking-widest mb-2">Remaining</p>
                        <p className="text-4xl font-bold text-ios-green tracking-tighter">{formatMoney(demoData.inputs.budget - demoData.breakdown.totalCost)}</p>
                        <p className="text-[12px] text-ios-label-tertiary mt-4 font-medium">
                            0 optimizations performed
                        </p>
                    </div>

                    {/* Activities Card */}
                    <div className="ios-glass-card p-6 relative overflow-hidden group hover:bg-white/10 transition-colors duration-300">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-ios-purple/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Map className="w-6 h-6 text-ios-purple" />
                        </div>
                        <p className="text-[13px] font-bold text-ios-label-secondary uppercase tracking-widest mb-2">Activities</p>
                        <p className="text-4xl font-bold text-white tracking-tighter">{demoData.itinerary.reduce((sum, day) => sum + day.activities.length, 0)}</p>
                        <p className="text-[12px] text-ios-label-tertiary mt-4 font-medium">
                            Across {demoData.inputs.days} days
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-1 h-8 bg-ios-purple rounded-full"></span>
                            Itinerary Timeline
                        </h3>
                        <span className="text-[13px] font-bold text-ios-blue bg-ios-blue/10 px-4 py-2 rounded-full border border-ios-blue/20">
                            {demoData.itinerary.length} Day Passes
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-8">
                        {demoData.itinerary.map((day, index) => (
                            <div key={day.day} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <DayCard 
                                    day={day.day} 
                                    activities={day.activities} 
                                    destination={demoData.inputs.city}
                                    dayImage={dayImages[day.day]}
                                    imageLoading={imagesLoading}
                                    daySummary={day.daySummary}
                                    highlights={day.highlights}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Breakdown - Moved to End */}
                <div className="ios-glass-card p-8 mt-8 border-t border-white/5">
                    <h3 className="text-[15px] font-bold text-white uppercase tracking-widest mb-6">Budget Breakdown</h3>
                    <BudgetChart breakdown={demoData.breakdown} />
                </div>
            </div>
        </div>
    );
};

export default DemoPage;
