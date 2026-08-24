import React from 'react';
import { Check, Trash2, MapPin, Building, Home, Briefcase, Edit2 } from 'lucide-react';
import { AddressEntity } from '../../domain/entities/address.entity';

interface AddressCardProps {
  address: AddressEntity;
  onSelectDefault?: (id: string) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  onEdit?: (address: AddressEntity, e: React.MouseEvent) => void;
  isCompact?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onSelectDefault,
  onDelete,
  onEdit,
  isCompact = false
}) => {
  const getIcon = () => {
    switch (address.addressType) {
      case 'شقة':
        return <Building className="w-4 h-4 text-[#1D327B]" />;
      case 'مكتب':
        return <Briefcase className="w-4 h-4 text-[#1D327B]" />;
      case 'منزل':
      default:
        return <Home className="w-4 h-4 text-[#1D327B]" />;
    }
  };

  if (isCompact) {
    return (
      <div 
        onClick={() => onSelectDefault?.(address.id)}
        className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
          address.isDefault
            ? 'bg-blue-50/80 border-[#1D327B] shadow-2xs'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            {getIcon()}
            <span className="font-extrabold text-xs text-[#1D327B]">{address.title}</span>
          </div>
          {address.isDefault ? (
            <span className="bg-[#1D327B] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>افتراضي</span>
            </span>
          ) : (
            <span className="text-[10px] text-gray-500 font-bold hover:underline">
              تعيين كافتراضي
            </span>
          )}
        </div>
        <p className="text-xs font-extrabold text-gray-800">
          📍 {address.city} - {address.area}
        </p>
        <p className="text-[11px] text-gray-600">
          {address.street} {address.building ? `• ${address.building}` : ''}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectDefault?.(address.id)}
      className={`bg-white p-4 rounded-2xl border text-right transition-all cursor-pointer relative shadow-2xs ${
        address.isDefault ? 'border-[#1D327B] ring-2 ring-[#1D327B]/10' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-[#1D327B] rounded-lg">
            {getIcon()}
          </div>
          <span className="font-extrabold text-sm text-[#1D327B]">{address.title}</span>
          {address.isDefault ? (
            <span className="bg-[#1D327B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>العنوان الافتراضي (الرئيسي)</span>
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectDefault?.(address.id);
              }}
              className="text-[11px] font-bold text-[#1D327B] bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              تعيين كافتراضي 📍
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={(e) => onEdit(address, e)}
              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="تعديل العنوان"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => onDelete(address.id, e)}
              className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              title="حذف العنوان"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs font-black text-[#1F1F1F] mb-1">
        {address.city} - {address.area} {address.street ? `- ${address.street}` : ''}
      </p>

      {address.building && (
        <p className="text-[11px] font-medium text-gray-500 leading-snug">
          {address.building} {address.details ? `- ${address.details}` : ''}
        </p>
      )}

      {address.coordinates && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-[10px] text-gray-400">
          <MapPin className="w-3 h-3 text-[#FF4441]" />
          <span>إحداثيات محددة على الخريطة</span>
        </div>
      )}
    </div>
  );
};
