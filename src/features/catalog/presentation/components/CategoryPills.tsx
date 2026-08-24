import React from 'react';
import { CATEGORIES } from '../../../../data/mockData';
import { useApp } from '../../../../context/AppContext';

export const CategoryPills: React.FC = () => {
  const { selectedCategoryId, setSelectedCategoryId, setActiveTab } = useApp();

  return (
    <div className="w-full my-3">
      {/* Header title & All view link */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-[#EC6A62] rounded-full inline-block" />
          <h2 className="text-base font-black text-[#1F1F1F]">الفئات</h2>
        </div>

        <button
          onClick={() => {
            setSelectedCategoryId(null);
            setActiveTab('categories');
          }}
          className="text-xs font-black text-[#EC6A62] hover:underline"
        >
          عرض الكل
        </button>
      </div>

      {/* Horizontal scrollable categories */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-3 pt-1 px-1">
        {CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCategoryId === cat.id;
          const isEven = idx % 2 === 0;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(isSelected ? null : cat.id);
              }}
              className={`shrink-0 flex flex-col items-center justify-between w-[112px] sm:w-[122px] h-[160px] sm:h-[170px] bg-white transition-all duration-200 border border-gray-100/90 shadow-2xs hover:shadow-md ${
                isEven
                  ? 'rounded-t-[38px] rounded-b-[22px] pt-3.5 pb-2 px-2.5'
                  : 'rounded-t-[22px] rounded-b-[38px] pt-2 pb-3.5 px-2.5'
              } ${
                isSelected
                  ? 'ring-2 ring-[#1D327B] border-[#1D327B]'
                  : 'hover:border-gray-200'
              }`}
            >
              {isEven ? (
                <>
                  <span className={`text-xs sm:text-[13px] font-black text-center leading-tight mt-0.5 line-clamp-2 ${
                    isSelected ? 'text-[#EC6A62]' : 'text-[#1D327B]'
                  }`}>
                    {cat.name}
                  </span>

                  <div className="w-full h-24 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center p-1 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-24 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center p-1 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <span className={`text-xs sm:text-[13px] font-black text-center leading-tight mb-0.5 line-clamp-2 ${
                    isSelected ? 'text-[#EC6A62]' : 'text-[#1D327B]'
                  }`}>
                    {cat.name}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
