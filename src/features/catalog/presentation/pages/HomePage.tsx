import React from 'react';
import { BannerSlider } from '../components/BannerSlider';
import { CategoryPills } from '../components/CategoryPills';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../../../../data/mockData';
import { useApp } from '../../../../context/AppContext';

export const HomePage: React.FC = () => {
  const { searchQuery, selectedCategoryId, setSelectedCategoryId, setActiveTab } = useApp();

  // Filter products based on search query or category
  const filteredProducts = PRODUCTS.filter(product => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(q);
      const brandMatch = product.brand?.toLowerCase().includes(q) || false;
      const descMatch = product.description.toLowerCase().includes(q);
      const tagMatch = product.tags?.some(t => t.toLowerCase().includes(q)) || false;
      if (!nameMatch && !brandMatch && !descMatch && !tagMatch) return false;
    }

    if (selectedCategoryId && product.categoryId !== selectedCategoryId) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-28 pt-1 px-3 sm:px-4 max-w-md w-full mx-auto">
      
      {/* Search results mode */}
      {searchQuery ? (
        <div className="bg-white p-3.5 rounded-3xl shadow-2xs border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#1F1F1F]">
              نتائج البحث عن: <span className="text-[#1D327B]">"{searchQuery}"</span>
            </h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} منتج
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="text-4xl">🔍</div>
              <p className="font-extrabold text-sm text-[#1F1F1F]">لم نجد نتائج مطابقة لـ "{searchQuery}"</p>
              <p className="text-xs text-[#6E6E6E]">تأكد من كتابة اسم الكلمة بشكل صحيح.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Main Hero Banner Slider */}
          <BannerSlider />

          {/* Categories Horizontal Pills */}
          <CategoryPills />

          {/* Selected Category Header if active */}
          {selectedCategoryId && (
            <div className="bg-blue-50/80 border border-blue-100 p-3 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-black text-[#1D327B]">
                قسم: {CATEGORIES.find(c => c.id === selectedCategoryId)?.name}
              </span>
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="text-xs font-black text-[#EC6A62] hover:underline"
              >
                إلغاء التصفية ✕
              </button>
            </div>
          )}

          {/* "الأكثر طلباً" Most Requested Section */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#EC6A62] rounded-full inline-block" />
                <h2 className="text-base font-black text-[#1F1F1F]">الأكثر طلباً</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.slice(0, 4).map(product => (
                <ProductCard key={`most-requested-${product.id}`} product={product} />
              ))}
            </div>
          </div>

          {/* "أحدث العروض" Latest Offers Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#EC6A62] rounded-full inline-block" />
                <h2 className="text-base font-black text-[#1F1F1F]">أحدث العروض</h2>
              </div>
              <button 
                onClick={() => setActiveTab('offers')}
                className="text-xs font-black text-[#EC6A62] hover:underline"
              >
                عرض الكل
              </button>
            </div>

            {/* Stack of Offer Banner Cards */}
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow-2xs border border-gray-100 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80" 
                  alt="عرض خلطة فلافل الدرة" 
                  className="w-full h-36 sm:h-44 object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xs border border-gray-100 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80" 
                  alt="عروض الفواكه والخضروات" 
                  className="w-full h-36 sm:h-44 object-cover"
                />
              </div>
            </div>
          </div>

          {/* "آخر الاضافات" Latest Additions Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#EC6A62] rounded-full inline-block" />
                <h2 className="text-base font-black text-[#1F1F1F]">آخر الاضافات</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[PRODUCTS[1], PRODUCTS[0]].map(product => (
                <ProductCard key={`latest-${product.id}`} product={product} />
              ))}
            </div>
          </div>

          {/* "منتجات مختارة" Selected Products Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-[#EC6A62] rounded-full inline-block" />
                <h2 className="text-base font-black text-[#1F1F1F]">منتجات مختارة</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[PRODUCTS[1], PRODUCTS[0], PRODUCTS[0], PRODUCTS[1]].map((product, idx) => (
                <ProductCard key={`featured-${product.id}-${idx}`} product={product} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer Info Banner */}
      <div className="bg-white p-4 rounded-3xl shadow-2xs border border-gray-100 text-center space-y-1">
        <p className="font-black text-xs text-[#1D327B]">ترولي 🛒 - تطبيقك الأول للبقالة في اليمن</p>
        <p className="text-[11px] text-gray-400 font-semibold">توصيل سريع وضمّان جودة كاملة حتى باب منزلك في جميع المدن</p>
      </div>

    </div>
  );
};
