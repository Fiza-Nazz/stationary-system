"use client";

import { useEffect, useState } from "react";
import { Search, Package, TrendingUp, AlertCircle, Trash2 } from "lucide-react";

type Product = {
  _id: string;
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: "asc" | "desc" } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setMounted(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, products, sortConfig]);

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
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-amber-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-base sm:text-lg text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo - Responsive padding and sizing */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 shadow-xl border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Logo - Responsive sizing */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-md opacity-50" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-0.5 shadow-2xl">
                <div className="w-full h-full bg-red-700 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="Dukaan Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Title - Responsive text sizing */}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-lg truncate">Inventory</h1>
              <p className="text-amber-100 text-xs sm:text-sm mt-0.5 sm:mt-1 font-semibold">Product Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive grid and spacing */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-4 sm:mb-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Total Products Card - Responsive padding and text */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 border-2 border-amber-200 hover:shadow-2xl hover:border-amber-400 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">Total Products</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{products.length}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Inventory Value Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 border-2 border-emerald-200 hover:shadow-2xl hover:border-emerald-400 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">Inventory Value</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 sm:mt-2 truncate">₨{totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 md:p-6 border-2 border-red-200 hover:shadow-2xl hover:border-red-400 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">Low Stock Items</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-700 mt-1 sm:mt-2">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className={`bg-white rounded-lg shadow-xl border-2 border-slate-200 overflow-hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Search Bar - Responsive padding and input sizing */}
          <div className="p-4 sm:p-5 md:p-6 border-b-2 border-amber-200 bg-amber-50">
            <div className="relative">
              {/* Search icon - Responsive sizing */}
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
              </div>
              {/* Search input - Fixed text color to black and responsive padding */}
              <input
                type="text"
                placeholder="Search by product name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 text-slate-900 placeholder-slate-500 font-medium shadow-sm text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Table - Responsive with horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-red-700 via-red-800 to-red-700 text-white sticky top-0 z-10 border-b-4 border-amber-400">
                <tr>
                  {/* Responsive table headers - smaller padding on mobile */}
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th 
                    className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-red-900 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("costPrice")}
                  >
                    Cost Price {sortConfig?.key === "costPrice" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th 
                    className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-red-900 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("retailPrice")}
                  >
                    Retail Price {sortConfig?.key === "retailPrice" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Wholesale Price</th>
                  <th 
                    className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-red-900 transition-colors whitespace-nowrap"
                    onClick={() => handleSort("stock")}
                  >
                    Stock {sortConfig?.key === "stock" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Unit</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200">
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`group hover:bg-amber-50 transition-all duration-300 hover:shadow-md ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    } ${product.stock < 10 ? "bg-red-50 border-l-4 border-red-500" : ""}`}
                    style={{
                      animation: mounted ? `fadeIn 0.5s ease-out ${index * 0.05}s both` : 'none'
                    }}
                  >
                    {/* Responsive table cells - smaller padding and text on mobile */}
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {product.stock < 10 && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center flex-shrink-0 shadow-md">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
                          </div>
                        )}
                        <span className="font-bold text-slate-900 group-hover:text-red-800 transition-colors text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border-2 border-amber-300 shadow-sm whitespace-nowrap">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-slate-800 font-bold text-sm sm:text-base whitespace-nowrap">₨{product.costPrice}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-slate-800 font-bold text-sm sm:text-base whitespace-nowrap">₨{product.retailPrice}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-slate-800 font-bold text-sm sm:text-base whitespace-nowrap">₨{product.wholesalePrice}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                      <span className={`font-bold text-base sm:text-lg ${product.stock < 10 ? "text-red-700" : "text-slate-900"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 whitespace-nowrap">
                        {product.unit}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:text-red-800 transition-colors" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state - Responsive sizing */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16 bg-amber-50 border-t-4 border-amber-400 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-slate-700 text-base sm:text-lg font-bold">No products found</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}