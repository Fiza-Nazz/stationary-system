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
  const [isPrintMode, setIsPrintMode] = useState(false);
  
  const [currentUrl] = useState(typeof window !== 'undefined' ? window.location.origin + `/invoices/${params.saleId}?print=1` : '');

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

  // Check agar QR se aaya hai toh print mode enable karo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('print') === '1') {
        setIsPrintMode(true);
      }
    }
  }, []);

  // Auto-print trigger karo agar print mode hai
  useEffect(() => {
    if (sale && isLoaded && isPrintMode) {
      setTimeout(() => {
        window.print();
      }, 800);
    }
  }, [sale, isLoaded, isPrintMode]);

  // Calculate accurate total from items
  const calculateTotal = () => {
    if (!sale) return 0;
    return sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (!sale) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 bg-white rounded-lg p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-bold text-gray-800">Loading Invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  const actualTotal = calculateTotal();

  return (
    <div className="min-h-screen bg-white">
      <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Action Buttons - Sirf normal mode mein dikhenge */}
        {!isPrintMode && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between no-print">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl shadow-lg hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>← Home Page</span>
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-xl shadow-lg hover:from-red-700 hover:to-amber-700 transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Go to Dashboard →</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Printer className="w-5 h-5" strokeWidth={2.5} />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                <span>Save as PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Invoice Container */}
        <div className={`bg-white ${isPrintMode ? '' : 'rounded-xl shadow-2xl border-t-4 border-red-600'} overflow-hidden`}>
          
          {/* Header Section */}
          <div className={`${isPrintMode ? 'bg-white border-b-2 border-gray-300' : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600'} p-6 sm:p-8`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Logo & Brand */}
              <div className="flex items-center gap-4 sm:gap-6 flex-1">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-1 sm:p-2 ${isPrintMode ? 'border-2 border-gray-300' : 'shadow-2xl border-4 border-amber-400'}`}>
                  <img
                    src="/logo.png"
                    alt="Habib Dukan Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-red-700">د</div>';
                    }}
                  />
                </div>
                <div className="text-left">
                  <h1 className={`text-2xl sm:text-4xl font-bold mb-1 ${isPrintMode ? 'text-gray-900' : 'text-white'}`} style={{fontFamily: 'serif'}}>
                    حبیب دکان
                  </h1>
                  <p className={`text-base sm:text-lg font-semibold ${isPrintMode ? 'text-gray-700' : 'text-amber-200'}`}>HABIB DUKAN</p>
                  <p className={`text-xs sm:text-sm ${isPrintMode ? 'text-gray-600' : 'text-amber-100'}`}>Premium Retail Store</p>
                </div>
              </div>

              {/* Invoice Badge */}
              <div className="text-right flex-shrink-0">
                <div className={`rounded-lg px-4 sm:px-6 py-3 sm:py-4 ${isPrintMode ? 'bg-gray-100 border-2 border-gray-300' : 'bg-white bg-opacity-90 shadow-xl'}`}>
                  <p className="text-gray-800 text-xs sm:text-sm font-semibold uppercase tracking-wider">Invoice</p>
                  <p className="text-black text-xl sm:text-2xl font-bold">#{sale._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-6 sm:p-8">
            
            {/* Date and Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className={`rounded-lg p-4 sm:p-5 border-2 ${isPrintMode ? 'bg-white border-gray-300' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPrintMode ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-md'}`}>
                    <Calendar className={`w-5 h-5 ${isPrintMode ? 'text-blue-700' : 'text-white'}`} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Date & Time</h3>
                </div>
                <p className="text-gray-900 font-semibold text-base sm:text-lg">{currentDate}</p>
                <p className="text-gray-700 text-sm">{currentTime}</p>
              </div>

              <div className={`rounded-lg p-4 sm:p-5 border-2 ${isPrintMode ? 'bg-white border-gray-300' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    sale.paymentMethod === 'Cash'
                      ? isPrintMode ? 'bg-green-100' : 'bg-gradient-to-br from-green-600 to-green-700 shadow-md'
                      : isPrintMode ? 'bg-purple-100' : 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-md'
                  }`}>
                    {sale.paymentMethod === 'Cash' ? (
                      <Banknote className={`w-5 h-5 ${isPrintMode ? 'text-green-700' : 'text-white'}`} strokeWidth={2.5} />
                    ) : (
                      <CreditCard className={`w-5 h-5 ${isPrintMode ? 'text-purple-700' : 'text-white'}`} strokeWidth={2.5} />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Payment Method</h3>
                </div>
                <p className="text-gray-900 font-bold text-lg sm:text-xl">{sale.paymentMethod}</p>
                <p className="text-gray-700 text-sm">Paid in full</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              {!isPrintMode && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                    <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Items Purchased</h2>
                </div>
              )}

              <div className={`overflow-x-auto rounded-lg border-2 ${isPrintMode ? 'border-gray-400' : 'border-gray-200 shadow-md'}`}>
                <table className="w-full">
                  <thead>
                    <tr className={isPrintMode ? 'bg-gray-100 text-gray-900 border-b-2 border-gray-400' : 'bg-gradient-to-r from-red-700 to-amber-700 text-white'}>
                      <th className="text-left p-3 sm:p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Product Name</th>
                      <th className="text-center p-3 sm:p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Qty</th>
                      <th className="text-right p-3 sm:p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Price</th>
                      <th className="text-right p-3 sm:p-4 font-bold uppercase tracking-wider text-xs sm:text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, index) => (
                      <tr
                        key={item.productId}
                        className={`border-b ${isPrintMode ? 'border-gray-300 bg-white' : index % 2 === 0 ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <td className="p-3 sm:p-4">
                          <p className="font-bold text-gray-900">{item.name}</p>
                        </td>
                        <td className="p-3 sm:p-4 text-center">
                          <span className={`inline-block px-3 py-1 font-bold text-gray-900 ${isPrintMode ? '' : 'bg-gray-200 rounded-full'}`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-right font-semibold text-gray-900">
                          Rs. {(item.price || 0).toFixed(0)}
                        </td>
                        <td className="p-3 sm:p-4 text-right font-bold text-gray-900">
                          Rs. {((item.price || 0) * item.quantity).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Amount */}
            <div className={`rounded-lg p-6 sm:p-8 border-t-4 ${isPrintMode ? 'bg-gray-100 border-gray-400' : 'bg-gradient-to-br from-red-600 to-amber-600 border-amber-400 shadow-xl'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {!isPrintMode && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                  </div>
                )}
                <div className="text-center sm:text-right">
                  <p className={`text-sm font-semibold uppercase tracking-wider ${isPrintMode ? 'text-gray-700' : 'text-amber-100'}`}>Total Amount</p>
                  <p className={`text-3xl sm:text-4xl font-bold ${isPrintMode ? 'text-gray-900' : 'text-white'}`}>Rs. {actualTotal.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-6 sm:mt-8 pt-6 border-t-2 ${isPrintMode ? 'border-gray-300' : 'border-gray-200'} text-center`}>
              <p className="text-gray-700 font-semibold mb-2 text-base sm:text-lg">Thank you for Shopping!</p>
              <p className="text-gray-600 text-sm">This is a computer-generated invoice and requires no signature.</p>
              <p className="text-gray-600 text-sm mt-2">Contact: 0324-8085281 </p>
              
              {/* QR Code - Sirf normal mode mein */}
              {!isPrintMode && currentUrl && (
                <div className="mt-6 flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 no-print">
                  <p className="text-sm font-semibold text-gray-700">Scan QR Code for Digital Invoice</p>
                  <QRCode
                    value={currentUrl}
                    size={128}
                    bgColor="white"
                    fgColor="#000000"
                    level="H"
                    className="shadow-lg border-2 border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 text-center max-w-xs">Scan to view clean invoice slip</p>
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
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}