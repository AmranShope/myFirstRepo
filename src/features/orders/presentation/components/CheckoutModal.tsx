import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Ticket, 
  Check, 
  Plus, 
  CreditCard,
  Building2,
  Wallet,
  Coins,
  Loader2
} from 'lucide-react';
import { useApp } from '../../../../context/AppContext';
import { Address } from '../../../../types';

export const CheckoutModal: React.FC = () => {
  const { 
    user, 
    userAddresses,
    activeAddress,
    cart,
    cartTotal, 
    cartSubtotal,
    deliveryFee,
    discountAmount,
    applyCoupon,
    appliedCode,
    placeOrder,
    setAddressReturnScreen,
    tempSelectedAddressId,
    setTempSelectedAddressId,
    setCurrentScreen,
    showToast
  } = useApp();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(() => {
    if (tempSelectedAddressId) {
      const found = userAddresses.find(a => a.id === tempSelectedAddressId);
      if (found) return found;
    }
    return activeAddress;
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'hasib' | 'kuraimi' | 'flooss'>('cash');
  const [deliverySlot] = useState<string>('توصيل سريع (خلال 35 - 45 دقيقة)');
  const [notes, setNotes] = useState<string>('');
  const [couponInput, setCouponInput] = useState<string>(appliedCode || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dropdown expansion states
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);

  // Sync selectedAddress: Prioritize tempSelectedAddressId if coming from map picker, otherwise default address
  React.useEffect(() => {
    if (userAddresses.length > 0) {
      if (tempSelectedAddressId) {
        const found = userAddresses.find(a => a.id === tempSelectedAddressId);
        if (found) {
          setSelectedAddress(found);
          return;
        }
      }

      const defaultOrFirst = userAddresses.find(a => a.isDefault) || userAddresses[0];
      if (!selectedAddress || !userAddresses.some(a => a.id === selectedAddress.id)) {
        setSelectedAddress(defaultOrFirst);
      }
    } else {
      setSelectedAddress(null);
    }
  }, [userAddresses, tempSelectedAddressId]);

  const handleBack = () => {
    setCurrentScreen('cart');
  };

  const handlePasteOrApplyCoupon = async () => {
    if (couponInput.trim()) {
      const res = applyCoupon(couponInput.trim());
      showToast(res.message);
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setCouponInput(text.trim());
          const res = applyCoupon(text.trim());
          showToast(res.message);
          return;
        }
      }
    } catch {
      // Fallback promo code
    }

    const defaultCode = 'TROOLLY10';
    setCouponInput(defaultCode);
    const res = applyCoupon(defaultCode);
    showToast(res.message);
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    if (cart.length === 0) {
      showToast('سلة التسوق فارغة! أضف منتجات أولاً');
      setCurrentScreen('cart');
      return;
    }

    if (!user) {
      showToast('يرجى تسجيل الدخول أو إدخال رقم هاتفك لتأكيد الطلب 📱');
      setCurrentScreen('login');
      return;
    }

    const finalAddress = selectedAddress || activeAddress || userAddresses[0];
    if (!finalAddress) {
      setAddressReturnScreen('checkout');
      setCurrentScreen('map_picker');
      showToast('يرجى إضافة عنوان التوصيل 📍');
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(finalAddress, paymentMethod, notes, deliverySlot);
      setTempSelectedAddressId(null);
      setCurrentScreen('order_details');
    } catch {
      showToast('تعذر تأكيد الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethodsList = [
    { id: 'cash', title: 'الدفع نقداً عند الاستلام', desc: 'كاش للمندوب عند الاستلام', icon: Coins },
    { id: 'kuraimi', title: 'الكريمي جوال', desc: 'حاسب الكريمي عبر الحساب', icon: Building2 },
    { id: 'hasib', title: 'حاسب (بنك اليمن والكويت)', desc: 'المحفظة الإلكترونية', icon: CreditCard },
    { id: 'flooss', title: 'محفظة فلوس (Flooss)', desc: 'دفع رقمي فوري', icon: Wallet },
  ] as const;

  const currentPaymentTitle = paymentMethodsList.find(p => p.id === paymentMethod)?.title || 'اختر آلية الدفع';

  const content = (
    <div className="w-full min-h-screen bg-[#F0F2F6] flex flex-col justify-between text-[#1F1F1F] font-sans antialiased">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100/80 px-4 py-3.5 flex items-center justify-between shadow-2xs">
        {/* Right Side: Back Button & Title "تأكيد الطلب" */}
        <div className="flex items-center gap-2">
          <button
            id="checkout-back-btn"
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#1F1F1F]"
            aria-label="الرجوع"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-xl font-bold text-[#1F1F1F] tracking-tight">تأكيد الطلب</h1>
        </div>

        {/* Left Side: Brand mark (two coral rounded squares) */}
        <div className="flex items-center gap-1.5" title="ترولي">
          <div className="w-4 h-4 rounded-xs bg-[#FF5A57]" />
          <div className="w-4 h-4 rounded-xs bg-[#FF5A57]" />
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 p-4 pb-10 overflow-y-auto space-y-3.5">
        
        {/* Card 1: Delivery Address Dropdown */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100/80 overflow-hidden transition-all duration-200">
          <div 
            id="checkout-address-select-btn"
            onClick={() => {
              if (userAddresses.length === 0) {
                setAddressReturnScreen('checkout');
                setCurrentScreen('map_picker');
              } else {
                setIsAddressDropdownOpen(prev => !prev);
              }
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/60 transition-colors select-none"
          >
            {/* Right Side: Address Text */}
            <div className="text-right flex-1 pr-1">
              {selectedAddress ? (
                <div>
                  <span className="font-bold text-sm sm:text-base text-[#1D327B]">
                    {selectedAddress.title} ({selectedAddress.city} - {selectedAddress.area})
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {selectedAddress.street} {selectedAddress.building}
                  </p>
                </div>
              ) : (
                <span className="text-gray-400 font-medium text-sm sm:text-base">
                  اختر عنوان التوصيل
                </span>
              )}
            </div>

            {/* Left Side: Chevron Down */}
            <ChevronDown className={`w-5 h-5 text-[#1D327B] stroke-[2.5] transition-transform duration-200 ${isAddressDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Address Dropdown Content */}
          {isAddressDropdownOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2 animate-in fade-in duration-150">
              {userAddresses.length > 0 ? (
                userAddresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setTempSelectedAddressId(null);
                      setIsAddressDropdownOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedAddress?.id === addr.id
                        ? 'border-[#1D327B] bg-blue-50/60 text-[#1D327B]'
                        : 'border-gray-100 hover:border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <div className="text-right flex-1 pr-1">
                      <p className="font-bold text-xs sm:text-sm text-[#1D327B]">{addr.title}</p>
                      <p className="text-[11px] text-gray-500">{addr.city} - {addr.area} - {addr.street}</p>
                    </div>

                    {selectedAddress?.id === addr.id ? (
                      <div className="w-5 h-5 rounded-full bg-[#1D327B] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : <div className="w-5 h-5 rounded-full border border-gray-300" />}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-2">لا توجد عناوين محفوظة بعد</p>
              )}

              <button
                id="checkout-add-new-address-btn"
                onClick={() => {
                  setIsAddressDropdownOpen(false);
                  setAddressReturnScreen('checkout');
                  setCurrentScreen('map_picker');
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#1D327B] text-[#1D327B] hover:bg-blue-50/50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة عنوان توصيل جديد</span>
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Payment Method Dropdown */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100/80 overflow-hidden transition-all duration-200">
          <div 
            id="checkout-payment-select-btn"
            onClick={() => setIsPaymentDropdownOpen(prev => !prev)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/60 transition-colors select-none"
          >
            {/* Right Side: Payment title */}
            <div className="text-right flex-1 pr-1">
              <span className="font-bold text-sm sm:text-base text-[#1D327B]">
                {currentPaymentTitle}
              </span>
            </div>

            {/* Left Side: Chevron */}
            <ChevronDown className={`w-5 h-5 text-[#1D327B] stroke-[2.5] transition-transform duration-200 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Payment Method Dropdown Content */}
          {isPaymentDropdownOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2 animate-in fade-in duration-150">
              {paymentMethodsList.map(pm => {
                const IconComponent = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => {
                      setPaymentMethod(pm.id);
                      setIsPaymentDropdownOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1D327B] bg-blue-50/60 text-[#1D327B]'
                        : 'border-gray-100 hover:border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-[#1D327B] opacity-80" />

                    <div className="text-right flex-1 px-3">
                      <p className="font-bold text-xs sm:text-sm text-[#1D327B]">{pm.title}</p>
                      <p className="text-[11px] text-gray-500">{pm.desc}</p>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#1D327B] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : <div className="w-5 h-5 rounded-full border border-gray-300" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 3: Loyalty Points (Right) & Discount Coupon (Left) */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 shadow-2xs border border-gray-100/80 flex items-center justify-between gap-3 overflow-hidden">
          
          {/* Right Side: Loyalty Points */}
          <div className="flex flex-col items-center justify-center min-w-[85px] sm:min-w-[95px] shrink-0 text-center">
            <span className="font-bold text-xs sm:text-sm text-[#1D327B]">
              نقاط الولاء
            </span>
            <span className="font-bold text-xs sm:text-sm text-[#FF5A57] mt-1">
              {(user?.loyaltyPoints ?? 1000).toLocaleString('ar-YE')} نقطة
            </span>
          </div>

          {/* Vertical Dashed Divider in Middle */}
          <div className="border-r border-dashed border-gray-300 h-12 mx-1 shrink-0" />

          {/* Left Side: Coupon Input & Action Button */}
          <div className="flex-1 flex flex-col gap-2 min-w-0 pr-1 pl-0.5">
            {/* Header: aligned to right, matching input right edge */}
            <div className="flex items-center gap-1.5 justify-start">
              <Ticket className="w-4 h-4 text-[#1D327B] stroke-[2]" />
              <span className="text-xs sm:text-sm font-bold text-[#FF5A57]">اختر كود الخصم</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="checkout-coupon-input"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="كود الخصم"
                className="bg-[#F0F2F6] text-[#1F1F1F] text-xs sm:text-sm font-bold px-3 py-2 rounded-xl flex-1 text-right focus:outline-none focus:ring-1 focus:ring-[#1D327B] min-w-0"
              />

              <button
                id="checkout-paste-coupon-btn"
                onClick={handlePasteOrApplyCoupon}
                className="bg-[#1D327B] hover:bg-[#15255e] active:scale-95 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                لصق
              </button>
            </div>
          </div>

        </div>

        {/* Card 4: Order Note Card */}
        <div className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100/80">
          <textarea
            id="checkout-order-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="هنا نص الملاحظة"
            rows={2}
            className="w-full bg-transparent text-sm text-right text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
          />
        </div>

        {/* Card 5: Ordered Items & Final Financial Summary */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-gray-100/80 space-y-3">
          
          {/* Section Header with Red Vertical Indicator on Right */}
          <div className="flex items-center justify-start gap-1.5">
            <div className="w-1.5 h-4 bg-[#FF5A57] rounded-full" />
            <span className="font-bold text-base text-[#1D327B]">الأصناف المطلوبة</span>
          </div>

          {/* Items Header Row: Right = المنتج, Middle = الكمية, Left = الإجمالي */}
          <div className="grid grid-cols-12 text-xs sm:text-sm font-bold text-gray-500 pt-1 pb-1">
            <div className="col-span-5 text-right">المنتج</div>
            <div className="col-span-3 text-center">الكمية</div>
            <div className="col-span-4 text-left">الإجمالي</div>
          </div>

          {/* Items List Rows */}
          <div className="space-y-2">
            {cart.map((item) => (
              <div 
                key={item.product.id}
                className="grid grid-cols-12 items-center text-xs sm:text-sm font-bold"
              >
                <div className="col-span-5 text-right text-[#1D327B] truncate">
                  {item.product.name}
                </div>
                <div className="col-span-3 text-center text-[#1D327B]">
                  {item.quantity}
                </div>
                <div className="col-span-4 text-left text-[#FF5A57]">
                  {(item.product.price * item.quantity).toLocaleString('ar-YE')} ر.ي
                </div>
              </div>
            ))}
          </div>

          {/* Dashed Separator Line */}
          <div className="border-b border-dashed border-gray-300 my-3" />

          {/* Breakdown Summary Rows: Label on Right, Amount on Left */}
          <div className="space-y-2 text-xs sm:text-sm font-bold">
            
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-[#1D327B]">
                الإجمالي
              </span>
              <span className="text-[#FF5A57]">
                {cartSubtotal.toLocaleString('ar-YE')} ر.ي
              </span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between">
              <span className="text-[#1D327B]">
                الخصم
              </span>
              <span className="text-[#FF5A57]">
                {discountAmount > 0 ? `${discountAmount.toLocaleString('ar-YE')} ر.ي` : '1000 ر.ي'}
              </span>
            </div>

            {/* Delivery Fee */}
            <div className="flex items-center justify-between">
              <span className="text-[#1D327B]">
                رسوم التوصيل
              </span>
              <span className="text-[#FF5A57]">
                {deliveryFee > 0 ? `${deliveryFee.toLocaleString('ar-YE')} ر.ي` : '500 ر.ي'}
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#1D327B] font-black text-sm sm:text-base">
                إجمالي الطلب
              </span>
              <span className="text-[#FF5A57] font-black text-sm sm:text-base">
                {cartTotal > 0 ? `${cartTotal.toLocaleString('ar-YE')} ر.ي` : `${Math.max(0, cartSubtotal + 500 - 1000).toLocaleString('ar-YE')} ر.ي`}
              </span>
            </div>

          </div>

        </div>

        {/* Bottom Action Buttons */}
        <div className="pt-2 space-y-3">
          <button
            id="checkout-execute-order-btn"
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="w-full bg-[#1D327B] hover:bg-[#15255e] disabled:bg-gray-400 active:scale-[0.99] text-white py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed text-center flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري تأكيد الطلب...</span>
              </>
            ) : (
              <span>تنفيذ الطلب</span>
            )}
          </button>

          <button
            id="checkout-modify-order-btn"
            onClick={() => {
              setCurrentScreen('cart');
            }}
            className="w-full bg-white hover:bg-gray-50 active:scale-[0.99] text-[#1D327B] border border-[#1D327B] py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-2xs transition-all cursor-pointer text-center"
          >
            تعديل الطلب
          </button>
        </div>

      </div>

    </div>
  );

  return content;
};
