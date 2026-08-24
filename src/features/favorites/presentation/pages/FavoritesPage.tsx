import React from 'react';
import { Heart, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../../../catalog/presentation/components/ProductCard';
import { useApp } from '../../../../context/AppContext';
import { useFavorites } from '../hooks/useFavorites';

export const FavoritesPage: React.FC = () => {
  const { setActiveTab } = useApp();
  const { favoriteProducts, favoriteCount, addAllToCart } = useFavorites();

  return (
    <div id="favorites-page-container" className="space-y-4 pb-28 pt-2 px-3 sm:px-4 max-w-md w-full mx-auto animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white p-3.5 rounded-2xl shadow-2xs border border-gray-100/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-50 p-2.5 rounded-xl text-[#FF4441] shadow-inner">
            <Heart className="w-5 h-5 fill-[#FF4441]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-[#1F1F1F]">قائمة المنتجات المفضلة</h1>
              {favoriteCount > 0 && (
                <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {favoriteCount} منتجات
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">المنتجات التي اخترت حفظها لشراء سريع</p>
          </div>
        </div>

        {favoriteProducts.length > 0 && (
          <button
            id="favorites-add-all-btn"
            onClick={addAllToCart}
            className="bg-[#1D327B] hover:bg-[#2843a0] text-white text-xs font-black px-3 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إضافة الكل للسلة</span>
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-2xs border border-gray-100 text-center space-y-4 my-6">
          <div className="w-20 h-20 bg-red-50 text-[#FF4441] rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner border border-red-100">
            ❤️
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-[#1F1F1F]">قائمة المفضلة فارغة حالياً</h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed font-medium">
              اضغط على أيقونة القلب على أي منتج أثناء التصفح لحفظه هنا وسهولة الوصول إليه وإضافته لسلتك بنقرة واحدة!
            </p>
          </div>
          <button
            id="favorites-explore-products-btn"
            onClick={() => setActiveTab('home')}
            className="bg-[#1D327B] hover:bg-[#15255e] text-white text-xs font-black px-5 py-3 rounded-xl shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>تصفح المنتجات الآن</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
