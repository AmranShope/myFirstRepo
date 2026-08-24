import React from 'react';
import { useApp } from '../../../../context/AppContext';
import { useAddresses } from '../hooks/useAddresses';
import { ArrowRight, Plus, LogIn, MapPin } from 'lucide-react';
import { AddressCard } from '../components/AddressCard';
import { AddressEntity } from '../../domain/entities/address.entity';

export const AddressesPage: React.FC = () => {
  const { 
    setCurrentScreen, 
    user, 
    setActiveDialog, 
    setTargetAddressIdForDelete,
    setAddressReturnScreen 
  } = useApp();

  const {
    addresses,
    setDefaultAddress,
    deleteAddress
  } = useAddresses();

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetAddressIdForDelete(id);
    setActiveDialog('delete_address');
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="back-to-main-from-addresses-btn"
            onClick={() => setCurrentScreen('main')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1F1F1F]">عناويني</h1>
        </div>

        {user && (
          <button
            id="add-new-address-header-btn"
            onClick={() => {
              setAddressReturnScreen('addresses');
              setCurrentScreen('map_picker');
            }}
            className="p-2 rounded-full bg-[#1D327B] text-white hover:bg-[#2843a0] transition-colors shadow-xs cursor-pointer"
            title="إضافة عنوان جديد"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {!user ? (
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 text-[#1D327B] rounded-full flex items-center justify-center text-3xl">
            📍
          </div>
          <h2 className="text-lg font-black text-[#1F1F1F]">لم تسجل الدخول بعد</h2>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            أنت تتصفح كزائر. يرجى تسجيل الدخول لحفظ وإدارة عناوين التوصيل الخاصة بك للطلب السريع.
          </p>
          <button
            id="login-from-addresses-btn"
            onClick={() => setCurrentScreen('login')}
            className="bg-[#1D327B] text-white px-6 py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول / إنشاء حساب</span>
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-20 h-20 bg-red-50 text-[#FF4441] rounded-full flex items-center justify-center text-3xl">
            🏠
          </div>
          <h2 className="text-base font-black text-[#1F1F1F]">لا توجد لديك عناوين محفوظة</h2>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            أضف عنوانك الأول (المنزل، العمل، أو غيره) لتسهيل وتوصيل طلباتك بسرعة فائقة!
          </p>
          <button
            id="add-first-address-btn"
            onClick={() => {
              setAddressReturnScreen('addresses');
              setCurrentScreen('map_picker');
            }}
            className="bg-[#1D327B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5 mt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عنوان جديد الآن</span>
          </button>
        </div>
      ) : (
        /* Addresses List */
        <div className="p-4 space-y-3 flex-1">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onSelectDefault={(id) => setDefaultAddress(id)}
              onDelete={(id, e) => handleDeletePrompt(id, e)}
            />
          ))}
        </div>
      )}

      {/* Footer Add New Button */}
      {user && (
        <div className="p-4 bg-white border-t border-gray-200 sticky bottom-0 z-10">
          <button
            id="add-address-footer-btn"
            onClick={() => {
              setAddressReturnScreen('addresses');
              setCurrentScreen('map_picker');
            }}
            className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3.5 px-4 rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة عنوان جديد</span>
          </button>
        </div>
      )}

    </div>
  );
};
