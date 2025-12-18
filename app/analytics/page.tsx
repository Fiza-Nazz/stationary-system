'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DollarSign, TrendingUp, Calendar, Activity, BarChart3, RefreshCw, TrendingDown, Zap, Award, Sparkles, Users, ShoppingBag, Home } from 'lucide-react';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
// Helper function to format numbers (removes decimals, adds K for thousands)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return Math.round(num).toString();
};
// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-PK', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};
// ----------------------
// StatCard Component - Enhanced for mobile responsiveness with shimmer effect
// ----------------------
const StatCard: React.FC<{
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  gradient?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}> = ({ title, value, prefix = '', suffix = '', gradient = 'from-blue-600 to-blue-700', icon, trend }) => {
  return (
    <div className="group relative bg-white rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100">
      {/* Shimmer background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
      {/* Subtle Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-8 transition-opacity duration-500 blur-sm`}></div>
    
      <div className="relative z-10">
        {/* Responsive icon and trend layout with pulse */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
            <div className="relative scale-90 sm:scale-100">
              {icon}
            </div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold ${trend >= 0 ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-md' : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-md'}`}>
              {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span className="text-[10px] sm:text-sm">{Math.abs(trend).toFixed(0)}%</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide mb-1.5 sm:mb-2 group-hover:text-gray-800 transition-colors">{title}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 break-words group-hover:text-gray-800 transition-colors">
          {prefix}{suffix === '%' ? value.toFixed(1) : formatNumber(value)}{suffix}
        </h2>
      </div>
    </div>
  );
};
// ----------------------
// Loading Skeleton Component
// ----------------------
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl"></div>
      <div className="w-12 h-5 bg-gray-300 rounded-xl"></div>
    </div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
  </div>
);
// ----------------------
// Main Analytics Page - Fully Responsive with Enhanced UI/UX
// ----------------------
export default function AnalyticsPage() {
  const router = useRouter();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Fetch sales data from /api/reports - This ensures daily records are fetched and displayed per date
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      // Sort by date to ensure chronological order for daily tracking
      const sortedData = data.sort((a: any, b: any) => new Date(a._id).getTime() - new Date(b._id).getTime());
      setSalesData(sortedData); // Daily records: each entry has date (_id), totalSales, totalProfit
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSalesData();
  }, []);
  // ----------------------
  // Calculations - Tracks cumulative and daily metrics
  // ----------------------
  const totalSales = salesData.reduce((acc, cur) => acc + cur.totalSales, 0);
  const totalProfit = salesData.reduce((acc, cur) => acc + cur.totalProfit, 0);
  const avgSales = salesData.length ? totalSales / salesData.length : 0;
  const profitMargin = totalSales ? (totalProfit / totalSales) * 100 : 0;
  // Calculate trends (compare last day with average) - Daily tracking insight
  const lastDaySales = salesData.length > 0 ? salesData[salesData.length - 1].totalSales : 0;
  const salesTrend = avgSales > 0 ? ((lastDaySales - avgSales) / avgSales) * 100 : 0;
  // Find best performing day - Highlights top daily record
  const bestDay = salesData.reduce((max, day) => day.totalSales > max.totalSales ? day : max, salesData[0] || { totalSales: 0, totalProfit: 0, _id: 'N/A' });
  // ----------------------
  // Enhanced Chart Data with Shadows and Modern Styling
  // ----------------------
  const chartData = {
    labels: salesData.map(d => formatDate(d._id)), // Ensures per-day labels
    datasets: [
      {
        label: 'Daily Sales (Rs)',
        data: salesData.map(d => d.totalSales), // Per day sales
        borderColor: function(context: any) {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, '#1e3a8a');
          gradient.addColorStop(0.5, '#3b82f6');
          gradient.addColorStop(1, '#60a5fa');
          return gradient;
        },
        backgroundColor: function(context: any) {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(30, 58, 138, 0.1)');
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
          gradient.addColorStop(1, 'rgba(96, 165, 250, 0.02)');
          return gradient;
        },
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: function(context: any) {
          return '#3b82f6';
        },
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointStyle: 'circle',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 12,
        shadowColor: 'rgba(59, 130, 246, 0.3)',
      },
      {
        label: 'Daily Profit (Rs)',
        data: salesData.map(d => d.totalProfit), // Per day profit
        borderColor: function(context: any) {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, '#059669');
          gradient.addColorStop(0.5, '#10b981');
          gradient.addColorStop(1, '#34d399');
          return gradient;
        },
        backgroundColor: function(context: any) {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(5, 150, 105, 0.1)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)');
          gradient.addColorStop(1, 'rgba(52, 211, 153, 0.02)');
          return gradient;
        },
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: function(context: any) {
          return '#10b981';
        },
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointStyle: 'circle',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 12,
        shadowColor: 'rgba(16, 185, 129, 0.3)',
      },
    ],
  };
  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 15,
            weight: 'bold',
            family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          },
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.98)',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: '#ffffff',
        borderWidth: 1.5,
        cornerRadius: 16,
        padding: 20,
        titleFont: {
          size: 15,
          weight: 'bold',
          family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        },
        bodyFont: {
          size: 14,
          family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        },
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 4,
        callbacks: {
          title: function(tooltipItems: any[]) {
            const date = tooltipItems[0].label;
            return [`📅 ${date}`];
          },
          label: function(context: any) {
            const index = context.dataIndex;
            const dayData = salesData[index];
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += `Rs. ${formatNumber(context.parsed.y)}`;
            return `${label} • Sales: Rs. ${formatNumber(dayData?.totalSales || 0)} | Profit: Rs. ${formatNumber(dayData?.totalProfit || 0)}`;
          },
          afterBody: function(context: any[]) {
            const index = context[0].dataIndex;
            const margin = salesData[index]?.totalSales ? ((salesData[index].totalProfit / salesData[index].totalSales) * 100).toFixed(1) : '0';
            return [`💰 Margin: ${margin}%`];
          }
        }
      },
      title: {
        display: true,
        text: '📊 Daily Sales & Profit Trends - Track Your Growth',
        font: {
          size: 20,
          weight: 'bold',
          family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        },
        color: '#1f2937',
        padding: {
          top: 15,
          bottom: 25,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: function(context: any) {
            return context.tick.value === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.025)';
          },
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
            family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          },
          color: '#6b7280',
          callback: function(value: any) {
            return 'Rs. ' + formatNumber(value);
          },
          padding: 15,
          stepSize: salesData.length > 0 ? Math.ceil((Math.max(...salesData.map(d => Math.max(d.totalSales, d.totalProfit))) / 5) / 1000) * 1000 : 1000,
        },
        title: {
          display: true,
          text: '💵 Amount (Rs)',
          font: {
            size: 15,
            weight: 'bold',
            family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          },
          color: '#374151',
          padding: {
            bottom: 15,
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
            family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          },
          color: '#6b7280',
          padding: 15,
          maxRotation: 45,
          minRotation: 0,
        },
        title: {
          display: true,
          text: '📅 Date (Daily Records)',
          font: {
            size: 15,
            weight: 'bold',
            family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          },
          color: '#374151',
          padding: {
            top: 15,
          }
        }
      },
    },
    animation: {
      duration: 2500,
      easing: 'easeOutBounce',
    },
    elements: {
      point: {
        hoverBorderWidth: 6,
        hoverBackgroundColor: '#ffffff',
      },
      line: {
        borderWidth: 4,
      }
    },
  };
  if (!mounted) {
    return null;
  }
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced Background with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white opacity-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-500/5 to-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-green-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      {/* Main container - responsive padding */}
      <div className="relative z-10 max-w-[1600px] mx-auto p-3 sm:p-4 md:p-5">
        {/* Premium Header - Enhanced with glow and animation */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 rounded-2xl shadow-2xl mb-6 sm:mb-8 overflow-hidden border-b-4 border-amber-500 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
         
          {/* Responsive header layout: stacked on mobile, horizontal on tablet+ */}
          <div className="relative p-4 sm:p-5 md:p-6">
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                {/* Logo - enhanced with glow */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-60"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-amber-400/50">
                    <img
                      src="/logo.png"
                      alt="Habib Dukan Logo"
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-red-700 bg-gradient-to-br from-red-100 to-amber-100 rounded-xl">د</div>';
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Brand Text - with sparkle effect */}
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-sm sm:text-base md:text-lg font-semibold tracking-wider">HABIB DUKAN - Analytics Dashboard</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" strokeWidth={2.5} />
                    <p className="text-amber-100 text-xs sm:text-sm font-bold">Real-time Business Intelligence • Daily Tracking Enabled</p>
                  </div>
                </div>
              </div>
              {/* Buttons Container */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Home Button - New addition with professional styling */}
                <button
                  onClick={() => router.push('/')}
                  className="group relative w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-300 text-gray-900 text-sm sm:text-base font-bold rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 relative z-10" strokeWidth={2.5} />
                  <span className="relative z-10 font-semibold">Home</span>
                </button>
                {/* Refresh Button - enhanced with icon animation */}
                <button
                  onClick={fetchSalesData}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-300 text-gray-900 text-sm sm:text-base font-bold rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-900 relative z-10 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  <span className="relative z-10">Refresh Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Summary Cards - Enhanced grid with loading skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                title="Total Sales"
                value={totalSales}
                prefix="Rs "
                gradient="from-red-600 to-red-700"
                icon={<DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />}
                trend={salesTrend}
                color="red"
              />
              <StatCard
                title="Total Profit"
                value={totalProfit}
                prefix="Rs "
                gradient="from-green-600 to-green-700"
                icon={<TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />}
                color="green"
              />
              <StatCard
                title="Daily Average"
                value={avgSales}
                prefix="Rs "
                gradient="from-purple-600 to-purple-700"
                icon={<Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />}
                color="purple"
              />
              <StatCard
                title="Profit Margin"
                value={profitMargin}
                suffix="%"
                gradient="from-amber-600 to-amber-700"
                icon={<Activity className="w-6 h-6 text-white" strokeWidth={2.5} />}
                color="amber"
              />
            </>
          )}
        </div>
        {/* Chart and Best Day Grid - Enhanced with borders and shadows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Line Chart - Full width on mobile/tablet, 2 cols on desktop - Enhanced container */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-green-50/30"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-gray-100 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>📈 Performance Trend</h2>
                <p className="text-sm text-gray-600 font-medium mt-1">Daily Sales & Profit Tracking • Last {salesData.length} Days</p>
              </div>
            </div>
            {loading ? (
              <div className="py-16 sm:py-20 flex flex-col items-center justify-center relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6 relative"></div>
                <p className="text-gray-600 font-bold text-base sm:text-lg">Loading Insights...</p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              </div>
            ) : salesData.length === 0 ? (
              <div className="py-16 sm:py-20 text-center relative z-10">
                <BarChart3 className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6 animate-bounce" />
                <p className="text-gray-500 font-bold text-lg sm:text-xl">No Data Yet</p>
                <p className="text-gray-400 text-sm sm:text-base mt-2">Start tracking sales to unlock powerful insights ✨</p>
              </div>
            ) : (
              <div className="h-72 sm:h-80 md:h-96 relative z-10">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
          {/* Best Performing Day Card - Enhanced with confetti-like accents - Updated to white bg with black text for visibility */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden transform hover:scale-105 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-white/30"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full opacity-20 -mr-20 -mt-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-100 rounded-full opacity-20 -ml-16 -mb-16 animate-pulse delay-300"></div>
          
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-green-800 text-xs font-bold uppercase tracking-wide" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>🏆 Top Performing Day</p>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>{formatDate(bestDay._id)}</h3>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 mt-5 sm:mt-6">
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1.5" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Sales</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Rs {formatNumber(bestDay.totalSales)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1.5" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Profit</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Rs {formatNumber(bestDay.totalProfit)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-1.5" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Margin</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                    {bestDay.totalSales ? ((bestDay.totalProfit / bestDay.totalSales) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Daily Sales Table - Enhanced with zebra stripes and hover effects */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6 border-b-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>📋 Daily Breakdown</h2>
                <p className="text-sm text-gray-600 font-medium mt-1">Track Every Sale & Profit by Date</p>
              </div>
            </div>
          </div>
          {/* Table with horizontal scroll on mobile - Enhanced rows */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-gradient-to-r from-red-700 to-amber-700 text-white">
                  <th className="text-left p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Date</span>
                      <span className="sm:hidden">Date</span>
                    </div>
                  </th>
                  <th className="text-right p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base">
                    <div className="flex items-center justify-end gap-2.5">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                      <span>Sales</span>
                    </div>
                  </th>
                  <th className="text-right p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base">
                    <div className="flex items-center justify-end gap-2.5">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                      <span>Profit</span>
                    </div>
                  </th>
                  <th className="text-center p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base">
                    <div className="flex items-center justify-center gap-2.5">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                      <span>Margin</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-gray-600 font-bold text-base sm:text-lg">Fetching Daily Records...</p>
                        <div className="mt-3 space-y-2">
                          <div className="h-2 bg-gray-200 rounded-full w-48 animate-pulse"></div>
                          <div className="h-2 bg-gray-200 rounded-full w-32 animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : salesData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 sm:py-20">
                      <div className="flex flex-col items-center px-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                          <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-bold text-lg sm:text-xl">No Daily Records Yet</p>
                        <p className="text-gray-400 text-sm sm:text-base mt-2">Your sales data will appear here as you track transactions 💼</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  salesData.map((r, index) => {
                    const margin = r.totalSales ? ((r.totalProfit / r.totalSales) * 100) : 0;
                    return (
                      <tr
                        key={r._id}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-amber-50/80 hover:to-red-50/80 transition-all duration-300 transform hover:scale-[1.01] ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="p-4 sm:p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                              <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-700" strokeWidth={2} />
                            </div>
                            <div>
                              <span className="font-bold text-sm sm:text-base text-gray-900 block" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>{formatDate(r._id)}</span>
                              <span className="text-xs text-gray-500">Day {index + 1}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <span className="font-bold text-lg sm:text-xl text-gray-900 whitespace-nowrap inline-flex items-center gap-1" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                            Rs {formatNumber(r.totalSales)} <ShoppingBag className="w-4 h-4 text-green-600" />
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <span className="inline-flex items-center gap-2 bg-green-100/80 text-green-800 px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-base shadow-sm whitespace-nowrap" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                            <TrendingUp className="w-4 h-4" />
                            Rs {formatNumber(r.totalProfit)}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap shadow-sm ${
                            margin >= 30 ? 'bg-green-100/80 text-green-800' :
                            margin >= 20 ? 'bg-yellow-100/80 text-yellow-800' :
                            'bg-red-100/80 text-red-800'
                          }`} style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                            {margin.toFixed(1)}% <Activity className="w-4 h-4" />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Footer - Enhanced with total summary */}
          {!loading && salesData.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-5 border-t-2 border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                  <span className="font-bold text-sm sm:text-base">Tracking {salesData.length} Daily Records</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold">
                  Last Updated: {new Date().toLocaleString('en-PK', { hour12: false })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}