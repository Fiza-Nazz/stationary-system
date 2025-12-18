'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Tag,
  DollarSign,
  Boxes,
  TrendingUp,
  Save,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  Hash // Added for Product Number
} from 'lucide-react';

interface FormErrors {
  productNumber?: string; // Added
  name?: string;
  category?: string;
  costPrice?: string;
  retailPrice?: string;
  stock?: string;
}

export default function AddProductPage() {
  const [productNumber, setProductNumber] = useState(''); // Added
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Page load animation trigger
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate profit margin
  const profitMargin =
    costPrice && retailPrice
      ? (((Number(retailPrice) - Number(costPrice)) / Number(retailPrice)) * 100).toFixed(1)
      : '0';

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!productNumber.trim()) { // Added validation
      newErrors.productNumber = 'Product number is required';
    }

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!costPrice || Number(costPrice) <= 0) {
      newErrors.costPrice = 'Cost price must be greater than 0';
    }

    if (!retailPrice || Number(retailPrice) <= 0) {
      newErrors.retailPrice = 'Retail price must be greater than 0';
    }

    if (Number(retailPrice) < Number(costPrice)) {
      newErrors.retailPrice = 'Retail price must be greater than cost price';
    }

    if (!stock || Number(stock) < 0) {
      newErrors.stock = 'Stock must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productNumber: productNumber.trim(), // Added
          name: name.trim(),
          category: category.trim(),
          costPrice: Number(costPrice),
          retailPrice: Number(retailPrice),
          stock: Number(stock),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      // Success
      setShowSuccess(true);
      
      // Reset form
      setProductNumber(''); // Added
      setName('');
      setCategory('');
      setCostPrice('');
      setRetailPrice('');
      setStock('');
      setErrors({});

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setShowError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Error adding product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className={`max-w-3xl mx-auto transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Success Notification */}
        {showSuccess && (
          <div 
            className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg flex items-center gap-3 shadow-lg transform transition-all duration-500 ease-out hover:scale-105"
            style={{
              animation: 'slideDownAndGlow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-20 animate-ping"></div>
              <CheckCircle2 className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-900 text-lg">Success!</h4>
              <p className="text-sm text-emerald-700">
                Product added successfully to inventory
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-emerald-600 hover:text-emerald-800 transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Notification */}
        {showError && (
          <div 
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg flex items-center gap-3 shadow-lg transform transition-all duration-500 ease-out hover:scale-105"
            style={{
              animation: 'slideDownAndShake 0.5s ease-out'
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900 text-lg">Error</h4>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-600 hover:text-red-800 transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header with Logo */}
        <div className="mb-8 pb-6 border-b-2 border-amber-200 transform transition-all duration-700 ease-out delay-200" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-4 mb-4">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-0.5 shadow-xl group-hover:scale-110 transition-all duration-500">
                <div className="w-full h-full bg-red-700 rounded-full flex items-center justify-center overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                  <img 
                    src="/logo.png" 
                    alt="Dukaan Logo" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="transform transition-all duration-700 ease-out delay-100" style={{animationDelay: '0.1s'}}>
              <h1 className="text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                Add New Product
              </h1>
              <p className="text-sm text-slate-600 font-medium mt-1">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border-2 border-slate-200 shadow-xl p-8 transform transition-all duration-700 ease-out hover:shadow-2xl hover:border-slate-300">
          <div className="space-y-6">
            {/* Product Number */}
            <div className="transform transition-all duration-300">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                <div className="w-6 h-6 bg-gradient-to-br from-slate-500 to-slate-700 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Hash className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                Product Number (SKU)
              </label>
              <input
                type="text"
                placeholder="e.g., SKU-12345"
                value={productNumber}
                onChange={(e) => {
                  setProductNumber(e.target.value.toUpperCase());
                  if (errors.productNumber) {
                    setErrors({ ...errors, productNumber: undefined });
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-out focus:outline-none text-black placeholder:text-slate-400 focus:scale-[1.02] focus:shadow-md ${
                  errors.productNumber
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400'
                }`}
              />
              {errors.productNumber && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  {errors.productNumber}
                </p>
              )}
            </div>

            {/* Product Name */}
            <div className="transform transition-all duration-300 delay-100" style={{animationDelay: '0.1s'}}>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g., A4 Size Paper"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-out focus:outline-none text-black placeholder:text-slate-400 focus:scale-[1.02] focus:shadow-md ${
                  errors.name
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 hover:border-amber-400'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="transform transition-all duration-300 delay-200" style={{animationDelay: '0.2s'}}>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Tag className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                Category
              </label>
              <input
                type="text"
                placeholder="e.g., Paper, Pens, Notebooks"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) {
                    setErrors({ ...errors, category: undefined });
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-out focus:outline-none text-black placeholder:text-slate-400 focus:scale-[1.02] focus:shadow-md ${
                  errors.category
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-300 focus:border-red-600 focus:ring-2 focus:ring-red-200 hover:border-red-400'
                }`}
              />
              {errors.category && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transform transition-all duration-300 delay-300" style={{animationDelay: '0.3s'}}>
              {/* Cost Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-700 to-red-900 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  Cost Price (Rs.)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={costPrice}
                  onChange={(e) => {
                    setCostPrice(e.target.value);
                    if (errors.costPrice) {
                      setErrors({ ...errors, costPrice: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-out focus:outline-none text-black placeholder:text-slate-400 focus:scale-[1.02] focus:shadow-md ${
                    errors.costPrice
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 focus:border-red-700 focus:ring-2 focus:ring-red-200 hover:border-red-400'
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.costPrice && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {errors.costPrice}
                  </p>
                )}
              </div>

              {/* Retail Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-green-700 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  Retail Price (Rs.)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={retailPrice}
                  onChange={(e) => {
                    setRetailPrice(e.target.value);
                    if (errors.retailPrice) {
                      setErrors({ ...errors, retailPrice: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-out focus:outline-none text-black placeholder:text-slate-400 focus:scale-[1.02] focus:shadow-md ${
                    errors.retailPrice
                      ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 hover:border-emerald-400'
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.retailPrice && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {errors.retailPrice}
                  </p>
                )}
              </div>
            </div>

            {/* Profit Margin Display */}
            {costPrice && retailPrice && Number(retailPrice) > Number(costPrice) && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-600 rounded-lg shadow-md transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden group-hover:rotate-180 transition-transform duration-700">
                      <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                      <div className="absolute inset-0 bg-white opacity-20 animate-ping"></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-900">
                      Profit Margin
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700 animate-pulse">
                    {profitMargin}%
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  Profit per unit: Rs. {(Number(retailPrice) - Number(costPrice)).toFixed(2)}
                </p>
              </div>
            )}

            {/* Stock */}
            <div className="transform transition-all duration-300 delay-400" style={{animationDelay: '0.4s'}}>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Boxes className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                Initial Stock
              </label>
              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  if (errors.stock) {
                    setErrors({ ...errors, stock: undefined });
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ease-out focus:outline-none text-black placeholder:text-slate-400 focus:scale-[1.02] focus:shadow-md ${
                  errors.stock
                    ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 hover:border-amber-400'
                }`}
                min="0"
              />
              {errors.stock && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  {errors.stock}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                  <span className="relative z-10">Adding Product...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                  <span className="relative z-10">Add Product to Inventory</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-md transform transition-all duration-500 ease-out hover:scale-102 hover:shadow-lg group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md relative overflow-hidden group-hover:rotate-6 transition-transform duration-500">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors duration-300">
                Quick Tips
              </h3>
              <ul className="text-sm text-slate-700 space-y-1.5">
                <li className="flex items-start gap-2 transform transition-all duration-200 hover:translate-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Ensure retail price is higher than cost price for profit</span>
                </li>
                <li className="flex items-start gap-2 transform transition-all duration-200 hover:translate-x-2 delay-50" style={{animationDelay: '0.05s'}}>
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Use clear, descriptive product names</span>
                </li>
                <li className="flex items-start gap-2 transform transition-all duration-200 hover:translate-x-2 delay-100" style={{animationDelay: '0.1s'}}>
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Keep stock levels updated for accurate inventory</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDownAndGlow {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          }
        }
        @keyframes slideDownAndShake {
          0%, 100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(0) scale(1.02);
          }
          75% {
            transform: translateY(0) scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}