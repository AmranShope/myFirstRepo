import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { X } from 'lucide-react';

export const ProductVariantsModal: React.FC = () => {
  const { selectedVariantProduct, setSelectedVariantProduct, addToCart } = useApp();

  if (!selectedVariantProduct) return null;

  const variants = [
    { id: 'v1', name: 'شوكولاتة شوكو كبير', price: 2800, image: selectedVariantProduct.image },
    { id: 'v2', name: 'شوكولاتة شوكو وسط', price: 1800, image: selectedVariantProduct.image },
    { id: 'v3', name: 'شوكولاتة شوكو صغير', price: 1100, image: selectedVariantProduct.image }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4441]" />
            <h2 className="text-sm font-black text-[#1F1F1F]">الخيارات المتوفرة</h2>
          </div>

          <button
            onClick={() => setSelectedVariantProduct(null)}
            className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variants List */}
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between shadow-2xs"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-3">
                <img
                  src={variant.image}
                  alt={variant.name}
                  className="w-14 h-14 rounded-xl object-cover bg-white p-1 border border-gray-200"
                />
                <div>
                  <h3 className="text-xs font-black text-[#1F1F1F]">{variant.name}</h3>
                  <span className="text-xs font-extrabold text-[#FF4441] dir-ltr inline-block">
                    {variant.price.toLocaleString('ar-YE')} ر.ي
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  addToCart({
                    ...selectedVariantProduct,
                    id: `${selectedVariantProduct.id}-${variant.id}`,
                    name: variant.name,
                    price: variant.price
                  }, 1);
                  setSelectedVariantProduct(null);
                }}
                className="bg-[#1D327B] hover:bg-[#2843a0] text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all"
              >
                إضافة للسلة
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
