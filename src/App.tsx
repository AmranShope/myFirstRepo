import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header, BottomNav, Toast, OfflineBanner, ConfirmationDialogs, EmptyStatesView } from './shared/ui';

// Features - Auth
import { LoginPage as LoginView } from './features/auth/presentation/pages/LoginPage';
import { OTPVerificationPage as OTPVerificationView } from './features/auth/presentation/pages/OTPVerificationPage';

// Features - Info / Utility
import {
  SplashPage as SplashView,
  OnboardingPage as OnboardingView,
  MorePage as MoreView,
  AboutAppPage as AboutAppView,
  AboutUsMenuPage as AboutUsMenuView,
  PrivacyPolicyPage as PrivacyPolicyView,
  PrivacySecurityPage as PrivacySecurityView,
  ReturnPolicyPage as ReturnPolicyView,
  DiscountCouponsPage as DiscountCouponsView
} from './features/info';

// Features - Profile
import { ProfilePage as ProfileView } from './features/profile/presentation/pages/ProfilePage';

// Features - Addresses
import { AddressesPage as AddressesView } from './features/addresses/presentation/pages/AddressesPage';
import { MapPickerPage as MapPickerView } from './features/addresses/presentation/pages/MapPickerPage';

// Features - Orders
import { MyOrdersPage as MyOrdersView } from './features/orders/presentation/pages/MyOrdersPage';
import { OrderTrackingModal as OrderTrackingView } from './features/orders/presentation/components/OrderTrackingModal';
import { CheckoutModal } from './features/orders/presentation/components/CheckoutModal';

// Features - Loyalty
import { LoyaltyPage as LoyaltyView } from './features/loyalty/presentation/pages/LoyaltyPage';
import { LoyaltyPointsModal } from './features/loyalty/presentation/components/LoyaltyPointsModal';

// Features - Catalog
import { HomePage as HomeView } from './features/catalog/presentation/pages/HomePage';
import { CategoriesPage as CategoriesView } from './features/catalog/presentation/pages/CategoriesPage';
import { OffersPage as OffersView } from './features/catalog/presentation/pages/OffersPage';
import { ProductDetailModal } from './features/catalog/presentation/components/ProductDetailModal';
import { ProductVariantsModal } from './features/catalog/presentation/components/ProductVariantsModal';

// Features - Favorites
import { FavoritesPage as FavoritesView } from './features/favorites/presentation/pages/FavoritesPage';

// Features - Cart
import { CartDrawer as CartView } from './features/cart/presentation/components/CartDrawer';

import { Smartphone, Monitor } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, currentScreen } = useApp();
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true); // Mobile viewport ~430px reference

  return (
    <div className="min-h-screen bg-[#E5E7EB] text-[#1F1F1F] flex flex-col items-center justify-start antialiased selection:bg-[#1D327B] selection:text-white dir-rtl">
      
      {/* Desktop Device Frame Bar */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-md bg-[#111827] text-white px-4 py-2.5 rounded-t-2xl mt-2 text-xs border-b border-gray-800 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black text-white">ترولي (Troolly) - 430px Mobile Viewport</span>
        </div>

        <button
          onClick={() => setDeviceFrame(!deviceFrame)}
          className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {deviceFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{deviceFrame ? 'تكبير للشاشة الكاملة' : 'وضع الجوال (430px)'}</span>
        </button>
      </div>

      {/* Main App Container */}
      <main className={`w-full min-h-screen bg-[#F1F3F6] relative shadow-2xl transition-all duration-300 ${
        deviceFrame ? 'max-w-md lg:min-h-[880px] lg:h-auto lg:my-0 lg:rounded-b-3xl lg:border-x lg:border-b lg:border-gray-300 overflow-x-clip' : 'max-w-full'
      }`}>
        <OfflineBanner />
        
        {/* Render Specific Full-Page Screens */}
        {currentScreen === 'splash' && <SplashView />}
        {currentScreen === 'onboarding' && <OnboardingView />}
        {currentScreen === 'login' && <LoginView />}
        {currentScreen === 'otp' && <OTPVerificationView />}
        {currentScreen === 'profile' && <ProfileView />}
        {currentScreen === 'addresses' && <AddressesView />}
        {currentScreen === 'map_picker' && <MapPickerView />}
        {currentScreen === 'my_orders' && <MyOrdersView />}
        {currentScreen === 'order_details' && <OrderTrackingView />}
        {currentScreen === 'loyalty' && <LoyaltyView />}
        {currentScreen === 'coupons' && <DiscountCouponsView />}
        {currentScreen === 'privacy_security' && <PrivacySecurityView />}
        {currentScreen === 'about_us' && <AboutUsMenuView />}
        {currentScreen === 'about_app' && <AboutAppView />}
        {currentScreen === 'return_policy' && <ReturnPolicyView />}
        {currentScreen === 'privacy_policy' && <PrivacyPolicyView />}
        {currentScreen === 'empty_states' && <EmptyStatesView />}
        {currentScreen === 'cart' && <CartView />}
        {currentScreen === 'checkout' && <CheckoutModal />}

        {/* Main Tab Screen Shell */}
        {currentScreen === 'main' && (
          <>
            {activeTab !== 'more' && <Header />}

            <div className="w-full">
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'categories' && <CategoriesView />}
              {activeTab === 'offers' && <OffersView />}
              {activeTab === 'favorites' && <FavoritesView />}
              {activeTab === 'more' && <MoreView />}
            </div>

            <BottomNav />
          </>
        )}

        {/* Global Overlays & Modals */}
        <Toast />
        <ProductDetailModal />
        <ProductVariantsModal />
        <ConfirmationDialogs />
        <LoyaltyPointsModal />

      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
