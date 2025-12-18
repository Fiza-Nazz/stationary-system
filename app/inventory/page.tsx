"use client";

import { useEffect, useState } from "react";
import { Search, Package, TrendingUp, AlertCircle, Trash2, ArrowUpDown } from "lucide-react";

type Product = {
  _id: string;
  productNumber: string;
  name: string;
  category: string;
  costPrice: number;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  unit: string;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isApiSearch, setIsApiSearch] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: "asc" | "desc" } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initial fetch for all products
  const fetchAllProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setIsApiSearch(false);
        setMounted(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Handle search by Product Number
  const handleProductNumberSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      setIsApiSearch(false);
      return;
    }

    setSearchLoading(true);
    setIsApiSearch(true);
    try {
      const res = await fetch(`/api/products/search?q=${searchQuery.trim()}`);
      if (!res.ok) {
        if (res.status === 404) {
          setFilteredProducts([]);
        } else {
          throw new Error('Search failed');
        }
      } else {
        const data = await res.json();
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Failed to search products:", error);
      setFilteredProducts([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    if (sortConfig) {
      sortedProducts.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (sortConfig.direction === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
        return 0;
      });
    }
    setFilteredProducts(sortedProducts);
  }, [sortConfig]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  if (loading && !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-amber-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-slate-700 font-semibold tracking-wide">Loading Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-2xl border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl blur-lg opacity-60 animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 rounded-2xl p-0.5 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-red-800 rounded-xl flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Dukaan Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-lg">Inventory Management</h1>
                <p className="text-amber-200 text-sm mt-1 font-semibold tracking-wide">Complete Product Overview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="group bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl hover:border-amber-400 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">Total Products</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{products.length}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Items in inventory</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">Inventory Value</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">₨{totalValue.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Total stock value</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl hover:border-red-400 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-600 tracking-wide uppercase mb-2">Low Stock Alert</p>
                <p className="text-4xl font-black text-red-700 tracking-tight">{lowStockCount}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Items need restock</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className={`bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Enhanced Search Bar */}
          <div className="p-6 border-b-2 border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-11 h-11 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="Search by Product Number (e.g., PRD-173...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleProductNumberSearch()}
                  className="w-full pl-20 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-slate-900 placeholder-slate-400 font-medium shadow-sm hover:border-slate-400"
                />
              </div>
              <button
                onClick={handleProductNumberSearch}
                disabled={searchLoading}
                className="sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white font-bold rounded-xl hover:from-red-800 hover:to-red-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                )}
                <span className="tracking-wide">Search</span>
              </button>
            </div>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-800 via-red-900 to-red-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Product Number</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider">Category</th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-red-950 transition-colors group"
                    onClick={() => handleSort("costPrice")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Cost Price</span>
                      <ArrowUpDown className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-red-950 transition-colors group"
                    onClick={() => handleSort("retailPrice")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Retail Price</span>
                      <ArrowUpDown className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider">Wholesale Price</th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-red-950 transition-colors group"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span>Stock</span>
                      <ArrowUpDown className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(loading || searchLoading) && (
                   <tr>
                     <td colSpan={9} className="text-center py-16">
                       <div className="flex flex-col justify-center items-center gap-4">
                         <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-slate-600 font-semibold text-lg">Loading Products...</span>
                       </div>
                     </td>
                   </tr>
                )}
                {!loading && !searchLoading && filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`group hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-all duration-300 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } ${product.stock < 10 ? "bg-red-50 border-l-4 border-red-600" : ""}`}
                    style={{
                      animation: mounted ? `slideIn 0.5s ease-out ${index * 0.05}s both` : 'none'
                    }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold">#</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-700 tracking-wide bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300">
                          {product.productNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {product.stock < 10 && (
                          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                            <AlertCircle className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                        <span className="font-bold text-slate-900 group-hover:text-red-800 transition-colors text-base">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border-2 border-amber-300 shadow-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-slate-900 font-bold text-base tracking-wide">₨{product.costPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-slate-900 font-bold text-base tracking-wide">₨{product.retailPrice.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-slate-900 font-bold text-base tracking-wide">₨{product.wholesalePrice.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`font-black text-xl ${product.stock < 10 ? "text-red-700" : "text-slate-900"}`}>
                          {product.stock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-200 text-slate-800 text-sm font-bold border border-slate-300">
                        {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center justify-center w-11 h-11 bg-red-100 hover:bg-red-200 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:scale-105"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 group-hover:text-red-800 transition-colors" strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Empty State */}
          {!loading && !searchLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-white px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <Package className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-slate-900 text-2xl font-black mb-2">
                {isApiSearch ? "No Products Found" : "No Products in Inventory"}
              </h3>
              <p className="text-slate-600 text-base mt-2 font-medium mb-6">
                {isApiSearch ? "Try a different product number or clear the search." : "Add new products to see them here."}
              </p>
              {isApiSearch && (
                <button 
                  onClick={fetchAllProducts} 
                  className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white font-bold rounded-xl hover:from-red-800 hover:to-red-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Clear Search & Show All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}