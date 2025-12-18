'use client';
import { useEffect, useState } from "react";
import { Printer, Download, CheckCircle, Calendar, CreditCard, Banknote, Package } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";

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

  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch(`/api/sales/${params.saleId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        console.log('Fetched sale data:', data);  // Temporary log for debugging - remove later
        setSale(data);
      } catch (error) {
        console.error('Error fetching sale:', error);
        // Optional: Set error state here if you want to show error UI
      }
    }
    fetchSale();
  }, [params.saleId]);

  if (!sale) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-bold text-gray-800">Loading Invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Action Buttons - Non-Printable */}
        <div className="mb-6 flex gap-4 justify-end no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300"
          >
            <Printer className="w-5 h-5" strokeWidth={2.5} />
            Print Invoice
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300"
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
            Save as PDF
          </button>
        </div>

        {/* Invoice Container */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-t-4 border-red-600">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 p-8">
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-md opacity-50"></div>
                  <div className="relative w-20 h-20 bg-white rounded-full p-2 shadow-2xl border-4 border-amber-400">
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
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1 drop-shadow-lg" style={{fontFamily: 'serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-lg font-semibold">HABIB DUKAN</p>
                  <p className="text-amber-100 text-sm">Premium Retail Store</p>
                </div>
              </div>

              {/* Invoice Badge */}
              <div className="text-right">
                <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg px-6 py-4 border border-white border-opacity-30 shadow-xl">
                  <p className="text-amber-200 text-sm font-semibold uppercase tracking-wider">Invoice</p>
                  <p className="text-white text-2xl font-bold">#{sale._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-8">
            {/* Date and Payment Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Date & Time</h3>
                </div>
                <p className="text-gray-700 font-semibold text-lg">{currentDate}</p>
                <p className="text-gray-600 text-sm">{currentTime}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border-2 border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
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
                  <h3 className="font-bold text-gray-800 text-lg">Payment Method</h3>
                </div>
                <p className="text-gray-700 font-bold text-xl">{sale.paymentMethod}</p>
                <p className="text-gray-600 text-sm">Paid in full</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                  <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Items Purchased</h2>
              </div>

              <div className="overflow-hidden rounded-lg border-2 border-gray-200 shadow-md">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-700 to-amber-700 text-white">
                      <th className="text-left p-4 font-bold uppercase tracking-wider text-sm">Product Name</th>
                      <th className="text-center p-4 font-bold uppercase tracking-wider text-sm">Quantity</th>
                      <th className="text-right p-4 font-bold uppercase tracking-wider text-sm">Unit Price</th>
                      <th className="text-right p-4 font-bold uppercase tracking-wider text-sm">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, index) => (
                      <tr 
                        key={item.productId} 
                        className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors duration-200`}
                      >
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{item.name}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-block bg-gray-200 px-4 py-1 rounded-full font-bold text-gray-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-gray-700">
                          Rs. {(item.price || 0).toFixed(2)}  {/* Fix: Fallback to 0 */}
                        </td>
                        <td className="p-4 text-right font-bold text-gray-900 text-lg">
                          Rs. {((item.price || 0) * item.quantity).toFixed(2)}  {/* Fix: Price ke liye bhi */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-2 gap-6">


              {/* Total Amount */}
              <div className="bg-gradient-to-br from-red-600 to-amber-600 rounded-lg p-6 border-t-4 border-amber-400 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm text-amber-100 font-semibold uppercase tracking-wider">Total Amount</p>
                    <p className="text-4xl font-bold text-white">Rs. {(sale.totalAmount || 0).toFixed(2)}</p>  {/* Fix: Fallback */}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t-2 border-gray-200 text-center">
              <div className="mb-4 flex justify-center">
                <QRCode value={window.location.href} size={128} level="H" />
              </div>
              <p className="text-gray-600 font-semibold mb-2">Thank you for your business!</p>
              <p className="text-gray-500 text-sm">This is a computer-generated invoice and requires no signature.</p>
              <p className="text-gray-500 text-sm mt-2">Contact: +92 3123632197 | Email: info@habibdukan.pk</p>
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
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}