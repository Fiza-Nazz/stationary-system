'use client';

import React, { useState } from 'react';
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
  Hash, // Added for Product Number
  Home
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
      <div className="max-w-3xl mx-auto">
        {/* Success Notification */}
        {showSuccess && (
          <div 
            className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg flex items-center gap-3 shadow-md"
            style={{
              animation: 'slideDown 0.3s ease-out'
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-900">Success!</h4>
              <p className="text-sm text-emerald-700">
                Product added successfully to inventory
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Notification */}
        {showError && (
          <div 
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg flex items-center gap-3 shadow-md"
            style={{
              animation: 'slideDown 0.3s ease-out'
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900">Error</h4>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header with Logo */}
        <div className="mb-8 pb-6 border-b-2 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-md opacity-40" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-0.5 shadow-xl">
                  <div className="w-full h-full bg-red-700 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src="/logo.png" 
                      alt="Dukaan Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Add New Product
                </h1>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Add a new product to your inventory
                </p>
              </div>
            </div>
            {/* Home Button */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-700 to-amber-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border-2 border-slate-200 shadow-lg p-8">
          <div className="space-y-6">
            {/* Product Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-slate-500 to-slate-700 rounded flex items-center justify-center">
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
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-black placeholder:text-slate-400 ${
                  errors.productNumber
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200'
                }`}
              />
              {errors.productNumber && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errors.productNumber}
                </p>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded flex items-center justify-center">
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
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-black placeholder:text-slate-400 ${
                  errors.name
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center">
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
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-black placeholder:text-slate-400 ${
                  errors.category
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-slate-300 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                }`}
              />
              {errors.category && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-700 to-red-900 rounded flex items-center justify-center">
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
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-black placeholder:text-slate-400 ${
                    errors.costPrice
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-slate-300 focus:border-red-700 focus:ring-2 focus:ring-red-200'
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.costPrice && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {errors.costPrice}
                  </p>
                )}
              </div>

              {/* Retail Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-green-700 rounded flex items-center justify-center">
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
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-black placeholder:text-slate-400 ${
                    errors.retailPrice
                      ? 'border-red-400 bg-red-50 focus:border-red-500'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200'
                  }`}
                  min="0"
                  step="0.01"
                />
                {errors.retailPrice && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {errors.retailPrice}
                  </p>
                )}
              </div>
            </div>

            {/* Profit Margin Display */}
            {costPrice && retailPrice && Number(retailPrice) > Number(costPrice) && (
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-600 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-emerald-900">
                      Profit Margin
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-700">
                    {profitMargin}%
                  </span>
                </div>
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  Profit per unit: Rs. {(Number(retailPrice) - Number(costPrice)).toFixed(2)}
                </p>
              </div>
            )}

            {/* Stock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-600 rounded flex items-center justify-center">
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
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none text-black placeholder:text-slate-400 ${
                  errors.stock
                    ? 'border-red-400 bg-red-50 focus:border-red-500'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                }`}
                min="0"
              />
              {errors.stock && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errors.stock}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" strokeWidth={2.5} />
                  Add Product to Inventory
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Quick Tips
              </h3>
              <ul className="text-sm text-slate-700 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Ensure retail price is higher than cost price for profit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Use clear, descriptive product names</span>
                </li>
                <li className="flex items-start gap-2">
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
      `}</style>
    </div>
  );
}