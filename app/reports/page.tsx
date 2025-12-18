'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Activity, TrendingUp, DollarSign, Calendar, BarChart3, AlertCircle, Home } from 'lucide-react';

interface Report {
  _id: string;
  totalSales: number;
  totalProfit: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/reports', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data: Report[] = await res.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatCurrency = (value: number): string => {
    const safeValue = Number(value) || 0;
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeValue);
  };

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

  const totalSales = reports.reduce((acc, r) => acc + r.totalSales, 0);
  const totalProfit = reports.reduce((acc, r) => acc + r.totalProfit, 0);
  const avgDailySales = reports.length > 0 ? totalSales / reports.length : 0;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Header with Logo - Enhanced with glow and professional gradients */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 rounded-2xl shadow-2xl mb-4 sm:mb-6 overflow-hidden border-b-4 border-amber-500 relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-400 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
         
          <div className="relative p-4 sm:p-6">
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                {/* Logo - Enhanced with glow and rotation */}
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-60"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-2xl p-1.5 sm:p-2 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-amber-400/50">
                    <img
                      src="/logo.png"
                      alt="Habib Dukan Logo"
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-red-700 bg-gradient-to-br from-red-100 to-amber-100 rounded-xl">د</div>';
                      }}
                    />
                  </div>
                </div>
                {/* Brand Text - Enhanced with curly font and sparkle */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide truncate" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-sm sm:text-base md:text-lg font-semibold tracking-wider truncate">HABIB DUKAN - Sales Reports</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                    <span className="text-amber-100 text-xs font-medium">Professional Insights • Real-Time Data</span>
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
                {/* Refresh Button - Enhanced with shimmer and professional styling */}
                <button
                  onClick={fetchReports}
                  disabled={loading}
                  className="group relative w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-300 text-gray-900 text-sm sm:text-base font-bold rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-900 relative z-10 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                  <span className="relative z-10 font-semibold">Refresh Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State - Enhanced with professional alert design */}
        {error && (
          <div className="group relative bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1 relative z-10">
              <p className="font-bold text-red-800 text-base sm:text-lg" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Error Loading Reports</p>
              <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards - Enhanced grid with professional gradients and curly fonts */}
        {!loading && !error && reports.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-6">
            {/* Total Sales - Enhanced with shimmer and professional styling */}
            <div className="group relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
                  </div>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide mb-1" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Total Sales</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Rs. {formatCurrency(totalSales)}</p>
              </div>
            </div>
            {/* Total Profit */}
            <div className="group relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-green-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
                  </div>
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide mb-1" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Total Profit</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Rs. {formatCurrency(totalProfit)}</p>
              </div>
            </div>
            {/* Average Daily Sales */}
            <div className="group relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
                  </div>
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide mb-1" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Avg Daily Sales</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Rs. {formatCurrency(avgDailySales)}</p>
              </div>
            </div>
            {/* Profit Margin */}
            <div className="group relative bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-amber-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
                  </div>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide mb-1" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Profit Margin</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>{profitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Reports Table - Enhanced with professional borders and curly fonts */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative">
          {/* Table Header - Enhanced with gradient and icon */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6 border-b-2 border-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-transparent to-amber-50/30"></div>
            <div className="relative flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>📊 Daily Sales Report</h2>
                <p className="text-sm text-gray-600 font-medium mt-1">Professional Overview of Your Business Performance</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6 relative"></div>
              <p className="text-gray-600 font-bold text-base sm:text-lg" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Loading Professional Insights...</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gradient-to-r from-red-700 to-amber-700 text-white">
                    {/* Responsive table headers */}
                    <th className="text-left p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Date</span>
                      </div>
                    </th>
                    <th className="text-right p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                      <div className="flex items-center justify-end gap-2.5">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Total Sales</span>
                      </div>
                    </th>
                    <th className="text-right p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                      <div className="flex items-center justify-end gap-2.5">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Total Profit</span>
                      </div>
                    </th>
                    <th className="text-center p-4 sm:p-5 font-bold uppercase tracking-wide text-sm sm:text-base whitespace-nowrap" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-16 sm:py-20 relative">
                        <div className="flex flex-col items-center px-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-bold text-lg sm:text-xl" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>No Sales Data Found</p>
                          <p className="text-gray-400 text-sm sm:text-base mt-2">Start making sales to unlock professional insights ✨</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((r, index) => {
                      const margin = r.totalSales > 0 ? (r.totalProfit / r.totalSales) * 100 : 0;
                      return (
                        <tr
                          key={r._id}
                          className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-amber-50/80 hover:to-red-50/80 transition-all duration-300 transform hover:scale-[1.01] relative overflow-hidden ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <td className="p-4 sm:p-5 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-blue-700" strokeWidth={2} />
                              </div>
                              <span className="font-bold text-sm sm:text-base text-gray-900 block" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>{formatDate(r._id)}</span>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 text-right relative z-10">
                            <span className="font-bold text-lg sm:text-xl text-gray-900 whitespace-nowrap inline-flex items-center gap-1" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                              Rs. {formatCurrency(r.totalSales)}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 text-right relative z-10">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-base shadow-sm whitespace-nowrap" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                              Rs. {formatCurrency(r.totalProfit)}
                            </span>
                          </td>
                          <td className="p-4 sm:p-5 text-center relative z-10">
                            <span className={`inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap shadow-sm ${
                              margin >= 30 ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' :
                              margin >= 20 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                              'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                            }`} style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                              {margin.toFixed(1)}%
                            </span>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer - Enhanced with professional summary and curly font */}
          {!loading && reports.length > 0 && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-5 border-t-2 border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                  <span className="font-bold text-sm sm:text-base" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Tracking {reports.length} Professional Daily Records</span>
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-semibold" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                  Last Updated: {new Date().toLocaleString('en-PK', { hour12: false })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}