import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Star, Share2, X, MessageCircle, Send, Instagram, Twitter } from 'lucide-react';

export const ConfirmationDialogs: React.FC = () => {
  const {
    activeDialog,
    setActiveDialog,
    logoutUser,
    cancelOrder,
    targetOrderIdForCancel,
    targetCartItemIdForDelete,
    removeFromCart,
    deleteAddress,
    targetAddressIdForDelete,
    setCurrentScreen,
    showToast
  } = useApp();

  const [productRating, setProductRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [productNote, setProductNote] = useState('');
  const [driverNote, setDriverNote] = useState('');

  if (!activeDialog) return null;

  const handleClose = () => setActiveDialog(null);

  // Render Dialog Content based on type
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      
      {/* 1. Logout Confirmation */}
      {activeDialog === 'logout' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-red-50 text-[#EC6A62] rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-base font-black text-[#1F1F1F]">هل تريد تسجيل خروجك؟</h3>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => logoutUser()}
              className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              نعم
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3 rounded-xl font-black text-sm border border-gray-300 transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* 2. Cancel Order Confirmation */}
      {activeDialog === 'cancel_order' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-red-50 text-[#EC6A62] rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-base font-black text-[#1F1F1F]">هل تريد إلغاء الطلب؟</h3>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (targetOrderIdForCancel) cancelOrder(targetOrderIdForCancel);
                handleClose();
              }}
              className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              نعم
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3 rounded-xl font-black text-sm border border-gray-300 transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* 3. Delete Cart Item Confirmation */}
      {activeDialog === 'delete_cart_item' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-red-50 text-[#EC6A62] rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-base font-black text-[#1F1F1F]">هل تريد حذف الطلب من السلة؟</h3>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (targetCartItemIdForDelete) removeFromCart(targetCartItemIdForDelete);
                handleClose();
              }}
              className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              نعم
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3 rounded-xl font-black text-sm border border-gray-300 transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* 4. Delete Address Confirmation */}
      {activeDialog === 'delete_address' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-red-50 text-[#EC6A62] rounded-full flex items-center justify-center mx-auto border border-red-100">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-base font-black text-[#1F1F1F]">هل تريد حذف العنوان؟</h3>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (targetAddressIdForDelete) deleteAddress(targetAddressIdForDelete);
                handleClose();
              }}
              className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              نعم
            </button>

            <button
              onClick={handleClose}
              className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3 rounded-xl font-black text-sm border border-gray-300 transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* 5. Address Saved Success */}
      {activeDialog === 'address_saved_success' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-base font-black text-[#1F1F1F]">تم حفظ عنوانك بنجاح</h3>

          <button
            onClick={() => {
              handleClose();
              setCurrentScreen('addresses');
            }}
            className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            تم
          </button>
        </div>
      )}

      {/* 6. Order Success Modal */}
      {activeDialog === 'order_success' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-base font-black text-[#1F1F1F]">تم إرسال طلبك بنجاح</h3>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                handleClose();
                setCurrentScreen('main');
              }}
              className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              العودة لتسوق
            </button>

            <button
              onClick={() => {
                handleClose();
                setCurrentScreen('my_orders');
              }}
              className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3 rounded-xl font-black text-sm border border-gray-300 transition-all cursor-pointer"
            >
              تتبع الطلب
            </button>
          </div>
        </div>
      )}

      {/* 7. Rating Modal */}
      {activeDialog === 'rate_order' && (
        <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b pb-2 border-gray-100">
            <h3 className="text-sm font-black text-[#1F1F1F]">تقييم المنتجات والتوصيل</h3>
            <button onClick={handleClose} className="p-1 rounded-full bg-gray-100 text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Product Rating */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2 text-right">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1F1F1F]">شوكولاتة شوكو كبير (2800 ر.ي)</span>
              <span className="text-xs font-bold text-gray-500">تقييم الطلب</span>
            </div>

            <div className="flex items-center gap-1 justify-center py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setProductRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= productRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={productNote}
              onChange={(e) => setProductNote(e.target.value)}
              placeholder="هنا نص الملاحظة"
              rows={2}
              className="w-full text-xs font-black p-2.5 rounded-xl border border-gray-200 bg-white outline-none resize-none"
            />

            <button
              onClick={() => showToast('تم حفظ تقييم المنتج بنجاح ⭐')}
              className="w-full bg-[#1D327B] text-white py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              حفظ
            </button>
          </div>

          {/* Driver Rating */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2 text-right">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#1F1F1F]">نواف الشامي (السائق)</span>
              <span className="text-xs font-bold text-gray-500">تقييم التوصيل</span>
            </div>

            <div className="flex items-center gap-1 justify-center py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setDriverRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= driverRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={driverNote}
              onChange={(e) => setDriverNote(e.target.value)}
              placeholder="هنا نص الملاحظة"
              rows={2}
              className="w-full text-xs font-black p-2.5 rounded-xl border border-gray-200 bg-white outline-none resize-none"
            />

            <button
              onClick={() => {
                showToast('تم حفظ تقييم المندوب بنجاح ⭐');
                handleClose();
              }}
              className="w-full bg-[#1D327B] text-white py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      {/* 8. Share App Modal */}
      {activeDialog === 'share_app' && (
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
          <h3 className="text-base font-black text-[#1F1F1F]">مشاركة التطبيق</h3>

          <div className="grid grid-cols-4 gap-3 py-2">
            <button
              onClick={() => {
                showToast('تمت المشاركة عبر واتساب 💚');
                handleClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-7 h-7 fill-emerald-500 text-white" />
              <span className="text-[11px] font-black">واتساب</span>
            </button>

            <button
              onClick={() => {
                showToast('تمت المشاركة عبر تويتر 🐦');
                handleClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-black transition-colors cursor-pointer"
            >
              <Twitter className="w-7 h-7 fill-black" />
              <span className="text-[11px] font-black">تويتر</span>
            </button>

            <button
              onClick={() => {
                showToast('تمت المشاركة عبر تليجرام ✈️');
                handleClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-500 transition-colors cursor-pointer"
            >
              <Send className="w-7 h-7 fill-sky-500 text-white" />
              <span className="text-[11px] font-black">تليجرام</span>
            </button>

            <button
              onClick={() => {
                showToast('تمت المشاركة عبر انستجرام 📸');
                handleClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors cursor-pointer"
            >
              <Instagram className="w-7 h-7" />
              <span className="text-[11px] font-black">انستجرام</span>
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-white hover:bg-gray-50 text-[#1D327B] py-3 rounded-xl font-black text-sm border border-gray-300 transition-all cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      )}

    </div>
  );
};
