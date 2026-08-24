import React, { useState } from 'react';
import { MapPin, Search, ShoppingBag, Wallet, X, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    user,
    isGuest,
    activeAddress,
    searchQuery, 
    setSearchQuery, 
    cart,
    setIsCartDrawerOpen,
    setCurrentScreen
  } = useApp();

  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'مشروبات',
    'حلويات',
    'أدوات منزلية',
    'خضروات وفواكه'
  ]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectHistoryTerm = (term: string) => {
    setSearchQuery(term);
    setIsSearchHistoryOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      setSearchHistory([searchQuery.trim(), ...searchHistory.slice(0, 7)]);
    }
    setIsSearchHistoryOpen(false);
  };

  const displayName = user?.name 
    ? user.name.trim().split(' ')[0]
    : (isGuest ? 'زائرنا الكريم' : 'عزيزي العميل');

  const locationText = activeAddress 
    ? `${activeAddress.area || activeAddress.title}`
    : 'حدد عنوان التوصيل';

  return (
    <>
      <header className="bg-white text-[#1F1F1F] pt-3 pb-0 px-4 sticky top-0 z-40 shadow-xs w-full max-w-md mx-auto">
        {/* Top row: User Profile & Delivery Location on right, Cart & Wallet on left */}
        <div className="flex items-center justify-between gap-2 mb-3">
          
          {/* Right Side: Profile Picture & Welcome Text */}
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => setCurrentScreen(user ? 'profile' : 'login')}
              className="relative cursor-pointer group"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'المستخدم'}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-50 border-2 border-white shadow-xs flex items-center justify-center text-[#1D327B] text-lg font-bold group-hover:scale-105 transition-transform">
                  👤
                </div>
              )}
            </div>

            <div className="flex flex-col text-right">
              <span className="font-black text-sm sm:text-base text-[#1F1F1F] leading-tight">
                مرحباً، {displayName}
              </span>
              
              {user ? (
                <button
                  id="header-delivery-address-btn"
                  onClick={() => setCurrentScreen('addresses')}
                  className="flex items-center gap-1 text-[#EC6A62] hover:text-red-600 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#EC6A62] shrink-0" />
                  <span className="text-xs font-bold leading-none truncate max-w-[130px]">{locationText}</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="flex items-center gap-1 text-[#1D327B] hover:text-blue-800 transition-colors"
                >
                  <span className="text-xs font-extrabold leading-none underline">تسجيل الدخول</span>
                </button>
              )}
            </div>
          </div>

          {/* Left Side: Cart & Wallet Icons */}
          <div className="flex items-center gap-2">
            {/* Wallet Icon */}
            <button
              onClick={() => setCurrentScreen('loyalty')}
              className="p-2 rounded-xl text-[#1D327B] hover:bg-gray-100 transition-all border border-gray-200/80 bg-gray-50 relative"
              title="المحفظة والنقاط"
            >
              <Wallet className="w-5 h-5 text-[#1D327B]" />
              {user && user.loyaltyPoints > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1D327B] text-white text-[9px] font-black px-1 py-0.5 rounded-full border border-white">
                  {user.loyaltyPoints}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setCurrentScreen('cart')}
              className="relative p-2 rounded-xl text-[#1D327B] hover:bg-gray-100 transition-all border border-gray-200/80 bg-gray-50 cursor-pointer"
              title="سلة التسوق"
            >
              <ShoppingBag className="w-5 h-5 text-[#1D327B]" />
              {totalCartItems > 0 ? (
                <span className="absolute -top-1 -right-1 bg-[#EC6A62] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartItems}
                </span>
              ) : (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EC6A62] rounded-full border border-white" />
              )}
            </button>
          </div>

        </div>

        {/* Search Bar Container */}
        <div className="-mx-4 px-4 py-2 bg-[#F1F3F6]">
          <div 
            onClick={() => setIsSearchHistoryOpen(true)}
            className="relative w-full cursor-pointer"
          >
            <input
              type="text"
              readOnly
              value={searchQuery}
              onClick={() => setIsSearchHistoryOpen(true)}
              placeholder="...ابحث"
              className="w-full bg-white text-[#1F1F1F] placeholder:text-[#9CA3AF] text-sm font-bold py-2.5 pe-10 ps-9 rounded-2xl border border-gray-200/60 outline-none text-right shadow-2xs cursor-pointer"
            />
            <Search className="w-5 h-5 text-[#9CA3AF] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            
            {searchQuery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F1F1F] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search History Modal Overlay */}
      {isSearchHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-3 px-3 sm:px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-4 shadow-2xl border border-gray-100 space-y-3 animate-in fade-in duration-200">
            
            <form onSubmit={handleSearchSubmit} className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setIsSearchHistoryOpen(false)}
                className="p-1.5 text-[#1D327B] hover:bg-gray-100 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="...ابحث"
                  className="w-full bg-transparent text-[#1F1F1F] placeholder:text-[#9CA3AF] text-base font-bold py-1 pr-9 pl-2 outline-none text-right"
                />
                <Search className="w-5 h-5 text-[#1D327B] absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </form>

            <div className="border-b border-gray-100" />

            <div className="space-y-1 max-h-[320px] overflow-y-auto no-scrollbar">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectHistoryTerm(term)}
                  className="w-full flex items-center justify-end gap-2.5 py-2 px-2 hover:bg-gray-50 rounded-xl transition-colors text-right group"
                >
                  <span className="text-sm font-semibold text-gray-500 group-hover:text-[#1D327B] transition-colors">
                    {term}
                  </span>
                  <Clock className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#1D327B] shrink-0" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
