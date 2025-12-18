'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, Activity, TrendingUp, DollarSign, Calendar, BarChart3, AlertCircle } from 'lucide-react';

interface Report {
  _id: string;
  totalSales: number;
  totalProfit: number;
}

export default function ReportsPage() {
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

  const totalSales = reports.reduce((acc, r) => acc + r.totalSales, 0);
  const totalProfit = reports.reduce((acc, r) => acc + r.totalProfit, 0);
  const avgDailySales = reports.length > 0 ? totalSales / reports.length : 0;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 relative overflow-hidden">
      {/* Animated Background - Responsive sizing */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-red-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        {/* Header with Logo - Responsive layout */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 rounded-lg shadow-2xl mb-4 sm:mb-6 overflow-hidden border-b-4 border-amber-500">
          <div className="relative p-4 sm:p-6">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                {/* Logo - Responsive sizing */}
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full p-1.5 sm:p-2 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 sm:border-4 border-amber-400">
                    <img 
                      src="/logo.png" 
                      alt="Habib Dukan Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xl sm:text-2xl font-bold text-red-700">د</div>';
                      }}
                    />
                  </div>
                </div>

                {/* Brand Text - Responsive sizing */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-2xl tracking-wide truncate" style={{fontFamily: 'serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wider truncate">HABIB DUKAN - Sales Reports</p>
                </div>
              </div>

              {/* Refresh Button - Responsive sizing */}
              <button
                onClick={fetchReports}
                disabled={loading}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white bg-opacity-20 backdrop-blur-md border-2 border-white border-opacity-30 text-white font-bold rounded-lg hover:bg-opacity-30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error State - Responsive padding */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-lg animate-fadeIn">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-red-800 text-base sm:text-lg">Error Loading Reports</p>
              <p className="text-red-700 text-sm sm:text-base break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards - Responsive grid */}
        {!loading && !error && reports.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6">
            {/* Total Sales - Responsive padding and sizing */}
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Total Sales</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Rs. {formatCurrency(totalSales)}</p>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-xl border-t-4 border-green-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Total Profit</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Rs. {formatCurrency(totalProfit)}</p>
            </div>

            {/* Average Daily Sales */}
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-xl border-t-4 border-purple-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Avg Daily Sales</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Rs. {formatCurrency(avgDailySales)}</p>
            </div>

            {/* Profit Margin */}
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-xl border-t-4 border-amber-500 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" strokeWidth={2} />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Profit Margin</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Reports Table - Responsive overflow */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-200">
          {/* Table Header - Responsive padding */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-5 border-b-2 border-gray-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Daily Sales Report</h2>
            </div>
          </div>

          {loading ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-semibold text-base sm:text-lg">Loading reports...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gradient-to-r from-red-700 to-amber-700 text-white">
                    {/* Responsive table headers */}
                    <th className="text-left p-3 sm:p-4 md:p-5 font-bold uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Date</span>
                      </div>
                    </th>
                    <th className="text-right p-3 sm:p-4 md:p-5 font-bold uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Total Sales</span>
                      </div>
                    </th>
                    <th className="text-right p-3 sm:p-4 md:p-5 font-bold uppercase tracking-wider text-xs sm:text-sm">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2.5} />
                        <span className="whitespace-nowrap">Total Profit</span>
                      </div>
                    </th>
                    <th className="text-center p-3 sm:p-4 md:p-5 font-bold uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 sm:py-16">
                        <div className="flex flex-col items-center px-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-semibold text-base sm:text-lg">No sales data found</p>
                          <p className="text-gray-400 text-xs sm:text-sm mt-2">Start making sales to see reports</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reports.map((r, index) => {
                      const margin = r.totalSales > 0 ? (r.totalProfit / r.totalSales) * 100 : 0;
                      return (
                        <tr 
                          key={r._id} 
                          className={`border-b border-gray-200 hover:bg-amber-50 transition-colors duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          {/* Date cell - Responsive layout */}
                          <td className="p-3 sm:p-4 md:p-5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" strokeWidth={2} />
                              </div>
                              <span className="font-bold text-gray-900 text-sm sm:text-base whitespace-nowrap">{r._id}</span>
                            </div>
                          </td>
                          {/* Sales cell - Responsive sizing */}
                          <td className="p-3 sm:p-4 md:p-5 text-right">
                            <span className="font-bold text-base sm:text-lg md:text-xl text-gray-900 whitespace-nowrap">Rs. {formatCurrency(r.totalSales)}</span>
                          </td>
                          {/* Profit cell - Responsive badge */}
                          <td className="p-3 sm:p-4 md:p-5 text-right">
                            <span className="inline-block bg-green-100 text-green-700 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
                              Rs. {formatCurrency(r.totalProfit)}
                            </span>
                          </td>
                          {/* Margin cell - Responsive badge */}
                          <td className="p-3 sm:p-4 md:p-5 text-center">
                            <span className={`inline-block px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base whitespace-nowrap ${
                              margin >= 30 ? 'bg-green-100 text-green-700' :
                              margin >= 20 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
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

          {/* Footer - Responsive layout */}
          {!loading && reports.length > 0 && (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 sm:p-5 border-t-2 border-gray-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={2} />
                  <span className="font-semibold text-sm sm:text-base">Showing {reports.length} days of sales data</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium break-words">
                  Last updated: {new Date().toLocaleString('en-PK')}
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}