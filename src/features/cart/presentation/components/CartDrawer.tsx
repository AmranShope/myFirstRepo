import React from 'react';
import { 
  ChevronRight, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft 
} from 'lucide-react';
import { useApp } from '../../../../context/AppContext';

interface CartViewProps {
  isModal?: boolean;
}

export const CartDrawer: React.FC<CartViewProps> = ({ isModal = false }) => {
  const { 
    cart, 
    cartTotal,
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    setIsCheckoutOpen,
    currentScreen,
    setCurrentScreen,
    setActiveTab
  } = useApp();

  // If used as modal overlay and drawer is not open, do not render
  if (isModal && !isCartDrawerOpen) return null;

  const handleBack = () => {
    setIsCartDrawerOpen(false);
    if (currentScreen === 'cart') {
      setCurrentScreen('main');
    }
  };

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutOpen(false);
    setCurrentScreen('checkout');
  };

  const content = (
    <div className="w-full min-h-screen bg-[#F0F2F6] flex flex-col justify-between text-[#1F1F1F] font-sans antialiased">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100/80 px-4 py-3.5 flex items-center justify-between shadow-2xs">
        {/* Right Side: Back Button & Title "السلة" */}
        <div className="flex items-center gap-2">
          <button
            id="cart-back-btn"
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#1F1F1F]"
            aria-label="الرجوع"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-xl font-bold text-[#1F1F1F] tracking-tight">السلة</h1>
        </div>

        {/* Left Side: Brand mark (two coral rounded squares) */}
        <div className="flex items-center gap-1.5" title="ترولي">
          <div className="w-4 h-4 rounded-xs bg-[#FF5A57]" />
          <div className="w-4 h-4 rounded-xs bg-[#FF5A57]" />
        </div>
      </div>

      {/* Cart Content Body */}
      <div className="flex-1 p-4 pb-8 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-4 my-auto bg-white rounded-3xl shadow-xs border border-gray-100 mt-6">
            <div className="w-20 h-20 bg-blue-50 text-[#1D327B] rounded-full flex items-center justify-center mx-auto text-3xl">
              <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
            </div>
            <h2 className="text-lg font-bold text-[#1F1F1F]">سلة التسوق فارغة</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              لم تقم بإضافة أي منتجات للسلة بعد. تصفح أحدث العروض والمنتجات الطازجة الآن!
            </p>
            <button
              id="empty-cart-shop-now-btn"
              onClick={() => {
                handleBack();
                setActiveTab('home');
              }}
              className="bg-[#1D327B] hover:bg-[#15255e] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-sm active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer mt-2"
            >
              <span>ابدأ التسوق الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            
            {/* List of Cart Items */}
            {cart.map((item) => (
              <div 
                key={item.product.id}
                id={`cart-card-${item.product.id}`}
                className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex items-center justify-between gap-3 transition-all duration-200"
              >
                {/* 1. Right Side (First in RTL): Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* 2. Middle (Second in RTL): Product Name & Price aligned to image */}
                <div className="flex-1 flex flex-col justify-center gap-1.5 text-right min-w-0 pr-1 sm:pr-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#1F1F1F] leading-snug line-clamp-2">
                    {item.product.name}
                  </h3>
                  <div className="text-sm sm:text-base font-bold text-[#1D327B]">
                    {(item.product.price * item.quantity).toLocaleString('ar-YE')} ر.ي
                  </div>
                </div>

                {/* 3. Left Side (Third in RTL): Delete Icon (top) & Quantity Pill (bottom) */}
                <div className="flex flex-col justify-center items-end shrink-0 gap-2">
                  <button
                    id={`cart-delete-${item.product.id}`}
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#FF5A57] hover:text-[#e04340] p-1 transition-colors cursor-pointer active:scale-90 flex items-center justify-center"
                    title="حذف من السلة"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-5 h-5 stroke-[1.8]" />
                  </button>

                  <div className="bg-[#E9EEF5] rounded-xl px-2.5 sm:px-3 py-1 flex items-center gap-2.5 sm:gap-3">
                    <button
                      id={`cart-qty-dec-${item.product.id}`}
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="text-gray-500 hover:text-gray-900 font-bold text-base cursor-pointer select-none px-1 active:scale-90"
                      aria-label="إنقاص الكمية"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    <span className="font-bold text-sm text-[#1D327B] min-w-3 text-center select-none">
                      {item.quantity}
                    </span>

                    <button
                      id={`cart-qty-inc-${item.product.id}`}
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="text-[#FF5A57] hover:text-[#e04340] font-bold text-base cursor-pointer select-none px-1 active:scale-90"
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {/* Bottom Total Summary & Order Confirmation Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100 mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#1D327B] font-bold text-base sm:text-lg">
                  الإجمالي
                </span>
                <span className="text-[#FF5A57] font-black text-lg sm:text-xl">
                  {cartTotal.toLocaleString('ar-YE')} ريال
                </span>
              </div>

              <button
                id="cart-confirm-order-btn"
                onClick={handleCheckout}
                className="w-full bg-[#1D327B] hover:bg-[#15255e] active:scale-[0.99] text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-sm transition-all cursor-pointer text-center"
              >
                تأكيد الطلب
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-0 animate-in fade-in duration-150">
        <div className="w-full max-w-md h-full max-h-screen overflow-hidden flex flex-col bg-[#F0F2F6]">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
