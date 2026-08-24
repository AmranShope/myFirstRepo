import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../../../../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../../../../context/AppContext';
import { LayoutGrid, ChevronLeft, ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { selectedCategoryId, setSelectedCategoryId } = useApp();
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategoryId);

  // Subcategories for active category
  const activeProducts = PRODUCTS.filter(p => p.categoryId === selectedCategoryId);
  const subcategories = Array.from(new Set(activeProducts.map(p => p.subcategory).filter(Boolean))) as string[];

  const filteredProducts = activeProducts.filter(p => {
    if (selectedSubcat) return p.subcategory === selectedSubcat;
    return true;
  });

  return (
    <div className="space-y-4 pb-28 pt-2 px-3 sm:px-4 max-w-md w-full mx-auto">
      
      {/* If category is selected -> Show category product list */}
      {selectedCategoryId && activeCategory ? (
        <div className="space-y-3">
          {/* Top category navigation header */}
          <div 
            className="p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100"
            style={{ backgroundColor: activeCategory.bgPastel }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedSubcat(null);
                }}
                className="bg-white/80 hover:bg-white p-2 rounded-xl text-gray-800 transition-colors shadow-xs"
                title="رجوع لكافة الفئات"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-lg font-black text-[#1D327B] leading-none mb-1">
                  {activeCategory.name}
                </h1>
                <span className="text-xs font-bold text-gray-600">
                  {activeProducts.length} منتج متوفر
                </span>
              </div>
            </div>

            <img
              src={activeCategory.image}
              alt={activeCategory.name}
              className="w-14 h-14 object-cover rounded-xl shadow-xs border border-white/50"
            />
          </div>

          {/* Subcategory Pills */}
          {subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedSubcat(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                  selectedSubcat === null
                    ? 'bg-[#1D327B] text-white border-[#1D327B]'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                الكل ({activeProducts.length})
              </button>

              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcat(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                    selectedSubcat === sub
                      ? 'bg-[#1D327B] text-white border-[#1D327B]'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        /* All Categories Grid View */
        <div className="space-y-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-2 rounded-xl text-[#1D327B]">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-black text-[#1F1F1F]">جميع أقسام البقالة</h1>
                <p className="text-xs text-gray-500">اختر القسم لتصفح كل المنتجات المتوفرة</p>
              </div>
            </div>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {CATEGORIES.length} أقسام
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {CATEGORIES.map(category => {
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className="rounded-2xl p-3.5 text-right flex flex-col justify-between h-36 relative overflow-hidden shadow-xs hover:shadow-md transition-all border border-gray-100 group active:scale-[0.98]"
                  style={{ backgroundColor: category.bgPastel }}
                >
                  <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-white/20 pointer-events-none" />

                  <div className="z-10">
                    <span className="text-[10px] font-black bg-white/80 text-[#1D327B] px-2 py-0.5 rounded-full inline-block mb-1 shadow-2xs">
                      {category.itemCount} منتج
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1D327B] leading-tight group-hover:translate-x-1 transition-transform">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between z-10 mt-auto pt-2">
                    <span className="text-xs font-bold text-[#1D327B] underline flex items-center gap-0.5">
                      <span>تصفح</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>

                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
