import React from 'react';
import { 
  ChevronRight, Calendar, ShoppingBag, CreditCard, Clock, 
  FileText, ShoppingCart, Truck, CheckCircle2, Phone
} from 'lucide-react';
import { useApp } from '../../../../context/AppContext';
import { OrderStatus } from '../../../../types';

export const OrderTrackingModal: React.FC = () => {
  const { 
    trackingOrder, 
    setTrackingOrder, 
    cancelOrder, 
    showToast, 
    setCurrentScreen, 
    orders 
  } = useApp();

  const activeOrder = trackingOrder || orders[0] || null;

  const handleBack = () => {
    setTrackingOrder(null);
    setCurrentScreen('my_orders');
  };

  const handleCancelOrder = () => {
    if (!activeOrder) return;
    if (activeOrder.status === 'cancelled') {
      showToast('هذا الطلب ملغي بالفعل');
      return;
    }
    if (activeOrder.status === 'delivered') {
      showToast('لا يمكن إلغاء طلب تم توصيله');
      return;
    }
    cancelOrder(activeOrder.id);
    showToast('تم إلغاء الطلب بنجاح');
  };

  if (!activeOrder) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#2B3A67] rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">
          📦
        </div>
        <h2 className="text-base font-black mb-2 text-[#2B3A67]">لا يوجد طلب محدد</h2>
        <p className="text-xs text-gray-500 mb-4">يمكنك استعراض قائمة طلباتك السابقة من صفحة طلباتي.</p>
        <button
          id="go-to-my-orders-fallback-btn"
          onClick={() => setCurrentScreen('my_orders')}
          className="bg-[#2B3A67] hover:bg-[#1e2a4d] text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all active:scale-95"
        >
          الانتقال إلى طلباتي
        </button>
      </div>
    );
  }

  // Format Date (e.g. 2024 / 11 / 26)
  const getFormattedDate = () => {
    try {
      const d = activeOrder.createdAt ? new Date(activeOrder.createdAt) : new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year} / ${month} / ${day}`;
    } catch {
      return '2024 / 11 / 26';
    }
  };

  // Format Time (e.g. 01:50 م)
  const getFormattedTime = () => {
    try {
      const d = activeOrder.createdAt ? new Date(activeOrder.createdAt) : new Date();
      return d.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '01:50 م';
    }
  };

  // Items count
  const itemsCount = activeOrder.items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  // Payment text
  const getPaymentText = () => {
    switch (activeOrder.paymentMethod) {
      case 'cod': return 'عند الاستلام';
      case 'wallet': return 'المحفظة';
      case 'kuraimi': return 'الكريمي';
      case 'card': return 'بطاقة بنكية';
      default: return 'عند الاستلام';
    }
  };

  // Status mapping for timeline
  const timelineSteps: { id: string; label: string; icon: React.ElementType }[] = [
    { id: 'received', label: 'في الانتظار', icon: Clock },
    { id: 'confirmed', label: 'تم الأعتماد', icon: FileText },
    { id: 'preparing', label: 'قيد التحضير', icon: ShoppingCart },
    { id: 'on_the_way', label: 'في الطريق', icon: Truck },
    { id: 'delivered', label: 'تم التوصيل', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 2;
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const activeStepIdx = getStepIndex(activeOrder.status);

  // Address formatting
  const getFormattedAddress = () => {
    if (!activeOrder.address) {
      return 'بلاتفورم - شارع الزبيري - تقاطع شارع هائل - برج النعمان - الدور السابع';
    }
    const parts = [
      activeOrder.address.title,
      activeOrder.address.city,
      activeOrder.address.area,
      activeOrder.address.street,
      activeOrder.address.building,
      activeOrder.address.details
    ].filter(Boolean);
    
    return parts.length > 0 
      ? parts.join(' - ') 
      : 'بلاتفورم - شارع الزبيري - تقاطع شارع هائل - برج النعمان - الدور السابع';
  };

  // Calculation values
  const deliveryFee = 500;
  const subtotal = Math.max(0, activeOrder.totalAmount - deliveryFee);
  const totalAmount = activeOrder.totalAmount;

  // Fallback demo items if order has none
  const displayItems = activeOrder.items.length > 0 ? activeOrder.items : [
    { product: { id: 'p1', name: 'طحينية سادة', price: 500, image: '', categoryId: '', unit: 'حبة', inStock: true }, quantity: 4 },
    { product: { id: 'p2', name: 'خلطة فلافل', price: 3000, image: '', categoryId: '', unit: 'حبة', inStock: true }, quantity: 1 },
    { product: { id: 'p3', name: 'طحينية سمسم', price: 1000, image: '', categoryId: '', unit: 'حبة', inStock: true }, quantity: 2 }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col dir-rtl pb-8">
      
      {/* 1. Header Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3.5 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <button
          id="back-from-order-details-btn"
          onClick={handleBack}
          className="flex items-center gap-1 text-[#1F1F1F] hover:text-[#2B3A67] font-black text-sm transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-800 stroke-[2.5]" />
          <span>تفاصيل الطلب</span>
        </button>
      </div>

      <div className="p-4 space-y-3.5 flex-1 max-w-md mx-auto w-full">

        {/* 2. Top Circular Element + Navy Info Bar */}
        <div className="flex flex-col items-center pt-1 pb-1 relative">
          
          {/* Concentric Circle Badge */}
          <div className="w-28 h-28 rounded-full bg-[#E2E6EF]/70 flex items-center justify-center p-2 relative shadow-inner">
            <div className="w-22 h-22 rounded-full bg-[#CBD3E3]/80 flex items-center justify-center p-1.5">
              <div className="w-18 h-18 rounded-full bg-[#2B3A67] flex flex-col items-center justify-center text-white shadow-md text-center">
                <span className="text-[10px] font-normal text-white/90">رقم الطلب</span>
                <span className="text-xs font-black tracking-wide">{activeOrder.orderNumber || '2127733'}</span>
              </div>
            </div>
          </div>

          {/* Navy Horizontal Bar with 3 Columns */}
          <div className="w-full bg-[#2B3A67] text-white rounded-2xl py-3 px-1 grid grid-cols-3 divide-x divide-x-reverse divide-white/20 shadow-md mt-[-18px] relative z-10">
            {/* Right: Date */}
            <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
              <Calendar className="w-4 h-4 text-white/90" />
              <span className="text-[10px] font-bold text-white tracking-wider">{getFormattedDate()}</span>
            </div>

            {/* Center: Items Count */}
            <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
              <ShoppingBag className="w-4 h-4 text-white/90" />
              <span className="text-[10px] font-bold text-white">{itemsCount} أصناف</span>
            </div>

            {/* Left: Payment Method */}
            <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
              <CreditCard className="w-4 h-4 text-white/90" />
              <span className="text-[10px] font-bold text-white">{getPaymentText()}</span>
            </div>
          </div>
        </div>

        {/* 3. Card: Order Status Timeline */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#E84D35] rounded-full" />
            <h3 className="text-xs font-black text-[#1F1F1F]">حالة الطلب</h3>
          </div>

          {/* Timeline Grid */}
          <div className="space-y-4 py-1">
            {timelineSteps.map((step, idx) => {
              const isActive = idx === activeStepIdx;
              const isPast = idx < activeStepIdx;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 relative">
                  
                  {/* Right Column: Step Name */}
                  <div className="text-right">
                    <span className={`text-xs ${
                      isActive 
                        ? 'font-black text-[#2B3A67]' 
                        : isPast 
                          ? 'font-bold text-gray-600' 
                          : 'font-bold text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Center Column: Dot / Capsule & Connector Line */}
                  <div className="flex flex-col items-center justify-center relative min-w-[20px]">
                    {/* Upper Dotted Connector */}
                    {idx > 0 && (
                      <div className="absolute -top-4 bottom-1/2 w-0.5 border-r-2 border-dotted border-gray-300 -z-0" />
                    )}

                    {/* Lower Dotted Connector */}
                    {idx < timelineSteps.length - 1 && (
                      <div className="absolute top-1/2 -bottom-4 w-0.5 border-r-2 border-dotted border-gray-300 -z-0" />
                    )}

                    {isActive ? (
                      /* Active Capsule with red dot */
                      <div className="w-2.5 h-7 rounded-full bg-[#2B3A67] flex items-start justify-center pt-0.5 z-10 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E84D35]" />
                      </div>
                    ) : isPast ? (
                      /* Past Completed Dot */
                      <div className="w-2 h-2 rounded-full bg-[#2B3A67] z-10" />
                    ) : (
                      /* Inactive Dot */
                      <div className="w-2 h-2 rounded-full bg-gray-300 z-10" />
                    )}
                  </div>

                  {/* Left Column: Time & Icon */}
                  <div className="flex items-center justify-end gap-1.5 text-left">
                    <span className={`text-[11px] ${
                      isActive 
                        ? 'font-bold text-[#2B3A67]' 
                        : isPast 
                          ? 'font-medium text-gray-600' 
                          : 'font-medium text-gray-400'
                    }`}>
                      {getFormattedTime()}
                    </span>
                    <StepIcon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-[#2B3A67]' 
                        : isPast 
                          ? 'text-gray-600' 
                          : 'text-gray-300'
                    }`} />
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Card: Items Table */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#E84D35] rounded-full" />
            <h3 className="text-xs font-black text-[#1F1F1F]">الأصناف المطلوبة</h3>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-3 text-[11px] font-bold text-gray-400 pb-1.5 border-b border-dashed border-gray-200">
            <span className="text-right">المنتج</span>
            <span className="text-center">الكمية</span>
            <span className="text-left">الإجمالي</span>
          </div>

          {/* Table Rows */}
          <div className="space-y-2.5 pt-0.5">
            {displayItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 items-center text-xs py-1 border-b border-dashed border-gray-100 last:border-0">
                <span className="font-bold text-[#2B3A67] text-right truncate pl-1">{item.product.name}</span>
                <span className="font-bold text-[#2B3A67] text-center">{item.quantity} حبات</span>
                <span className="font-bold text-[#E84D35] text-left">
                  {(item.product.price * item.quantity).toLocaleString('ar-YE')} ر.ي
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Card: Invoice Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100/80 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#E84D35] rounded-full" />
            <h3 className="text-xs font-black text-[#1F1F1F]">اجمالي الفاتورة</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#2B3A67]">الإجمالي</span>
              <span className="font-bold text-[#E84D35]">{subtotal.toLocaleString('ar-YE')} ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#2B3A67]">رسوم التوصيل</span>
              <span className="font-bold text-[#E84D35]">{deliveryFee.toLocaleString('ar-YE')} ريال</span>
            </div>
          </div>

          {/* Dashed Separator */}
          <div className="border-t border-dashed border-blue-200 my-1" />

          <div className="flex justify-between items-center text-xs">
            <span className="font-black text-[#2B3A67]">إجمالي الطلب</span>
            <span className="font-black text-[#E84D35] text-sm">{totalAmount.toLocaleString('ar-YE')} ريال</span>
          </div>
        </div>

        {/* 6. Card: Delivery Address */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#E84D35] rounded-full" />
            <h3 className="text-xs font-black text-[#1F1F1F]">عنوان التوصيل</h3>
          </div>
          <p className="text-xs font-bold text-[#2B3A67] leading-relaxed text-right">
            {getFormattedAddress()}
          </p>
        </div>

        {/* 7. Card: Order Note */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#E84D35] rounded-full" />
            <h3 className="text-xs font-black text-[#1F1F1F]">ملاحظة الطلب</h3>
          </div>
          <p className="text-xs font-bold text-[#2B3A67] text-right">
            {activeOrder.orderNotes || 'تأكد من انه كله طازج'}
          </p>
        </div>

        {/* 8. Card: Driver Info */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100/80 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-[#E84D35] rounded-full" />
            <h3 className="text-xs font-black text-[#1F1F1F]">معلومات الموصل</h3>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={activeOrder.driverInfo?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={activeOrder.driverInfo?.name || 'نواف الشامي'}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20 bg-orange-100"
              />
              <span className="text-xs font-black text-[#2B3A67]">
                {activeOrder.driverInfo?.name || 'نواف الشامي'}
              </span>
            </div>

            <a
              id="call-driver-btn"
              href={`tel:${activeOrder.driverInfo?.phone || '777777777'}`}
              className="w-9 h-9 rounded-xl bg-[#2B3A67] hover:bg-[#1f2b4d] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs"
              aria-label="اتصال بالموصل"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 9. Bottom Button: Cancel Order */}
        <div className="pt-2 pb-6">
          <button
            id="cancel-order-page-btn"
            onClick={handleCancelOrder}
            className="w-full bg-white hover:bg-red-50 border-2 border-[#2B3A67] active:scale-98 text-[#2B3A67] hover:text-red-600 hover:border-red-500 py-3 rounded-2xl font-black text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center"
          >
            إلغاء الطلب
          </button>
        </div>

      </div>
    </div>
  );
};

