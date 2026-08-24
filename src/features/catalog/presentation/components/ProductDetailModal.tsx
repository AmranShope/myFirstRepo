import React, { useState } from 'react';
import { X, Heart, Star, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useApp } from '../../../../context/AppContext';
import { PRODUCTS } from '../../../../data/mockData';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleFavorite, 
    isFavorite,
    cart
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  if (!selectedProduct) return null;

  const fav = isFavorite(selectedProduct.id);
  const currentUnit = selectedUnit || selectedProduct.unit;

  // Related products in same category
  const relatedProducts = PRODUCTS.filter(
    p => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col shadow-2xl border border-gray-100">
        
        {/* Top Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-sm font-extrabold text-[#1F1F1F]">تفاصيل المنتج</span>

          <button
            onClick={() => toggleFavorite(selectedProduct.id)}
            className={`p-2 rounded-full transition-colors ${
              fav ? 'bg-red-50 text-[#FF4441]' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${fav ? 'fill-[#FF4441]' : ''}`} />
          </button>
        </div>

        {/* Product Image Section */}
        <div className="p-4 bg-gray-50 relative flex items-center justify-center">
          <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden relative shadow-sm">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {selectedProduct.badge && (
              <span className="absolute top-3 right-3 bg-[#FF4441] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                {selectedProduct.badge}
              </span>
            )}
            {selectedProduct.isYemeniLocal && (
              <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <span>🇾🇪</span>
                <span>منتج بلدي أصيل</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 space-y-4">
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-[#6E6E6E]">
            <span className="bg-blue-50 text-[#1D327B] font-extrabold px-2.5 py-1 rounded-md">
              {selectedProduct.categoryName}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{selectedProduct.rating}</span>
              <span className="text-gray-400">({selectedProduct.reviewCount} تقييم)</span>
            </div>
          </div>

          {/* Title & Origin */}
          <div>
            <h1 className="text-lg font-black text-[#1F1F1F] leading-snug mb-1">
              {selectedProduct.name}
            </h1>
            {selectedProduct.origin && (
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <span>📍 المنشأ:</span>
                <span>{selectedProduct.origin}</span>
              </p>
            )}
          </div>

          {/* Price Tag */}
          <div className="bg-[#F1F3F6] p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">السعر الكلي</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1D327B]">
                  {(selectedProduct.price * quantity).toLocaleString('ar-YE')}
                </span>
                <span className="text-xs font-bold text-[#1D327B]">ر.ي</span>
              </div>
            </div>

            {selectedProduct.originalPrice && (
              <div className="text-left">
                <span className="text-xs text-gray-400 line-through block">
                  {(selectedProduct.originalPrice * quantity).toLocaleString('ar-YE')} ر.ي
                </span>
                <span className="bg-red-100 text-[#FF4441] text-[10px] font-black px-2 py-0.5 rounded-full">
                  وفر {((selectedProduct.originalPrice - selectedProduct.price) * quantity).toLocaleString('ar-YE')} ر.ي
                </span>
              </div>
            )}
          </div>

          {/* Unit selector if available */}
          {selectedProduct.availableUnits && selectedProduct.availableUnits.length > 0 && (
            <div>
              <label className="text-xs font-extrabold text-[#1F1F1F] block mb-2">
                اختر الحجم / العبوة:
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.availableUnits.map(unitOption => (
                  <button
                    key={unitOption}
                    onClick={() => setSelectedUnit(unitOption)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      currentUnit === unitOption
                        ? 'bg-[#1D327B] text-white border-[#1D327B] shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {unitOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-extrabold text-[#1F1F1F]">الكمية المطلوب طلبها:</span>
            <div className="flex items-center bg-[#F1F3F6] rounded-xl p-1 gap-3 border border-gray-200">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white text-[#1D327B] flex items-center justify-center font-black shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-sm text-[#1D327B] w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-lg bg-[#1D327B] text-white flex items-center justify-center font-black shadow-2xs hover:bg-[#2843a0] active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-extrabold text-[#1F1F1F]">الوصف والفوائد:</h3>
            <p className="text-xs text-[#6E6E6E] leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-gray-600">
            <div className="bg-emerald-50 p-2 rounded-xl flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-bold">جودة مضمونة</span>
            </div>
            <div className="bg-blue-50 p-2 rounded-xl flex flex-col items-center">
              <Truck className="w-4 h-4 text-[#1D327B] mb-1" />
              <span className="font-bold">توصيل 45 دقيقة</span>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl flex flex-col items-center">
              <RefreshCw className="w-4 h-4 text-amber-600 mb-1" />
              <span className="font-bold">استرجاع فوري</span>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-extrabold text-[#1F1F1F] mb-2">قد يعجبك أيضاً:</h3>
              <div className="grid grid-cols-3 gap-2">
                {relatedProducts.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedProduct(rel)}
                    className="p-1.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 text-right transition-all"
                  >
                    <img src={rel.image} alt={rel.name} className="w-full h-16 object-cover rounded-lg mb-1" />
                    <p className="text-[10px] font-bold text-gray-800 line-clamp-1">{rel.name}</p>
                    <p className="text-[10px] font-extrabold text-[#1D327B]">{rel.price.toLocaleString('ar-YE')} ر.ي</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA bar */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 shadow-lg flex items-center gap-3 z-20">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#1D327B] hover:bg-[#2843a0] text-white py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>إضافة للسلة • {(selectedProduct.price * quantity).toLocaleString('ar-YE')} ر.ي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
