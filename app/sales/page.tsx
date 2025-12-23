"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, CreditCard, Banknote, Search, Package, CheckCircle, X, Sparkles, Home } from "lucide-react";

type Product = {
  _id: string;
  productNumber: string;
  name: string;
  retailPrice: number;
  stock: number;
};

type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export default function SalesPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [animateCart, setAnimateCart] = useState<string>("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product._id);

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert("Cannot add more than available stock!");
        return;
      }
      setCart(cart.map(item => item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock <= 0) {
        alert("Product out of stock!");
        return;
      }
      setCart([...cart, { productId: product._id, name: product.name, quantity: 1, price: product.retailPrice }]);
    }
    
    setAnimateCart(product._id);
    setTimeout(() => setAnimateCart(""), 600);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    if (qty < 1 || qty > product.stock) return;

    setCart(cart.map(item => item.productId === productId ? { ...item, quantity: qty } : item));
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const createSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, paymentMethod }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Sale ID:", data.sale._id);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setCart([]);
        const refreshed = await fetch("/api/products").then(res => res.json());
        setProducts(refreshed);

        router.push(`/invoices/${data.sale._id}`);
      } else {
        alert(data.error || "Sale failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating sale!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const exactMatch = products.find(p => p.productNumber === searchQuery);
      if (exactMatch) {
        addToCart(exactMatch);
        setSearchQuery(''); // Clear search bar after adding
      } else {
        // Optional: Alert user if no exact match is found
        alert('No product found with that exact product number.');
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.productNumber &&
        product.productNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#800000] rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8B0000] rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#8B0000] rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Elegant Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn px-4">
          <div className="bg-white rounded-3xl p-10 shadow-2xl transform animate-scaleIn border-2 border-[#B30000] max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#990000] via-[#990000] to-[#800000]"></div>
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-[#800000] via-[#8B0000] to-[#990000] rounded-full flex items-center justify-center mb-6 animate-bounce-gentle shadow-2xl relative">
                <div className="absolute inset-0 bg-[#CC0000] opacity-30 rounded-full animate-ping-slow"></div>
                <CheckCircle className="w-16 h-16 text-white relative z-10" strokeWidth={2.5} />
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-[#800000] to-[#8B0000] bg-clip-text text-transparent mb-3" style={{fontFamily: 'Georgia, serif'}}>
                فروخت مکمل!
              </h3>
              <p className="text-xl text-gray-700 mb-5 font-semibold" style={{fontFamily: 'Georgia, serif'}}>Sale Completed Successfully</p>
              <div className="flex gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#A52A2A] animate-sparkle" />
                <Sparkles className="w-6 h-6 text-[#A52A2A] animate-sparkle" style={{animationDelay: '0.2s'}} />
                <Sparkles className="w-6 h-6 text-[#800000] animate-sparkle" style={{animationDelay: '0.4s'}} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6">
        {/* Luxurious Header */}
        <div className="bg-white rounded-3xl shadow-2xl mb-6 overflow-hidden border-2 border-[#B30000] transform transition-all duration-500 hover:shadow-[#B30000]">
          <div className="relative p-6 bg-gradient-to-r from-[#FFF1F2] via-[#FFF1F2] to-[#FFF1F2]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#CC0000] to-[#A52A2A] rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <button
                  onClick={() => router.push('/')}
                  className="relative group flex-shrink-0 p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-[#B30000]/50 hover:border-[#CC0000]/70 transition-all duration-300 hover:scale-105 active:scale-95 z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#800000]/10 to-[#8B0000]/10 rounded-2xl blur-sm group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                  <Home className="w-7 h-7 text-[#800000] group-hover:text-[#660000] transition-colors duration-300 relative z-10" strokeWidth={2.5} />
                </button>
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#990000] via-[#800000] to-[#800000] rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-40"></div>
                  <div className="relative w-20 h-20 bg-white rounded-2xl p-2 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-[#B30000]">
                    <img 
                      src="/logo.png" 
                      alt="Dukan Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          const parent = target.parentElement;
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl font-bold text-[#660000]" style="font-family: Georgia, serif;">د</div>';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#660000] via-[#800000] to-[#660000] bg-clip-text text-transparent mb-1 drop-shadow-sm tracking-wide" style={{fontFamily: 'Georgia, serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-[#800000] text-base font-semibold tracking-widest" style={{fontFamily: 'Georgia, serif'}}>
                    HABIB DUKAN • Point of Sale
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#800000] via-[#8B0000] to-[#990000] rounded-2xl px-8 py-4 shadow-xl w-full sm:w-auto border-2 border-[#700000] transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <ShoppingCart className="w-10 h-10 text-white flex-shrink-0 animate-pulse-gentle" strokeWidth={2} />
                  <div className="text-center sm:text-right">
                    <p className="text-[#FFE6E6] text-sm font-semibold uppercase tracking-widest" style={{fontFamily: 'Georgia, serif'}}>Cart Items</p>
                    <p className="text-white text-3xl font-bold" style={{fontFamily: 'Georgia, serif'}}>{cart.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-5 border-2 border-[#B30000] transform transition-all duration-500 hover:shadow-[#B30000]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-5 border-b-2 border-[#FFE6E6] gap-3">
                <h2 className="text-2xl font-bold text-[#660000] flex items-center gap-3" style={{fontFamily: 'Georgia, serif'}}>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#800000] to-[#8B0000] rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0 transform transition-all duration-300 hover:rotate-12">
                    <Package className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <span>Available Products</span>
                </h2>
                <div className="relative w-full sm:w-auto group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#800000] w-5 h-5 transition-all duration-300 group-focus-within:text-[#700000]" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-12 pr-4 py-3 w-full sm:w-80 rounded-2xl border-2 border-[#B30000] focus:border-[#A52A2A] focus:outline-none transition-all duration-300 bg-white shadow-sm font-medium text-gray-900 hover:border-[#CC0000] placeholder-[#CC0000]"
                    style={{fontFamily: 'Georgia, serif'}}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[650px] overflow-y-auto pr-2 luxury-scrollbar">
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <Package className="w-20 h-20 text-[#CC0000] mx-auto mb-4 animate-pulse-gentle" />
                    <p className="text-[#800000] text-lg font-semibold" style={{fontFamily: 'Georgia, serif'}}>No products found</p>
                  </div>
                )}
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className={`relative group bg-gradient-to-br from-white to-[#FFF1F2] border-2 border-[#B30000] rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:border-[#CC0000] transform hover:-translate-y-2 transition-all duration-500 ${
                      animateCart === product._id ? 'animate-pulse-strong scale-105 border-[#A52A2A] shadow-[#A52A2A]' : ''
                    }`}
                  >
                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 ${
                      product.stock > 10 ? 'bg-emerald-600 text-white' : 
                      product.stock > 0 ? 'bg-[#800000] text-white' : 
                      'bg-[#A52A2A] text-white'
                    }`} style={{fontFamily: 'Georgia, serif'}}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'OUT'}
                    </div>

                    <div className="mb-4 pt-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[56px] group-hover:text-[#700000] transition-colors duration-300" style={{fontFamily: 'Georgia, serif'}}>
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm text-[#800000] font-semibold" style={{fontFamily: 'Georgia, serif'}}>Rs.</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#800000] to-[#8B0000] bg-clip-text text-transparent" style={{fontFamily: 'Georgia, serif'}}>
                          {product.retailPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-500 flex items-center justify-center gap-2 shadow-lg ${
                        product.stock > 0
                          ? 'bg-gradient-to-r from-[#800000] via-[#8B0000] to-[#990000] hover:from-[#700000] hover:via-[#700000] hover:to-[#800000] hover:shadow-2xl transform hover:scale-105 active:scale-95'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      style={{fontFamily: 'Georgia, serif'}}
                    >
                      <Plus className="w-5 h-5" strokeWidth={2.5} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-5 border-2 border-[#B30000] lg:sticky lg:top-4 transform transition-all duration-500 hover:shadow-[#B30000]">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#FFE6E6]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#800000] to-[#8B0000] rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0 transform transition-all duration-300 hover:rotate-12">
                  <ShoppingCart className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-[#660000]" style={{fontFamily: 'Georgia, serif'}}>Shopping Cart</h2>
              </div>

              <div className="mb-5 max-h-[320px] overflow-y-auto luxury-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-14">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FFE6E6] to-[#FFE6E6] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
                      <ShoppingCart className="w-10 h-10 text-[#800000]" />
                    </div>
                    <p className="text-[#800000] font-semibold" style={{fontFamily: 'Georgia, serif'}}>Cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.productId}
                      className="bg-gradient-to-r from-[#FFF1F2] via-[#FFF1F2] to-[#FFF1F2] border-2 border-[#B30000] rounded-2xl p-4 mb-3 shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-102"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-900 flex-1 text-sm leading-tight" style={{fontFamily: 'Georgia, serif'}}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#A52A2A] hover:text-white hover:bg-[#A52A2A] rounded-lg p-1.5 transition-all duration-300 ml-2 flex-shrink-0 active:scale-90"
                        >
                          <X className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-md border-2 border-[#B30000]">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 bg-gradient-to-br from-[#FFE6E6] to-[#FFE6E6] hover:from-[#FFCCCC] hover:to-[#FFCCCC] rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90"
                          >
                            <Minus className="w-4 h-4 text-[#660000]" strokeWidth={2.5} />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900" style={{fontFamily: 'Georgia, serif'}}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 rounded-lg flex items-center justify-center transition-all duration-300 active:scale-90"
                          >
                            <Plus className="w-4 h-4 text-emerald-800" strokeWidth={2.5} />
                          </button>
                        </div>
                        <p className="font-bold text-xl bg-gradient-to-r from-[#800000] to-[#8B0000] bg-clip-text text-transparent whitespace-nowrap" style={{fontFamily: 'Georgia, serif'}}>
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-[#660000] mb-3 uppercase tracking-wider" style={{fontFamily: 'Georgia, serif'}}>
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-4 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center gap-2 font-bold shadow-lg active:scale-95 ${
                      paymentMethod === "Cash"
                        ? 'bg-gradient-to-br from-[#800000] to-[#8B0000] text-white border-transparent scale-105 shadow-2xl'
                        : 'bg-white border-[#B30000] text-[#800000] hover:border-[#CC0000] hover:bg-[#FFF1F2]'
                    }`}
                    style={{fontFamily: 'Georgia, serif'}}
                  >
                    <Banknote className="w-5 h-5" strokeWidth={2.5} />
                    <span>Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Card")}
                    className={`p-4 rounded-2xl border-2 transition-all duration-500 flex items-center justify-center gap-2 font-bold shadow-lg active:scale-95 ${
                      paymentMethod === "Card"
                        ? 'bg-gradient-to-br from-[#800000] to-[#8B0000] text-white border-transparent scale-105 shadow-2xl'
                        : 'bg-white border-[#B30000] text-[#800000] hover:border-[#CC0000] hover:bg-[#FFF1F2]'
                    }`}
                    style={{fontFamily: 'Georgia, serif'}}
                  >
                    <CreditCard className="w-5 h-5" strokeWidth={2.5} />
                    <span>Online</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#800000] via-[#8B0000] to-[#990000] rounded-2xl p-5 mb-5 shadow-2xl border-2 border-[#700000] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#990000] to-[#800000] rounded-full blur-2xl animate-pulse-gentle"></div>
                </div>
                <div className="relative flex justify-between items-center text-white">
                  <span className="text-lg font-bold uppercase tracking-wider" style={{fontFamily: 'Georgia, serif'}}>
                    Total Amount
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-[#FFE6E6] mb-1" style={{fontFamily: 'Georgia, serif'}}>PKR</div>
                    <div className="text-3xl font-bold text-white" style={{fontFamily: 'Georgia, serif'}}>
                      Rs. {getTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={createSale}
                disabled={loading || cart.length === 0}
                className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl ${
                  loading || cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-600 hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95'
                }`}
                style={{fontFamily: 'Georgia, serif'}}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                    <span>Complete Sale</span>
                  </>
                )}
              </button>
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
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(1.05); }
          66% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 15px) scale(1.02); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        @keyframes pulse-strong {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(1.2) rotate(180deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        .animate-pulse-strong {
          animation: pulse-strong 0.6s ease-in-out;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        .luxury-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .luxury-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #FFF1F2, #FFF7F7);
          border-radius: 10px;
        }
        .luxury-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #800000, #8B0000);
          border-radius: 10px;
        }
        .luxury-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #660000, #700000);
        }
      `}</style>
    </div>
  );
}