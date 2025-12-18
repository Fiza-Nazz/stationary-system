'use client';
import { useEffect, useState } from "react";
import { Printer, Download, CheckCircle, Calendar, CreditCard, Banknote, Package } from "lucide-react";
import { QRCodeSVG as QRCode } from 'qrcode.react';

type SaleItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type SaleData = {
  _id: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: string;
};

export default function InvoicePage({ params }: { params: { saleId: string } }) {
  const [sale, setSale] = useState<SaleData | null>(null);
  const [currentDate] = useState(new Date().toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  const [currentTime] = useState(new Date().toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit'
  }));
  const [isLoaded, setIsLoaded] = useState(false);
  
  // QR code URL mein ?print=true add kiya
  const [currentUrl] = useState(typeof window !== 'undefined' ? window.location.origin + `/invoices/${params.saleId}?print=true` : '');

  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch(`/api/sales/${params.saleId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        setSale(data);
        setTimeout(() => setIsLoaded(true), 500);
      } catch (error) {
        console.error('Error fetching sale:', error);
        setIsLoaded(true);
      }
    }
    fetchSale();
  }, [params.saleId]);

  // Auto-print jab QR scan ho aur data load ho jaye
  useEffect(() => {
    if (sale && isLoaded && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldPrint = urlParams.get('print') === 'true';
      
      if (shouldPrint) {
        // Thoda delay dete hain taake page properly render ho
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    }
  }, [sale, isLoaded]);

  if (!sale) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 bg-white rounded-lg p-8 shadow-2xl transform transition-all duration-700 ease-out hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-20 animate-pulse"></div>
            </div>
            <p className="text-xl font-bold text-gray-800">Loading Invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className={`relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Action Buttons - Non-Printable */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-end no-print transform transition-all duration-700 ease-out delay-200" style={{animationDelay: '0.2s'}}>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <Printer className="w-5 h-5 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">Print Invoice</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <Download className="w-5 h-5 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">Save as PDF</span>
          </button>
        </div>

        {/* Invoice Container */}
        <div className={`bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-red-600 transform transition-all duration-700 ease-out delay-300 hover:shadow-3xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{animationDelay: '0.3s'}}>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 animate-pulse"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Logo & Brand */}
              <div className="flex items-center gap-4 sm:gap-6 flex-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-1 sm:p-2 shadow-2xl border-4 border-amber-400 group-hover:scale-110 transition-all duration-500">
                    <img
                      src="/logo.png"
                      alt="Habib Dukan Logo"
                      className="w-full h-full object-contain group-hover:rotate-6 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xl sm:text-2xl font-bold text-red-700">د</div>';
                      }}
                    />
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 drop-shadow-lg" style={{fontFamily: 'serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-base sm:text-lg font-semibold">HABIB DUKAN</p>
                  <p className="text-amber-100 text-xs sm:text-sm">Premium Retail Store</p>
                </div>
              </div>
              {/* Invoice Badge */}
              <div className="text-right flex-shrink-0">
                <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg px-4 sm:px-6 py-3 sm:py-4 border border-white border-opacity-50 shadow-xl group-hover:scale-105 transition-all duration-300">
                  <p className="text-gray-800 text-xs sm:text-sm font-semibold uppercase tracking-wider">Invoice</p>
                  <p className="text-black text-xl sm:text-2xl font-bold">#{sale._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-6 sm:p-8">
            {/* Date and Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 transform transition-all duration-500 ease-out delay-400" style={{animationDelay: '0.4s'}}>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-5 border-2 border-gray-200 shadow-sm group hover:shadow-md transition-all duration-300 hover:scale-102">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                    <Calendar className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Date & Time</h3>
                </div>
                <p className="text-gray-700 font-semibold text-base sm:text-lg">{currentDate}</p>
                <p className="text-gray-600 text-sm">{currentTime}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 sm:p-5 border-2 border-gray-200 shadow-sm group hover:shadow-md transition-all duration-300 hover:scale-102">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300 ${
                    sale.paymentMethod === 'Cash'
                      ? 'bg-gradient-to-br from-green-600 to-green-700'
                      : 'bg-gradient-to-br from-purple-600 to-purple-700'
                  }`}>
                    {sale.paymentMethod === 'Cash' ? (
                      <Banknote className="w-5 h-5 text-white" strokeWidth={2.5} />
                    ) : (
                      <CreditCard className="w-5 h-5 text-white" strokeWidth={2.5} />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Payment Method</h3>
                </div>
                <p className="text-gray-700 font-bold text-lg sm:text-xl">{sale.paymentMethod}</p>
                <p className="text-gray-600 text-sm">Paid in full</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 transform transition-all duration-500 ease-out delay-500" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
                  <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Items Purchased</h2>
              </div>
              <div className="overflow-x-auto rounded-lg border-2 border-gray-200 shadow-md">
                <table className="w-full min-w-[600px] sm:min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-700 to-amber-700 text-white">
                      <th className="text-left p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Product Name</th>
                      <th className="text-center p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Quantity</th>
                      <th className="text-right p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Unit Price</th>
                      <th className="text-right p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, index) => (
                      <tr
                        key={item.productId}
                        className={`border-b border-gray-200 transition-all duration-300 ease-out hover:bg-amber-50 hover:shadow-md ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        style={{animationDelay: `${0.6 + index * 0.1}s`}}
                      >
                        <td className="p-4">
                          <p className="font-bold text-gray-900 transition-colors duration-200 hover:text-red-700">{item.name}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-block bg-gray-200 px-3 py-1 rounded-full font-bold text-gray-800 transform hover:scale-110 transition-transform duration-200">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-gray-700 transition-colors duration-200 hover:text-red-600">
                          Rs. {(item.price || 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-right font-bold text-gray-900 text-base sm:text-lg transition-colors duration-200 hover:text-amber-600">
                          Rs. {((item.price || 0) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 transform transition-all duration-500 ease-out delay-700" style={{animationDelay: '0.7s'}}>
              <div className="bg-gradient-to-br from-red-600 to-amber-600 rounded-lg p-6 sm:p-8 border-t-4 border-amber-400 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-102 w-full">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-amber-100 font-semibold uppercase tracking-wider">Total Amount</p>
                    <p className="text-3xl sm:text-4xl font-bold text-white animate-bounce">Rs. {(sale.totalAmount || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 sm:mt-10 pt-6 border-t-2 border-gray-200 text-center transform transition-all duration-500 ease-out delay-800" style={{animationDelay: '0.8s'}}>
              <p className="text-gray-600 font-semibold mb-2 text-base sm:text-lg">Thank you for your business!</p>
              <p className="text-gray-500 text-sm">This is a computer-generated invoice and requires no signature.</p>
              <p className="text-gray-500 text-sm mt-2">Contact: +92 3123632197 | Email: info@habibdukan.pk</p>
              
              {/* QR Code */}
              {currentUrl && (
                <div className="mt-6 flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Scan QR Code for Digital Invoice</p>
                  <div className="relative">
                    <QRCode
                      value={currentUrl}
                      size={128}
                      bgColor="white"
                      fgColor="#000000"
                      level="H"
                      className="shadow-lg border-2 border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center max-w-xs">Scan to automatically generate print-ready invoice</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          @page {
            margin: 1cm;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}