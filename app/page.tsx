'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  FileText,
  BarChart3,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Menu,
  X
} from 'lucide-react';

// Navigation Items with logo colors
const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-amber-400 via-amber-500 to-yellow-500'
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    gradient: 'from-red-600 via-red-700 to-red-800'
  },
  {
    name: 'Add Product',
    href: '/inventory/add',
    icon: PlusCircle,
    gradient: 'from-emerald-600 via-green-700 to-teal-700'
  },
  {
    name: 'Sales / POS',
    href: '/sales',
    icon: ShoppingCart,
    gradient: 'from-amber-500 via-orange-600 to-red-600'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    gradient: 'from-yellow-400 via-amber-500 to-orange-500'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    gradient: 'from-red-700 via-red-800 to-red-900'
  }
];

export default function HomePage() {
  const [activeRoute, setActiveRoute] = useState('/dashboard');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') !== 'true') {
      router.replace('/auth');
    }
  }, [router]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar with Logo Colors - Responsive */}
      <aside 
        className={`md:w-72 w-full h-full md:h-full md:relative fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex-shrink-0 flex-shrink overflow-hidden`}
      >
        {/* Maroon/Red gradient background inspired by logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-red-900/40 to-emerald-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/15 via-transparent to-transparent" />
        
        {/* Animated gradient orbs with logo colors */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Content */}
        <div className="relative h-full flex flex-col p-4 md:p-6 z-10">
          {/* Logo Section - Responsive */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
              <div className="relative">
                {/* Logo container with glow matching logo colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl p-0.5 shadow-2xl transform group-hover:scale-105 transition-all duration-500 group-hover:rotate-3">
                  <div className="w-full h-full bg-red-700 rounded-xl flex items-center justify-center overflow-hidden">
                    <img 
                      src="/logo.png" 
                      alt="Dukaan Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent tracking-tight drop-shadow-lg truncate">
                  دکان
                </h1>
                <p className="text-xs text-amber-200/80 font-semibold mt-0.5 tracking-wide">
                  حبیب - Inventory Pro
                </p>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={closeMobileMenu}
                className="md:hidden text-amber-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation with enhanced styling - Responsive */}
          <nav className="flex-1 space-y-1 md:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.href;
              const isHovered = hoveredItem === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setActiveRoute(item.href);
                    closeMobileMenu();
                  }}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="block relative group"
                >
                  {/* Active indicator bar with gradient */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 md:h-10 rounded-r-full bg-gradient-to-b ${item.gradient} transition-all duration-500 shadow-lg ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                    }`}
                  />

                  {/* Navigation item */}
                  <div
                    className={`relative flex items-center gap-2.5 md:gap-3.5 px-3 py-3 md:px-4 md:py-4 rounded-xl transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 shadow-xl border border-amber-500/30'
                        : 'hover:bg-white/10 border border-transparent hover:border-white/10'
                    }`}
                  >
                    {/* Enhanced hover glow effect */}
                    {(isHovered || isActive) && (
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient} opacity-10 blur-2xl transition-opacity duration-500`}
                      />
                    )}

                    {/* Icon with enhanced gradient and shadow */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-2xl transition-all duration-500 ${
                          isActive || isHovered
                            ? 'scale-110 shadow-amber-500/50 rotate-3'
                            : 'scale-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow-lg" strokeWidth={2.5} />
                      </div>
                      {/* Extra glow for active state */}
                      {isActive && (
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} blur-lg opacity-60 animate-pulse`} />
                      )}
                    </div>

                    {/* Text with enhanced styling */}
                    <span
                      className={`flex-1 font-semibold transition-all duration-300 text-sm md:text-base overflow-hidden ${
                        isActive
                          ? 'text-amber-100 drop-shadow-lg'
                          : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Arrow indicator with enhanced animation */}
                    <ChevronRight
                      className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-500 flex-shrink-0 ${
                        isActive
                          ? 'text-amber-200 opacity-100 translate-x-0 scale-110'
                          : 'text-slate-400 opacity-0 -translate-x-3 scale-90 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-110 group-hover:text-amber-300'
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom decoration with logo colors - Responsive */}
          <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-amber-500/30">
            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-bold text-amber-100 drop-shadow truncate">
                  Premium Plan
                </p>
                <p className="text-xs text-amber-200/70 font-medium truncate">
                  All features unlocked
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area with enhanced styling */}
      <main className="flex-1 h-full overflow-auto bg-white relative md:ml-0">
        {/* Subtle background decoration with logo colors */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-amber-50 via-yellow-50 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-red-50 via-rose-50 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none hidden xl:block" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-emerald-50 via-green-50 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none hidden md:block" />

        {/* Content container - Responsive padding */}
        <div className="relative min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl w-full">
            {/* Hero Section */}
            <div className="text-center space-y-6 md:space-y-8">
              {/* Badge with logo colors - Responsive */}
              <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-amber-500/15 border-2 border-amber-400/40 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-amber-600" />
                <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-red-700 via-red-800 to-red-900 bg-clip-text text-transparent">
                  Powered by Advanced Analytics
                </span>
              </div>

              {/* Main Heading with logo colors - Responsive */}
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent drop-shadow-sm">
                    Welcome to
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 bg-clip-text text-transparent drop-shadow-lg">
                    Stationery Management
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                  A comprehensive solution for managing your stationery inventory, 
                  tracking sales, and analyzing business performance with real-time insights.
                </p>
              </div>

              {/* Feature Cards with logo colors - Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8">
                {[
                  {
                    icon: Package,
                    title: 'Smart Inventory',
                    desc: 'Track stock levels with intelligent alerts',
                    gradient: 'from-amber-500 via-yellow-500 to-amber-600',
                    borderColor: 'border-amber-200'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Sales Analytics',
                    desc: 'Real-time insights and forecasting',
                    gradient: 'from-red-600 via-red-700 to-red-800',
                    borderColor: 'border-red-200'
                  },
                  {
                    icon: Zap,
                    title: 'Quick POS',
                    desc: 'Lightning-fast checkout experience',
                    gradient: 'from-emerald-600 via-green-700 to-teal-700',
                    borderColor: 'border-emerald-200'
                  }
                ].map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`group relative p-5 sm:p-6 md:p-7 rounded-2xl bg-white border-2 ${feature.borderColor} hover:border-opacity-60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105`}
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      <div className="relative space-y-3 md:space-y-4">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <FeatureIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7 text-white drop-shadow-lg" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Section with logo colors - Responsive */}
              <div className="pt-8 md:pt-12 space-y-4 md:space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <button className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 overflow-hidden text-base sm:text-lg">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                  
                  <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-white border-2 border-amber-400 text-red-800 font-bold hover:border-amber-500 hover:bg-amber-50 transition-all duration-500 hover:scale-110 shadow-xl hover:shadow-2xl text-base sm:text-lg">
                    View Demo
                  </button>
                </div>

                <p className="text-sm text-slate-600 font-semibold">
                  Join 500+ businesses managing their inventory efficiently
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-30 md:hidden p-2 rounded-lg bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Menu className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}