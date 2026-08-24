export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  price: number; // in Yemeni Riyal (ر.ي)
  originalPrice?: number; // if on offer
  unit: string; // e.g. "كجم", "قطعة", "لتر", "عبوة", "ربطة"
  availableUnits?: string[];
  image: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  badge?: string; // e.g. "عرض خاص", "طازج اليوم", "منتج بلدي", "الأكثر مبيعاً"
  badgeColor?: 'red' | 'green' | 'blue' | 'amber';
  rating: number;
  reviewCount: number;
  isFresh?: boolean;
  isYemeniLocal?: boolean;
  inStock: boolean;
  description: string;
  brand?: string;
  origin?: string; // e.g. "اليمن - مزارع الجوف", "اليمن - تعز", "مستورد"
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string; // Lucide icon name or emoji
  bgPastel: string; // Hex e.g. "#FFD5B6"
  itemCount: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit?: string;
}

export interface Address {
  id: string;
  title: string; // e.g. "المنزل", "العمل", "شقة حدة"
  city: string; // "صنعاء", "عدن", "تعز", "إب", "المكلا"
  area: string; // "الحدة", "الأصبحي", "خورمكسر", "كريتر", "شارع بغداد"
  street: string;
  building: string;
  details?: string;
  isDefault: boolean;
  coordinates?: { lat: number; lng: number; accuracy?: number };
  phone?: string;
  addressType?: 'منزل' | 'شقة' | 'مكتب' | 'أخرى';
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface DriverInfo {
  name: string;
  phone: string;
  photo: string;
  vehicle: string; // e.g. "دراجة نارية ترولي #104"
  rating: number;
  currentLocName: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "TRL-9842"
  createdAt: string; // ISO or readable string
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  promoCodeUsed?: string;
  tipAmount: number;
  totalAmount: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: 'cash' | 'hasib' | 'kuraimi' | 'flooss'; // الدفع عند الاستلام، حاسب، الكريمي جوال، فلوس
  deliverySlot: string; // e.g. "توصيل سريع (خلال 35 - 45 دقيقة)"
  orderNotes?: string;
  driverInfo?: DriverInfo;
  earnedPoints: number;
}

export type UserRole = 'customer' | 'admin' | 'delivery_driver';

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  avatar: string;
  loyaltyPoints: number; // نقاط ترولي
  role: UserRole;
  isActive: boolean;
  isBanned: boolean;
  isPhoneVerified: boolean;
  walletBalance?: number;
  defaultAddressId?: string;
  defaultAddressSummary?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  discountText: string;
  bgPastel: string;
  textColor: string;
  image: string;
  buttonText: string;
  categoryId?: string;
}

export type { LoyaltyPointHistory, LoyaltyReward, LoyaltyTier, LoyaltyProfile } from './features/loyalty/domain/entities/loyalty.entity';
export type { FavoriteItemEntity, FavoritesListEntity } from './features/favorites/domain/entities/favorite.entity';
export type { UserProfileEntity, UpdateProfileParams } from './features/profile/domain/entities/profile.entity';

export type MainTab = 'home' | 'categories' | 'offers' | 'favorites' | 'more';
