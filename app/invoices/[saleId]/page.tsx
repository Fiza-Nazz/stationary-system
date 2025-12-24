'use client';
import { useEffect, useState } from "react";
import { Printer, Download, CheckCircle, Calendar, Smartphone, Banknote, Package } from "lucide-react";
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
  createdAt?: string;
};

export default function InvoicePage({ params }: { params: { saleId: string } }) {
  const [sale, setSale] = useState<SaleData | null>(null);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('print') === '1') {
        setIsPrintMode(true);
      }
    }
  }, []);

  useEffect(() => {
    if (sale && isLoaded && isPrintMode) {
      setTimeout(() => {
        window.print();
      }, 800);
    }
  }, [sale, isLoaded, isPrintMode]);

  const calculateTotal = () => {
    if (!sale) return 0;
    return sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Get invoice generation timestamp
  const getInvoiceDate = () => {
    if (sale?.createdAt) {
      return new Date(sale.createdAt);
    }
    return new Date();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Display payment method text
  const getPaymentMethodDisplay = (method: string) => {
    return method === 'Cash' ? 'Cash' : 'Online';
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
  const invoiceDate = getInvoiceDate();
  const currentDate = formatDate(invoiceDate);
  const currentTime = formatTime(invoiceDate);

  return (
    <div className="min-h-screen bg-white">
      <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Action Buttons - Hidden in print */}
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
        <div className={`invoice-container bg-white ${isPrintMode ? '' : 'rounded-xl shadow-2xl border-t-4 border-red-600'} overflow-hidden`}>
          
          {/* Header Section */}
          <div className={`invoice-header ${isPrintMode ? 'bg-white border-b-2 border-gray-300' : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600'} p-6 sm:p-8`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Logo & Brand */}
              <div className="flex items-center gap-4 sm:gap-6 flex-1">
                <div className={`logo-container w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-1 sm:p-2 ${isPrintMode ? 'border-2 border-gray-300' : 'shadow-2xl border-4 border-amber-400'}`}>
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
                <div className="text-left brand-text">
                  <h1 className={`text-4xl sm:text-6xl font-black mb-2 ${isPrintMode ? 'text-gray-900' : 'text-white'}`} style={{fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.02em'}}>
                    حبیب دکان
                  </h1>
                  <p className={`text-2xl sm:text-3xl font-black ${isPrintMode ? 'text-gray-800' : 'text-amber-100'}`} style={{fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.05em'}}>HABIB DUKAN</p>
                </div>
              </div>

              {/* Invoice Badge */}
              <div className="text-right flex-shrink-0 invoice-badge">
                <div className={`rounded-lg px-4 sm:px-6 py-3 sm:py-4 ${isPrintMode ? 'bg-gray-100 border-2 border-gray-300' : 'bg-white bg-opacity-90 shadow-xl'}`}>
                  <p className="text-gray-800 text-xs sm:text-sm font-semibold uppercase tracking-wider">Invoice</p>
                  <p className="text-black text-xl sm:text-2xl font-bold">#{sale._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="invoice-body p-6 sm:p-8">
            
            {/* Date and Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 invoice-info-grid">
              <div className={`info-card rounded-lg p-4 sm:p-5 border-2 ${isPrintMode ? 'bg-white border-gray-300' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`icon-box w-10 h-10 rounded-lg flex items-center justify-center ${isPrintMode ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-md'}`}>
                    <Calendar className={`w-5 h-5 ${isPrintMode ? 'text-blue-700' : 'text-white'}`} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Date & Time</h3>
                </div>
                <p className="text-gray-900 font-semibold text-base sm:text-lg invoice-date-value">{currentDate}</p>
                <p className="text-gray-900 font-bold text-lg sm:text-xl invoice-time-value">{currentTime}</p>
              </div>

              <div className={`info-card rounded-lg p-4 sm:p-5 border-2 ${isPrintMode ? 'bg-white border-gray-300' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`icon-box w-10 h-10 rounded-lg flex items-center justify-center ${
                    sale.paymentMethod === 'Cash'
                      ? isPrintMode ? 'bg-green-100' : 'bg-gradient-to-br from-green-600 to-green-700 shadow-md'
                      : isPrintMode ? 'bg-blue-100' : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-md'
                  }`}>
                    {sale.paymentMethod === 'Cash' ? (
                      <Banknote className={`w-5 h-5 ${isPrintMode ? 'text-green-700' : 'text-white'}`} strokeWidth={2.5} />
                    ) : (
                      <Smartphone className={`w-5 h-5 ${isPrintMode ? 'text-blue-700' : 'text-white'}`} strokeWidth={2.5} />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Payment Method</h3>
                </div>
                <p className="text-gray-900 font-bold text-lg sm:text-xl">{getPaymentMethodDisplay(sale.paymentMethod)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 items-section">
              {!isPrintMode && (
                <div className="flex items-center gap-3 mb-5 section-header">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                    <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Items Purchased</h2>
                </div>
              )}

              <div className={`overflow-x-auto rounded-lg border-2 ${isPrintMode ? 'border-gray-400' : 'border-gray-200 shadow-md'}`}>
                <table className="w-full items-table">
                  <thead>
                    <tr className={`table-header ${isPrintMode ? 'bg-gray-100 text-gray-900 border-b-2 border-gray-400' : 'bg-gradient-to-r from-red-700 to-amber-700 text-white'}`}>
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
                        className={`table-row border-b ${isPrintMode ? 'border-gray-300 bg-white' : index % 2 === 0 ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <td className="p-3 sm:p-4 item-name">
                          <p className="font-bold text-gray-900">{item.name}</p>
                        </td>
                        <td className="p-3 sm:p-4 text-center item-qty">
                          <span className={`inline-block px-3 py-1 font-bold text-gray-900 ${isPrintMode ? '' : 'bg-gray-200 rounded-full'}`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-right font-semibold text-gray-900 item-price">
                          Rs. {(item.price || 0).toFixed(0)}
                        </td>
                        <td className="p-3 sm:p-4 text-right font-bold text-gray-900 item-total">
                          Rs. {((item.price || 0) * item.quantity).toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Amount */}
            <div className={`total-section rounded-lg p-6 sm:p-8 border-t-4 ${isPrintMode ? 'bg-gray-100 border-gray-400' : 'bg-gradient-to-br from-red-600 to-amber-600 border-amber-400 shadow-xl'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {!isPrintMode && (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center check-icon">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                  </div>
                )}
                <div className="text-center sm:text-right total-amount">
                  <p className={`text-sm font-semibold uppercase tracking-wider ${isPrintMode ? 'text-gray-700' : 'text-amber-100'}`}>Total Amount</p>
                  <p className={`text-3xl sm:text-4xl font-bold ${isPrintMode ? 'text-gray-900' : 'text-white'}`}>Rs. {actualTotal.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`invoice-footer mt-6 sm:mt-8 pt-6 border-t-2 ${isPrintMode ? 'border-gray-300' : 'border-gray-200'} text-center`}>
              <p className="text-gray-800 font-bold mb-2 text-xl sm:text-2xl">Thank you for Shopping!</p>
              <p className="text-gray-700 font-bold text-base sm:text-lg footer-note">This is a computer-generated invoice and requires no signature.</p>
              <p className="text-gray-700 font-bold text-base sm:text-lg mt-2 contact-info">Contact: 0324-8085281</p>
              
              {/* QR Code - Hidden in print */}
              {!isPrintMode && currentUrl && (
                <div className="mt-6 flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 no-print qr-section">
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
          /* Reset everything for thermal printer */
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: black !important;
          }

          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide non-essential elements */
          .no-print,
          .qr-section,
          .section-header,
          .icon-box,
          .check-icon {
            display: none !important;
          }
          
          /* Show logo in thermal print only */
          .logo-container {
            display: block !important;
            width: 40mm !important;
            height: 40mm !important;
            margin: 0 auto 2mm auto !important;
            padding: 0 !important;
            border: none !important;
            background: white !important;
          }
          
          .logo-container img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
          }

          /* Page setup for 80mm thermal printer */
          @page {
            size: 80mm auto;
            margin: 2mm 3mm;
          }

          /* Main container - full width */
          .invoice-container {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            font-family: 'Courier New', monospace !important;
            font-size: 10pt !important;
            line-height: 1.3 !important;
          }

          /* Header - centered, compact */
          .invoice-header {
            text-align: center !important;
            padding: 3mm 0 !important;
            border-bottom: 2px dashed black !important;
            background: white !important;
          }

          .invoice-header > div {
            display: block !important;
            flex-direction: column !important;
            align-items: center !important;
          }

          .brand-text {
            text-align: center !important;
          }

          .brand-text h1 {
            font-size: 20pt !important;
            font-weight: 900 !important;
            margin: 0 0 2mm 0 !important;
            padding: 0 !important;
            font-family: Georgia, 'Times New Roman', serif !important;
            letter-spacing: 0.02em !important;
          }

          .brand-text p {
            font-size: 13pt !important;
            font-weight: 900 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: Georgia, 'Times New Roman', serif !important;
            letter-spacing: 0.05em !important;
          }

          .invoice-badge {
            margin-top: 2mm !important;
            text-align: center !important;
          }

          .invoice-badge > div {
            background: none !important;
            border: none !important;
            padding: 0 !important;
          }

          .invoice-badge p:first-child {
            display: none !important;
          }

          .invoice-badge p:last-child {
            font-size: 10pt !important;
            font-weight: bold !important;
            margin: 0 !important;
          }
          
          .invoice-badge p:last-child::before {
            content: 'Invoice #: ' !important;
            font-weight: bold !important;
          }

          /* Body section */
          .invoice-body {
            padding: 2mm 0 !important;
          }

          /* Info cards - simplified single line format */
          .invoice-info-grid {
            display: block !important;
            margin: 3mm 0 !important;
            padding: 2mm 0 !important;
            border-bottom: 1px solid black !important;
            border-top: 1px solid black !important;
            text-align: center !important;
            font-size: 9pt !important;
          }

          .info-card {
            display: inline !important;
            background: white !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .info-card > div:first-child {
            display: none !important;
          }

          .info-card h3 {
            display: inline !important;
            font-size: 9pt !important;
            font-weight: bold !important;
            margin: 0 !important;
          }

          .info-card p {
            display: inline !important;
            font-size: 9pt !important;
            margin: 0 !important;
          }
          
          /* Hide "Paid in full" text */
          .paid-status {
            display: none !important;
          }
          
          /* Date & Time single line formatting */
          .info-card:first-child h3::after {
            content: ': ' !important;
          }
          
          .invoice-date-value::after {
            content: ' | Time: ' !important;
            font-weight: normal !important;
          }
          
          .invoice-time-value {
            display: inline !important;
            font-weight: bold !important;
          }
          
          /* Payment method formatting */
          .info-card:last-child {
            margin-left: 2mm !important;
          }
          
          .info-card:last-child::before {
            content: ' | ' !important;
            margin: 0 1mm !important;
          }
          
          .info-card:last-child h3::after {
            content: ': ' !important;
          }

          /* Items section */
          .items-section {
            margin: 3mm 0 !important;
          }

          .items-section > div {
            border: none !important;
            overflow: visible !important;
          }

          /* Table - convert to receipt format */
          .items-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 9pt !important;
          }

          .table-header {
            background: white !important;
            border-bottom: 2px solid black !important;
          }

          .table-header th {
            padding: 1mm !important;
            font-size: 8pt !important;
            font-weight: bold !important;
            text-align: left !important;
          }

          .table-header th:nth-child(2),
          .table-header th:nth-child(3),
          .table-header th:nth-child(4) {
            text-align: right !important;
          }

          .table-row {
            border-bottom: 1px dotted black !important;
            background: white !important;
          }

          .table-row td {
            padding: 1.5mm 1mm !important;
            font-size: 9pt !important;
          }

          .item-name {
            width: 45% !important;
          }

          .item-qty {
            width: 15% !important;
            text-align: right !important;
          }

          .item-qty span {
            background: none !important;
            padding: 0 !important;
          }

          .item-price {
            width: 20% !important;
            text-align: right !important;
          }

          .item-total {
            width: 20% !important;
            text-align: right !important;
          }

          /* Total section - plain text only */
          .total-section {
            margin: 3mm 0 !important;
            padding: 2mm 0 !important;
            border: none !important;
            background: white !important;
            text-align: center !important;
          }

          .total-section > div {
            display: block !important;
          }

          .total-amount p:first-child {
            display: none !important;
          }

          .total-amount p:last-child {
            font-size: 14pt !important;
            font-weight: bold !important;
          }
          
          .total-amount p:last-child::before {
            content: 'TOTAL: ' !important;
            font-weight: bold !important;
          }

          /* Footer */
          .invoice-footer {
            margin-top: 3mm !important;
            padding-top: 2mm !important;
            border-top: 2px dashed black !important;
            text-align: center !important;
          }

          .invoice-footer p {
            font-size: 9pt !important;
            font-weight: bold !important;
            margin: 1mm 0 !important;
          }

          .footer-note,
          .contact-info {
            font-size: 8pt !important;
            font-weight: bold !important;
          }

          /* Remove all colors, gradients, shadows */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        /* Screen styles remain unchanged */
        @media screen {
          .no-print {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}