import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Wallet, Calendar } from 'lucide-react';

const BudgetChart = ({ breakdown }) => {
    if (!breakdown) return null;

    // iOS System Colors
    const CHART_COLORS = [
        '#35C759', // Green
        '#007AFF', // Blue
        '#FF3B30', // Red
        '#FF9500', // Orange
        '#AF52DE', // Purple
        '#FF2D55', // Pink
        '#5856D6'  // Indigo
    ];

    // Handle both formats: breakdown.categoryData or breakdown.byCategory
    let categoryData = breakdown.categoryData;
    let dailyCosts = breakdown.dailyCosts;

    // Transform byCategory format to categoryData format if needed
    if (!categoryData && breakdown.byCategory) {
        categoryData = Object.entries(breakdown.byCategory).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
        }));
    }

    // If still no data, return null
    if (!categoryData || categoryData.length === 0) return null;

    // Calculate total and percentages
    const totalCost = breakdown.totalCost || categoryData.reduce((sum, cat) => sum + cat.value, 0);
    const categoryWithPercentages = categoryData.map(cat => ({
        ...cat,
        percentage: ((cat.value / totalCost) * 100).toFixed(1)
    }));

    // Find highest spending category
    const highestCategory = categoryWithPercentages.reduce((max, cat) => 
        cat.value > max.value ? cat : max, categoryWithPercentages[0]);

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Cost */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.06] hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet className="w-4 h-4 text-emerald-400/70" />
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Total Cost</p>
                    </div>
                    <p className="text-2xl font-black text-white/90">₹{totalCost.toLocaleString()}</p>
                </div>

                {/* Highest Category */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.06] hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-400/70" />
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Top Category</p>
                    </div>
                    <p className="text-2xl font-black text-white/90">{highestCategory.name}</p>
                    <p className="text-[11px] text-white/30 mt-1">₹{highestCategory.value.toLocaleString()} ({highestCategory.percentage}%)</p>
                </div>

                {/* Categories Count */}
                <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.06] hover:border-white/10 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-purple-400/70" />
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Categories</p>
                    </div>
                    <p className="text-2xl font-black text-white/90">{categoryData.length}</p>
                    <p className="text-[11px] text-white/30 mt-1">Spending areas</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className={`grid grid-cols-1 ${dailyCosts && dailyCosts.length > 0 ? 'md:grid-cols-2' : ''} gap-6`}>
                {/* Pie Chart */}
                <div className="space-y-4">
                    <h4 className="text-[13px] font-bold text-white/60 uppercase tracking-wider">Category Distribution</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(18, 18, 20, 0.95)', 
                                        backdropFilter: 'blur(12px)',
                                        borderColor: 'rgba(255,255,255,0.08)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        
                        {/* Legend */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center -mt-8 relative z-10 px-4">
                            {categoryData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-1.5 text-[11px] font-medium text-white/40 uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                                    <span>{entry.name}: ₹{entry.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar Chart - Only show if dailyCosts exists */}
                {dailyCosts && dailyCosts.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-[13px] font-bold text-white/60 uppercase tracking-wider">Daily Spending</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyCosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis 
                                    dataKey="day" 
                                    stroke="rgba(235, 235, 245, 0.4)" 
                                    fontSize={12} 
                                    tickFormatter={(val) => `Day ${val}`}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="rgba(235, 235, 245, 0.4)" 
                                    fontSize={12} 
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(18, 18, 20, 0.95)', 
                                        backdropFilter: 'blur(12px)',
                                        borderColor: 'rgba(255,255,255,0.08)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="cost" fill="#35C759" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                )}
            </div>

            {/* Detailed Category Breakdown */}
            <div className="space-y-3">
                <h4 className="text-[13px] font-bold text-white/60 uppercase tracking-wider">Detailed Breakdown</h4>
                <div className="space-y-2">
                    {categoryWithPercentages.map((cat, index) => (
                        <div key={index} className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm rounded-xl p-4 border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-3 h-3 rounded-full shadow-lg" 
                                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                    />
                                    <span className="text-[15px] font-bold text-white/80">{cat.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[15px] font-bold text-white/90">₹{cat.value.toLocaleString()}</p>
                                    <p className="text-[11px] text-white/30">{cat.percentage}% of total</p>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ 
                                        width: `${cat.percentage}%`,
                                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                                        opacity: 0.8
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BudgetChart;
