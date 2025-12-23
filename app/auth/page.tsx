'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ShieldAlert, Lock, Unlock, Home } from 'lucide-react';

export default function AuthPage() {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined' && sessionStorage.getItem('isAuthenticated') === 'true') {
      router.replace('/'); // Redirect to home if already authenticated
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief delay for loading animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For simplicity, we are using client-side check with NEXT_PUBLIC_ env variable
    // In a real production app, this check should ideally be done on a server-side API route
    // to prevent exposing the secret key to the client.
    if (secretKey === process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('isAuthenticated', 'true');
      }
      router.push('/');
    } else {
      setError('Incorrect secret key. Please try again.');
    }
    setLoading(false);
  };

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Subtle Background Decorations - Professional and Modern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Auth Container - Curved, Professional Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header with Logo and Branding */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 rounded-t-2xl shadow-2xl mb-0 overflow-hidden border-b-4 border-amber-500 relative animate-fadeInSlideDown">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          <div className="relative p-6">
            <div className="flex flex-col items-center gap-4">
              {/* Logo/Icon */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-700 opacity-60"></div>
                <div className="relative w-16 h-16 bg-white rounded-2xl p-1.5 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border-2 border-amber-400/50">
                  <Lock className="w-full h-full text-red-700" strokeWidth={1.5} />
                </div>
              </div>
              {/* Branding */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-2xl tracking-wide" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                  Admin Portal
                </h1>
                <p className="text-amber-200 text-sm font-semibold tracking-wider">Secure Access Required</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                  <span className="text-amber-100 text-xs font-medium">Protected by Habib Dukan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card - Curved White Box */}
        <div className="bg-white rounded-b-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeInSlideUp relative">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Secret Key Input */}
            <div className="space-y-3">
              <label htmlFor="secretKey" className="flex items-center gap-2 text-sm font-bold text-gray-700" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                <KeyRound className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                Enter Secret Key
              </label>
              <div className="relative group">
                <input
                  type="password"
                  id="secretKey"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-500 shadow-sm hover:shadow-md bg-gradient-to-r from-gray-50/50 to-white text-gray-900 placeholder-gray-500 font-medium"
                  placeholder="Your admin secret key..."
                  required
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ShieldAlert className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="group relative bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-500 animate-shake relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 relative z-10" strokeWidth={2.5} />
                <div className="min-w-0 flex-1 relative z-10">
                  <p className="font-bold text-red-800 text-sm" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>Access Denied</p>
                  <p className="text-red-700 text-xs break-words">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !secretKey}
                className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-amber-700 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 overflow-hidden transform active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Unlock className={`w-5 h-5 relative z-10 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                <span className="relative z-10 uppercase tracking-wide">Unlock Dashboard</span>
              </button>

              <button
                onClick={handleHomeRedirect}
                className="group relative w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Home className="w-5 h-5 relative z-10" strokeWidth={2.5} />
                <span className="relative z-10">Back to Home</span>
              </button>
            </div>

            {/* Footer Info */}
            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 font-medium" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                Protected Access • Contact Admin for Key Reset
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-fadeInSlideDown {
          animation: fadeInSlideDown 0.6s ease-out;
        }
        .animate-fadeInSlideUp {
          animation: fadeInSlideUp 0.6s ease-out 0.2s both;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}