'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Activity
} from 'lucide-react';

// TypeScript Interfaces
interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  todaysSales: number;
  lowStockCount: number;
  totalProfit: number;
  lastUpdated?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  prefix?: string;
  suffix?: string;
  isWarning?: boolean;
  delay?: number;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
}> = ({ value, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const safeValue = Number(value) || 0;
    const duration = 1500;
    const steps = 60;
    const increment = safeValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        const newCount = Math.min(Math.floor(increment * currentStep), safeValue);
        setCount(newCount);
      } else {
        clearInterval(timer);
        setCount(safeValue);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  const safeCount = Number(count) || 0;

  return (
    <span className="font-bold">
      {prefix}
      {Math.floor(safeCount).toLocaleString()}
      {suffix}
    </span>
  );
};

// Loading Skeleton Component - Enhanced for responsiveness
const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-slate-100 shadow-lg">
      <div className="animate-pulse space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg sm:rounded-xl" />
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-200 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-3 sm:h-4 bg-slate-200 rounded w-20 sm:w-24" />
          <div className="h-6 sm:h-8 bg-slate-200 rounded w-24 sm:w-32" />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component - Fully Responsive
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  gradient,
  prefix = '',
  suffix = '',
  isWarning = false,
  delay = 0
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const safeValue = Number(value) || 0;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [safeValue]);

  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`animate-fadeInUp relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 shadow-lg hover:shadow-2xl group ${
        isWarning ? 'border-red-200' : 'border-slate-100'
      } ${isAnimating ? 'scale-105' : ''}`}
    >
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Warning pulse animation - Responsive positioning */}
      {isWarning && safeValue > 0 && (
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping absolute" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
          </div>
        </div>
      )}

      <div className="relative space-y-3 sm:space-y-4">
        {/* Icon and Title - Responsive sizing */}
        <div className="flex items-center justify-between">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          </div>
          {isWarning && safeValue > 0 && (
            <div className="flex items-center gap-1 text-red-600 text-[10px] sm:text-xs font-bold bg-red-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden xs:inline">Alert</span>
              <span className="xs:hidden">!</span>
            </div>
          )}
        </div>

        {/* Stats - Responsive text sizing */}
        <div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-0.5 sm:mb-1">{title}</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
            <AnimatedCounter value={safeValue} prefix={prefix} suffix={suffix} />
          </h3>
        </div>

        {/* Trend indicator - Responsive */}
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 font-semibold">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>Live Data</span>
        </div>
      </div>
    </div>
  );
};

// Error State Component - Enhanced responsiveness
const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry
}) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 animate-fadeInUp">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 text-center">
        Failed to Load Dashboard
      </h3>
      <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 text-center max-w-md px-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-700 to-red-900 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
};

// Empty State Component - Enhanced responsiveness
const EmptyState: React.FC = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 animate-fadeInUp">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 text-center">
        Welcome to Your Dashboard
      </h3>
      <p className="text-sm sm:text-base text-slate-600 text-center max-w-md px-4">
        Start by adding products to your inventory to see statistics here.
      </p>
    </div>
  );
};

// Main Dashboard Component - Fully Responsive
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dashboard API Response Data:", data);
      const safeData: DashboardStats = {
        totalProducts: Math.floor(Number(data.totalProducts) || 0),
        totalStock: Math.floor(Number(data.totalStock) || 0),
        todaysSales: Math.floor(Number(data.todaysSales) || 0),
        lowStockCount: Math.floor(Number(data.lowStockCount) || 0),
        totalProfit: Math.floor(Number(data.totalProfit) || 0),
        lastUpdated: data.lastUpdated,
      };
      console.log('Safe dashboard stats:', safeData);
      setStats(safeData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Reset Sales Data Function
  const handleResetSales = async () => {
    if (!confirm("Are you sure? All sales will be deleted")) {
      return;
    }

    try {
      setResetLoading(true);
      const response = await fetch('/api/reset/sales', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reset sales data');
      }

      alert("Sales data cleared!");
      window.location.reload();
    } catch (err) {
      console.error('Error resetting sales:', err);
      alert('Failed to reset sales data. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header - Fully Responsive */}
        <div className="mb-6 sm:mb-8 animate-fadeInUp">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title Section - Responsive */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Real-time overview of your stationery business
              </p>
            </div>

            {/* Action Buttons Section - Responsive wrapping */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
              {/* Live indicator - Hidden on very small screens */}
              {stats && !error && (
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-ping absolute" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-700">
                    Live
                  </span>
                </div>
              )}

              {/* Last updated - Hidden on mobile */}
              {stats && (
                <div className="text-xs sm:text-sm text-slate-500 font-medium hidden md:block">
                  Updated: {lastRefresh.toLocaleTimeString()}
                </div>
              )}

              {/* Refresh button - Responsive sizing */}
              <button
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading || isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Reset Sales Data Button - Responsive sizing */}
              <button
                onClick={handleResetSales}
                disabled={loading || isRefreshing || resetLoading}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-red-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap"
              >
                {resetLoading ? 'Resetting...' : <span className="hidden sm:inline">Reset Sales Data</span>}
                {resetLoading ? '' : <span className="sm:hidden">Reset</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive columns: 1 -> 2 -> 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {loading && !stats ? (
            // Loading Skeletons
            <>
              {[...Array(5)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : error ? (
            // Error State
            <ErrorState message={error} onRetry={handleRefresh} />
          ) : !stats ||
            (stats.totalProducts === 0 &&
              stats.totalStock === 0 &&
              stats.todaysSales === 0 &&
              stats.totalProfit === 0) ? (
            // Empty State
            <EmptyState />
          ) : (
            // Stats Cards - 5th card spans 2 columns on larger screens
            <>
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                gradient="from-amber-500 via-yellow-500 to-amber-600"
                delay={0}
              />

              <StatCard
                title="Total Stock"
                value={stats.totalStock}
                icon={Boxes}
                gradient="from-red-600 via-red-700 to-red-800"
                suffix=" units"
                delay={0.1}
              />

              <StatCard
                title="Today's Sales"
                value={stats.todaysSales}
                icon={DollarSign}
                gradient="from-emerald-600 via-green-700 to-teal-700"
                prefix="Rs. "
                delay={0.2}
              />

              <StatCard
                title="Low Stock Alert"
                value={stats.lowStockCount}
                icon={AlertTriangle}
                gradient="from-orange-500 via-red-600 to-red-700"
                suffix=" items"
                isWarning={true}
                delay={0.3}
              />

              {/* Total Profit card - Spans 2 cols on xl screens for balance */}
              <div className="sm:col-span-2 xl:col-span-4">
                <StatCard
                  title="Total Profit"
                  value={stats.totalProfit}
                  icon={TrendingUp}
                  gradient="from-green-500 via-emerald-600 to-teal-700"
                  prefix="Rs. "
                  delay={0.4}
                />
              </div>
            </>
          )}
        </div>

        {/* Additional Info Section - Fully Responsive */}
        {stats && (
          <div
            style={{ animationDelay: '0.5s' }}
            className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl sm:rounded-2xl border-2 border-amber-200 animate-fadeInUp"
          >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  Dashboard Features
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Your dashboard automatically updates every 30 seconds with
                  real-time data from your MongoDB database. All statistics
                  reflect the current state of your inventory and sales.
                  {stats.lowStockCount > 0 && (
                    <span className="text-red-700 font-semibold">
                      {' '}
                      You have {stats.lowStockCount} product
                      {stats.lowStockCount > 1 ? 's' : ''} running low on stock
                      - consider restocking soon!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}