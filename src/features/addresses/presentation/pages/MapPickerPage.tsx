import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { ArrowRight, MapPin, Navigation, Check, Home, Building, Briefcase } from 'lucide-react';
import { YEMEN_CITIES } from '../../../../data/mockData';
import { InteractiveMapPicker } from '../components/InteractiveMapPicker';
import { AddressType, LocationCoordinates } from '../../domain/entities/address.entity';

export const MapPickerPage: React.FC = () => {
  const { 
    setCurrentScreen, 
    user, 
    addAddress,
    addressReturnScreen,
    setAddressReturnScreen,
    setTempSelectedAddressId,
    showToast 
  } = useApp();

  const [title, setTitle] = useState<string>('منزل');
  const [city, setCity] = useState<string>(YEMEN_CITIES[0].name);
  const [area, setArea] = useState<string>(YEMEN_CITIES[0].areas[0]);
  const [phone, setPhone] = useState<string>(user?.phone || '777777777');
  const [addressType, setAddressType] = useState<AddressType>('منزل');
  const [street, setStreet] = useState<string>('شارع الزبيري - تقاطع هائل');
  const [description, setDescription] = useState<string>('برج النعمان - الدور السابع - شقة 702');
  const [coordinates, setCoordinates] = useState<LocationCoordinates>({ lat: 15.3694, lng: 44.1910 });

  const currentCityObj = YEMEN_CITIES.find(c => c.name === city) || YEMEN_CITIES[0];

  const handleBack = () => {
    const dest = addressReturnScreen || 'addresses';
    setAddressReturnScreen(null);
    setCurrentScreen(dest);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) {
      showToast('يرجى كتابة اسم الشارع أو المعلم القريب');
      return;
    }

    const createdAddr = addAddress({
      title: title.trim() || addressType,
      city,
      area,
      street: street.trim(),
      building: description.trim(),
      phone: phone.trim() || user?.phone || '777777777',
      addressType,
      coordinates,
      isDefault: false
    });

    const dest = addressReturnScreen || 'addresses';
    if (dest === 'checkout' && createdAddr?.id) {
      setTempSelectedAddressId(createdAddr.id);
    }
    setAddressReturnScreen(null);
    setCurrentScreen(dest);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#F1F3F6] text-[#1F1F1F] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            id="back-to-addresses-from-map-btn"
            onClick={handleBack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            aria-label="الرجوع"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black text-[#1F1F1F]">إضافة عنوان وخريطة التوصيل</h1>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="p-3 bg-white border-b border-gray-200">
        <InteractiveMapPicker
          cityName={city}
          areaName={area}
          initialCoords={coordinates}
          onCoordsChange={(coords) => setCoordinates(coords)}
        />
      </div>

      {/* Address Form */}
      <form onSubmit={handleSaveLocation} className="p-4 space-y-3 flex-1 bg-white relative z-10 shadow-lg">
        
        {/* Title Name */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">اسم العنوان:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full text-xs font-black text-[#1F1F1F] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1D327B] outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">رقم الهاتف للتواصل أثناء التوصيل:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full text-xs font-black text-[#1F1F1F] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1D327B] outline-none dir-ltr text-right"
          />
        </div>

        {/* City & Area Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">اختر المدينة:</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                const c = YEMEN_CITIES.find(item => item.name === e.target.value);
                if (c) setArea(c.areas[0]);
              }}
              className="w-full text-xs font-black text-[#1F1F1F] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none"
            >
              {YEMEN_CITIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 block mb-1">اختر المنطقة:</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full text-xs font-black text-[#1F1F1F] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none"
            >
              {currentCityObj.areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Address Type Selection */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">اختر نوع العنوان:</label>
          <div className="grid grid-cols-3 gap-2">
            {(['منزل', 'شقة', 'مكتب'] as AddressType[]).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  setAddressType(type);
                  setTitle(type);
                }}
                className={`py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  addressType === type
                    ? 'bg-[#1D327B] text-white border-[#1D327B] shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {type === 'مكتب' ? <Briefcase className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Street & Landmark */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">الشارع أو المعلم القريب:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="w-full text-xs font-black text-[#1F1F1F] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1D327B] outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 block mb-1">تفاصيل العمارة / رقم الشقة / الدور:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
            className="w-full text-xs font-black text-[#1F1F1F] p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1D327B] outline-none resize-none"
          />
        </div>

        {/* Submit Save */}
        <button
          type="submit"
          id="save-map-address-btn"
          className="w-full bg-[#1D327B] hover:bg-[#2843a0] text-white py-3.5 rounded-xl font-black text-sm shadow-md active:scale-95 transition-all text-center mt-4 cursor-pointer"
        >
          حفظ وتأكيد العنوان 📍
        </button>
      </form>

    </div>
  );
};
