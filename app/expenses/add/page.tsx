"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Calculator, Save, Receipt, TrendingUp, Check, X, Zap, Building2, Wifi, Truck, Droplets, Coffee, Wrench, FileText, Sparkles } from "lucide-react";

const EXPENSE_CATEGORIES = [
  { id: "electricity", label: "Electricity Bill", icon: Zap, color: "bg-gradient-to-br from-red-700 via-red-800 to-red-900" },
  { id: "rent", label: "Shop Rent", icon: Building2, color: "bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-700" },
  { id: "internet", label: "Internet / Mobile", icon: Wifi, color: "bg-gradient-to-br from-red-600 via-red-700 to-amber-700" },
  { id: "transport", label: "Supplier Transport", icon: Truck, color: "bg-gradient-to-br from-amber-700 via-red-700 to-red-800" },
  { id: "cleaning", label: "Cleaning", icon: Droplets, color: "bg-gradient-to-br from-red-800 via-amber-700 to-red-900" },
  { id: "food", label: "Tea / Food", icon: Coffee, color: "bg-gradient-to-br from-amber-600 via-red-700 to-amber-800" },
  { id: "maintenance", label: "Maintenance", icon: Wrench, color: "bg-gradient-to-br from-red-700 via-amber-600 to-red-800" },
  { id: "other", label: "Other Expenses", icon: FileText, color: "bg-gradient-to-br from-amber-700 via-red-800 to-red-900" },
];

