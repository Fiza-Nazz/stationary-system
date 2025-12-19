"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader, AlertTriangle } from "lucide-react";

type Product = {
  _id: string;
  productNumber: string;
  name: string;
  costPrice: number;
  retailPrice: number;
  stock: number;
};

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Product not found");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((error) => {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costPrice: product.costPrice,
          retailPrice: product.retailPrice,
          stock: product.stock,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      alert("Product updated successfully!");
      router.push("/inventory");
    } catch (error) {
      console.error(error);
      alert("Failed to update product. Please check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (product) {
      const isNumeric = ['costPrice', 'retailPrice', 'stock'].includes(name);
      setProduct({ ...product, [name]: isNumeric ? Number(value) : value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-700">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center text-center">
        <div>
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Product Not Found</h1>
          <p className="text-slate-600 mb-6">The product you're looking for doesn't exist or may have been deleted.</p>
          <button
            onClick={() => router.push("/inventory")}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Edit Product</h1>
            <p className="text-amber-200 text-sm mt-1 font-semibold">{product.name}</p>
          </div>
          <button
            onClick={() => router.push("/inventory")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Inventory
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleUpdate} className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Product Number */}
            <div>
              <label htmlFor="productNumber" className="block text-sm font-bold text-slate-700 mb-2">Product Number</label>
              <input
                id="productNumber"
                name="productNumber"
                type="text"
                value={product.productNumber}
                readOnly
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl bg-slate-100 text-slate-500 focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-sm font-bold text-slate-700 mb-2">Stock Quantity</label>
              <input
                id="stock"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-black"
                placeholder="0"
              />
            </div>

            {/* Cost Price */}
            <div>
              <label htmlFor="costPrice" className="block text-sm font-bold text-slate-700 mb-2">Cost Price (₨)</label>
              <input
                id="costPrice"
                name="costPrice"
                type="number"
                value={product.costPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-black"
                placeholder="0.00"
              />
            </div>

            {/* Retail Price */}
            <div>
              <label htmlFor="retailPrice" className="block text-sm font-bold text-slate-700 mb-2">Retail Price (₨)</label>
              <input
                id="retailPrice"
                name="retailPrice"
                type="number"
                value={product.retailPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-black"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t-2 border-slate-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/inventory")}
              className="px-8 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-48 px-8 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white font-bold rounded-xl hover:from-red-800 hover:to-red-900 transition-all disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}