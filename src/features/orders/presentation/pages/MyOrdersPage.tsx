import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, Package, Clock, CheckCircle2, Truck, XCircle, ChevronLeft, LogIn } from 'lucide-react';
import { OrderStatus } from '../../../../types';

export const MyOrdersPage: React.FC = () => {
  const { setCurrentScreen, orders, setTrackingOrder, user } = useApp();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return { label: 'في الانتظار', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" /> };
      case 'preparing':
        return { label: 'قيد التحضير', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <Package className="w-4 h-4" /> };
      case 'on_the_way':
        return { label: 'في الطريق', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: <Truck className="w-4 h-4" /> };
      case 'delivered':
        return { label: 'تم التوصيل', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'cancelled':
        return { label: 'تم الإلغاء', color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle className="w-4 h-4" /> };
      default:
        return { label: 'تم الاعتماد', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <CheckCircle2 className="w-4 h-4" /> };
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="back-to-main-from-orders-btn"
            onClick={() => setCurrentScreen('main')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1F1F1F]">طلباتي</h1>
        </div>
      </div>

      {!user ? (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-[#1D327B] rounded-full flex items-center justify-center text-3xl">
            📦
          </div>
          <h2 className="text-lg font-black text-[#1F1F1F]">لم تسجل الدخول بعد</h2>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            أنت تتصفح كزائر. يرجى تسجيل الدخول لعرض وتتبع سجل طلباتك السابقة والحالية مباشرة من قاعدة البيانات.
          </p>
          <button
            id="login-from-orders-empty-btn"
            onClick={() => setCurrentScreen('login')}
            className="bg-[#1D327B] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول / إنشاء حساب</span>
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="p-4 space-y-3 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
              <div className="w-16 h-16 bg-blue-50 text-[#1D327B] rounded-full flex items-center justify-center mx-auto text-2xl">
                🛍️
              </div>
              <h2 className="text-base font-black text-[#1F1F1F]">لا توجد لديك طلبات سابقة حتى الآن</h2>
              <p className="text-xs text-gray-500">ابدأ التسوق الآن واستمتع بأفضل العروض وتوصيل فائق السرعة</p>
              <button
                id="shop-now-from-empty-orders-btn"
                onClick={() => setCurrentScreen('main')}
                className="bg-[#1D327B] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                تسوق الآن
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const addressText = order.address 
                ? `${order.address.area || order.address.city} ${order.address.building ? `- ${order.address.building}` : ''}`
                : 'التوصيل للعنوان المسجل';

              return (
                <div
                  key={order.id}
                  id={`order-item-${order.id}`}
                  onClick={() => {
                    setTrackingOrder(order);
                    setCurrentScreen('order_details');
                  }}
                  className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer shadow-2xs space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <span className="text-xs font-black text-[#1D327B] dir-ltr">
                      #{order.orderNumber}
                    </span>
                  </div>

                  <div className="text-right pt-1">
                    <h3 className="text-xs font-extrabold text-[#1F1F1F] mb-0.5">
                      رقم الطلب : {order.orderNumber}
                    </h3>
                    <p className="text-[11px] font-medium text-gray-500">
                      {addressText}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-semibold">{order.items.length} أصناف • {order.totalAmount.toLocaleString('ar-YE')} ر.ي</span>
                    <span className="text-[#1D327B] font-bold text-[11px] flex items-center gap-0.5 group-hover:underline">
                      <span>التفاصيل</span>
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