export default function AddExpensePage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Record<string, string>>({});
  const [additionalNote, setAdditionalNote] = useState("");
  const [additionalAmount, setAdditionalAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleExpenseChange = (categoryId: string, value: string) => {
    setExpenses(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const calculateTotal = () => {
    const categoriesTotal = Object.values(expenses).reduce((sum, val) => {
      const num = parseFloat(val) || 0;
      return sum + num;
    }, 0);

    const additionalTotal = parseFloat(additionalAmount) || 0;

    return categoriesTotal + additionalTotal;
  };

  const handleSubmit = async () => {
    const total = calculateTotal();
    if (total === 0) {
      setError("Please enter at least one expense amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const breakdownItems = [];

      // Categories breakdown
      EXPENSE_CATEGORIES.forEach(cat => {
        const amount = parseFloat(expenses[cat.id]) || 0;
        if (amount > 0) {
          breakdownItems.push(`${cat.label}: Rs ${amount.toLocaleString()}`);
        }
      });

      // Additional note with amount
      const addAmt = parseFloat(additionalAmount) || 0;
      if (addAmt > 0) {
        if (additionalNote.trim()) {
          breakdownItems.push(`Additional: Rs ${addAmt.toLocaleString()} — ${additionalNote.trim()}`);
        } else {
          breakdownItems.push(`Additional Expense: Rs ${addAmt.toLocaleString()}`);
        }
      }

      const expenseDetails = breakdownItems.length > 0 ? breakdownItems.join(", ") : "No details";

      // Prepare breakdown object for API
      const fullBreakdown = { ...expenses };
      if (addAmt > 0) {
        fullBreakdown["additional"] = additionalAmount;
      }

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          category: "Multiple Categories",
          description: additionalNote.trim()
            ? `${additionalNote.trim()} | Breakdown: ${expenseDetails}`
            : `Breakdown: ${expenseDetails}`,
          breakdown: fullBreakdown,
          additionalNote: additionalNote.trim() || null
        }),
      });

      if (!res.ok) throw new Error("Failed to add expense");

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setExpenses({});
        setAdditionalNote("");
        setAdditionalAmount("");
      }, 2500);
    } catch (err) {
      setError("Failed to save expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasAnyExpense = 
    Object.values(expenses).some(val => val && parseFloat(val) > 0) ||
    (additionalAmount && parseFloat(additionalAmount) > 0);

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F0] via-white to-[#FFF0E6] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#8B0000] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#CD853F] rounded-full blur-3xl"></div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn px-4">
          <div className="bg-white rounded-3xl p-10 shadow-2xl transform animate-scaleIn border-4 border-[#8B0000] max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#8B0000] to-[#A52A2A] rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#8B0000] to-[#A52A2A] bg-clip-text text-transparent mb-2" style={{fontFamily: 'Georgia, serif'}}>
                خرچہ محفوظ!
              </h3>
              <p className="text-lg text-gray-700 mb-3 font-semibold">Expense Saved Successfully</p>
              <p className="text-2xl font-bold text-[#8B0000]">Rs. {total.toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <Sparkles className="w-5 h-5 text-[#CD853F] animate-pulse" />
                <Sparkles className="w-5 h-5 text-[#8B0000] animate-pulse" style={{animationDelay: '0.3s'}} />
                <Sparkles className="w-5 h-5 text-[#CD853F] animate-pulse" style={{animationDelay: '0.6s'}} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Header */}
      <div className="bg-white border-b-4 border-[#8B0000] shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="group bg-gradient-to-br from-[#8B0000] to-[#A52A2A] hover:from-[#7A0000] hover:to-[#8B0000] text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <Home className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
                <span className="font-bold text-sm">Home</span>
              </button>

              <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#8B0000] to-transparent"></div>

              {/* Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#CD853F] to-[#8B0000] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-white rounded-2xl p-1 shadow-xl border-2 border-[#8B0000] group-hover:scale-110 transition-transform">
                  <img
                    src="/logo.png"
                    alt="Habib Dukan"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-[#8B0000]" style="font-family: Georgia, serif;">د</div>';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8B0000] to-[#A52A2A] bg-clip-text text-transparent" style={{fontFamily: 'Georgia, serif'}}>
                  حبیب دکان
                </h1>
                <p className="text-xs text-gray-600 font-semibold tracking-wide">Expense Management System</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white px-6 py-3 rounded-2xl shadow-xl border-2 border-[#CD853F]">
              <Receipt className="w-5 h-5" strokeWidth={2.5} />
              <div className="text-right">
                <p className="text-[10px] text-[#FFD700] font-semibold uppercase tracking-wider">Total Today</p>
                <p className="text-lg font-bold">Rs. {total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-600 rounded-2xl p-4 flex items-center gap-3 shadow-lg animate-fadeIn">
            <X className="w-6 h-6 text-red-600 flex-shrink-0" strokeWidth={2.5} />
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Main Expense Card */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#CD853F] overflow-hidden">
            <div className="bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] px-6 py-5 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CD853F] rounded-full blur-3xl"></div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-xl">
                  <Calculator className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{fontFamily: 'Georgia, serif'}}>
                    Enter Daily Expenses
                  </h2>
                  <p className="text-[#FFD700] text-sm font-medium">Add amounts for each category</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {EXPENSE_CATEGORIES.map((category) => {
                const IconComp = category.icon;
                const value = expenses[category.id] || "";
                const hasValue = value && parseFloat(value) > 0;

                return (
                  <div
                    key={category.id}
                    className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md border-2 transition-all duration-300 overflow-hidden ${
                      hasValue
                        ? 'border-[#8B0000] shadow-[#8B0000]/20 scale-[1.02]'
                        : 'border-gray-200 hover:border-[#CD853F] hover:shadow-lg'
                    }`}
                  >
                    <div className={`${category.color} p-4`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                          <IconComp className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-base leading-tight tracking-wide" style={{fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'}}>
                            {category.label}
                          </h3>
                        </div>
                        {hasValue && (
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                            <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                          Rs.
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={value}
                          onChange={(e) => handleExpenseChange(category.id, e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-full pl-11 pr-3 py-3 text-xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10 outline-none transition-all bg-white"
                          style={{fontFamily: 'Georgia, serif'}}
                        />
                      </div>
                      {hasValue && (
                        <p className="mt-2 text-xs text-green-600 font-semibold animate-fadeIn">
                          ✓ Rs. {parseFloat(value).toLocaleString()} added
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#8B0000] rounded-3xl shadow-2xl p-6 border-4 border-[#CD853F] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#CD853F] rounded-full blur-3xl animate-pulse"></div>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                  <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">Total Expense Amount</p>
                  <p className="text-white text-4xl font-bold" style={{fontFamily: 'Georgia, serif'}}>
                    Rs. {total.toLocaleString()}
                  </p>
                </div>
              </div>
              {hasAnyExpense && (
                <div className="bg-white text-[#8B0000] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl border-2 border-[#FFD700]">
                  <Check className="w-5 h-5" strokeWidth={3} />
                  <span>Ready to Save</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes with Amount */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-[#CD853F] p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-[#8B0000]" strokeWidth={2.5} />
              <span className="font-bold text-xl text-gray-900" style={{fontFamily: 'Georgia, serif'}}>
                Additional Expense (Miscellaneous)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rs.</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={additionalAmount}
                    onChange={(e) => setAdditionalAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-11 pr-3 py-3 text-xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10 outline-none transition-all bg-white"
                    style={{fontFamily: 'Georgia, serif'}}
                  />
                </div>
                {additionalAmount && parseFloat(additionalAmount) > 0 && (
                  <p className="mt-2 text-xs text-green-600 font-semibold animate-fadeIn">
                    ✓ Rs. {parseFloat(additionalAmount).toLocaleString()} added
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="For example: Bought fries for 100 Rs, gave money to someone, personal expense, or any small misc expense..."
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/10 outline-none transition-all resize-none bg-gray-50 hover:bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Date Display */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-[#CD853F] rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-br from-[#8B0000] to-[#A52A2A] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {new Date().getDate()}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Recording Date</p>
              <p className="text-sm font-bold text-gray-900" style={{fontFamily: 'Georgia, serif'}}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !hasAnyExpense}
            className={`w-full py-5 rounded-2xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${
              loading || !hasAnyExpense
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] hover:from-[#7A0000] hover:via-[#8B0000] hover:to-[#7A0000] hover:shadow-[#8B0000]/50 transform hover:scale-[1.02] active:scale-95 border-2 border-[#CD853F]'
            }`}
            style={{fontFamily: 'Georgia, serif'}}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <Save className="w-6 h-6" strokeWidth={2.5} />
                Save Expense Record
                <Receipt className="w-6 h-6" strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-2xl p-5 shadow-lg">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-xl">💡</span>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 mb-1" style={{fontFamily: 'Georgia, serif'}}>
                  Professional Expense Tracking
                </p>
                <p className="text-xs text-blue-800 leading-relaxed">
                  All expenses including additional notes with amounts are automatically totaled and saved with detailed breakdowns. This data will appear in your financial reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}