import React from 'react';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../../../../types';
import { useApp } from '../../../../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    toggleFavorite, 
    isFavorite,
    setSelectedProduct 
  } = useApp();

  const cartItem = cart.find(item => item.product.id === product.id);
  const isInCart = Boolean(cartItem && cartItem.quantity > 0);
  const fav = isFavorite(product.id);

  // Currency label
  const currencyLabel = product.price <= 500 ? 'ر.ي' : 'ريال';

  return (
    <div className="bg-white rounded-3xl p-2.5 border border-gray-100/80 shadow-2xs flex flex-col justify-between relative group hover:shadow-md transition-all">
      {/* Top Image Box with fixed height */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="cursor-pointer overflow-hidden rounded-2xl h-[140px] w-full relative bg-[#F8F9FA] flex items-center justify-center p-2.5 mb-1.5"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.isYemeniLocal && (
          <span className="absolute top-2 right-2 bg-amber-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
            🇾🇪 بلدي
          </span>
        )}
      </div>

      {/* Middle Row: Product Name (Right) & Price (Left) */}
      <div 
        onClick={() => setSelectedProduct(product)} 
        className="cursor-pointer flex items-center justify-between gap-1.5 my-1.5 px-0.5"
      >
        {/* Right Side: Product Name */}
        <h3 className="font-bold text-xs sm:text-sm text-[#1F1F1F] leading-tight line-clamp-1 text-right flex-1 hover:text-[#1D327B] transition-colors">
          {product.name}
        </h3>

        {/* Left Side: Price */}
        <div className="flex items-baseline gap-1 shrink-0">
          <span className="text-xs sm:text-sm font-black text-[#EC6A62]">
            {product.price.toLocaleString('ar-YE')}
          </span>
          <span className="text-[11px] font-bold text-[#EC6A62]">
            {currencyLabel}
          </span>
        </div>
      </div>

      {/* Bottom Action Row: Add to Cart Navy Button (Right) & Favorite Heart Button (Left) */}
      <div className="flex items-center gap-2 pt-1">
        
        {/* Add to Cart Navy Button (Right in RTL layout) */}
        {isInCart ? (
          <div className="flex-1 flex items-center justify-between bg-[#1D327B] text-white rounded-2xl px-2 py-2 shadow-2xs">
            <button
              onClick={() => updateCartQuantity(product.id, (cartItem?.quantity || 1) - 1)}
              className="w-6 h-6 rounded-lg hover:bg-white/20 flex items-center justify-center active:scale-95 transition-all"
            >
              <Minus className="w-3.5 h-3.5 text-white" />
            </button>
            <span className="text-xs font-black min-w-[16px] text-center">
              {cartItem?.quantity}
            </span>
            <button
              onClick={() => updateCartQuantity(product.id, (cartItem?.quantity || 1) + 1)}
              className="w-6 h-6 rounded-lg hover:bg-white/20 flex items-center justify-center active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product, 1)}
            className="flex-1 bg-[#1D327B] hover:bg-[#2843a0] text-white py-2.5 px-3 rounded-2xl shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-1.5 font-extrabold text-xs"
          >
            <span>إضافة للسلة</span>
            <ShoppingCart className="w-4 h-4 text-[#EC6A62]" />
          </button>
        )}

        {/* Heart Favorite Button (Left in RTL layout) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`p-2.5 rounded-2xl transition-all shrink-0 ${
            fav 
              ? 'bg-red-50 text-[#EC6A62] border border-red-100' 
              : 'bg-[#F1F3F6] text-[#EC6A62] hover:bg-gray-200/80'
          }`}
          title={fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={`w-4 h-4 text-[#EC6A62] ${fav ? 'fill-[#EC6A62]' : ''}`} />
        </button>

      </div>
    </div>
  );
};
