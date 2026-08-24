import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, UserProfile, Address, Order, OrderStatus, MainTab, PromoBanner } from '../types';
import { PRODUCTS, PROMO_CODES } from '../data/mockData';
import { 
  db, 
  auth, 
  testFirebaseConnection, 
  initAuthListener, 
  syncUserProfileInFirestore, 
  updateUserProfileInFirestore,
  fetchUserOrdersFromFirestore,
  fetchUserCartFromFirestore,
  saveUserCartToFirestore,
  clearUserCartInFirestore,
  setupRecaptchaVerifier,
  sendPhoneAuthOtp,
  confirmPhoneAuthOtp,
  signOutFirebaseUser,
  cleanForFirestore
} from '../lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs, onSnapshot, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { User as FirebaseUser, ConfirmationResult } from 'firebase/auth';
import { validateYemeniPhoneNumber, getFirebaseAuthErrorMessage } from '../utils/phoneValidation';

interface AppContextType {
  // Cart & Orders
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  appliedCode: string | null;
  cartTotal: number;
  orders: Order[];
  
  // Favorites & User
  favorites: string[];
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  userAddresses: Address[];
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
  activeAddress: Address | null;
  
  // Navigation & UI
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (catId: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Sliders & Dialogs
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedVariantProduct: Product | null;
  setSelectedVariantProduct: (product: Product | null) => void;
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  addressReturnScreen: string | null;
  setAddressReturnScreen: (screen: string | null) => void;
  tempSelectedAddressId: string | null;
  setTempSelectedAddressId: (id: string | null) => void;
  isLoyaltyModalOpen: boolean;
  setIsLoyaltyModalOpen: (open: boolean) => void;
  activeDialog: string | null;
  setActiveDialog: (dialog: string | null) => void;
  targetAddressIdForDelete: string | null;
  setTargetAddressIdForDelete: (id: string | null) => void;
  targetCartItemIdForDelete: string | null;
  setTargetCartItemIdForDelete: (id: string | null) => void;
  targetOrderIdForCancel: string | null;
  setTargetOrderIdForCancel: (id: string | null) => void;
  emptyStateType: string;
  setEmptyStateType: (type: string) => void;
  
  // Methods
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  applyPromo: (code: string) => { success: boolean; message: string };
  applyCoupon: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  removeCoupon: () => void;
  placeOrder: (
    address: Address,
    paymentMethod: 'cash' | 'hasib' | 'kuraimi' | 'flooss',
    notes?: string,
    slot?: string
  ) => Order;
  cancelOrder: (orderId: string) => void;
  addAddress: (addr: Omit<Address, 'id'>) => Address;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (addrId: string) => void;
  redeemPoints: (points: number, voucherRiyal: number) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; message?: string }>;
  verifyPhoneOtp: (otpCode: string) => Promise<{ success: boolean; message?: string }>;
  loginUser: (phone: string, optionalName?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  showToast: (message: string) => void;
  toastMessage: string | null;
  fbUser: FirebaseUser | null;
  pendingPhone: string;
  setPendingPhone: (phone: string) => void;
  reloadUserCart: (userId?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage key helper for cart per user
function getCartStorageKey(userId?: string | null): string {
  if (!userId || userId === 'guest') {
    return 'troolly_cart_guest';
  }
  return `troolly_cart_${userId}`;
}

// Storage key helper for addresses per user
function getAddressStorageKey(userId?: string | null): string {
  if (!userId || userId === 'guest') {
    return 'troolly_user_addresses_guest';
  }
  return `troolly_user_addresses_${userId}`;
}

function loadLocalAddresses(userId?: string | null): Address[] {
  try {
    const key = getAddressStorageKey(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function loadLocalCart(userId?: string | null): CartItem[] {
  try {
    const key = getCartStorageKey(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
    // Check old fallback for guest only
    if (!userId || userId === 'guest') {
      const legacy = localStorage.getItem('troolly_cart');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('troolly_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Initial state loaded from localStorage for current user
  const [cart, setCart] = useState<CartItem[]>(() => {
    return loadLocalCart(user?.id);
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('troolly_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('troolly_is_guest');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [userAddresses, setUserAddresses] = useState<Address[]>(() => {
    return loadLocalAddresses(user?.id);
  });

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Dialogs state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantProduct, setSelectedVariantProduct] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addressReturnScreen, setAddressReturnScreen] = useState<string | null>(null);
  const [tempSelectedAddressId, setTempSelectedAddressId] = useState<string | null>(null);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [targetAddressIdForDelete, setTargetAddressIdForDelete] = useState<string | null>(null);
  const [targetCartItemIdForDelete, setTargetCartItemIdForDelete] = useState<string | null>(null);
  const [targetOrderIdForCancel, setTargetOrderIdForCancel] = useState<string | null>(null);
  const [emptyStateType, setEmptyStateType] = useState<string>('no_data');

  // Refs to control cart sync lifecycle and prevent accidental wipe on logout/auth switch
  const isCartInitialLoadDoneRef = useRef<{ [uid: string]: boolean }>({});
  const isLoggingOutRef = useRef<boolean>(false);

  // Helper to load and set user's isolated cart safely
  const loadAndSetUserCart = async (uid: string) => {
    if (!uid || uid === 'guest') {
      const guestCart = loadLocalCart('guest');
      setCart(guestCart);
      return;
    }

    try {
      // 1. Try fetching real remote cart from Firestore
      const userCart = await fetchUserCartFromFirestore(uid);
      if (userCart && userCart.length > 0) {
        setCart(userCart);
        localStorage.setItem(getCartStorageKey(uid), JSON.stringify(userCart));
      } else {
        // 2. Fallback to cached local cart for this user
        const cachedCart = loadLocalCart(uid);
        setCart(cachedCart);
        if (cachedCart.length > 0) {
          saveUserCartToFirestore(uid, cachedCart);
        }
      }
    } catch (e) {
      const cachedCart = loadLocalCart(uid);
      setCart(cachedCart);
    } finally {
      // Mark as initialized so future cart edits (add/remove/qty) will persist
      isCartInitialLoadDoneRef.current[uid] = true;
    }
  };

  // Promo & Auth state
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string>(() => {
    return localStorage.getItem('troolly_pending_phone') || '777777777';
  });

  // Initialize Firebase Auth & Firestore sync
  useEffect(() => {
    testFirebaseConnection();

    const unsubscribe = initAuthListener(async (currentFbUser) => {
      setFbUser(currentFbUser);

      if (currentFbUser) {
        try {
          const synced = await syncUserProfileInFirestore(currentFbUser.uid, {
            phone: currentFbUser.phoneNumber || undefined
          });

          // Check if account is banned or inactive
          if (synced.isBanned) {
            showToast('عذراً، هذا الحساب محظور حالياً. يرجى التواصل مع خدمة العملاء.');
            await signOutFirebaseUser();
            setUser(null);
            localStorage.removeItem('troolly_user_session');
            return;
          }

          setUser(synced);
          localStorage.setItem('troolly_user_session', JSON.stringify(synced));

          // Load user orders from Firestore
          const userOrders = await fetchUserOrdersFromFirestore(currentFbUser.uid);
          setOrders(userOrders);

          // Load user's isolated cart safely from Firestore
          await loadAndSetUserCart(currentFbUser.uid);
        } catch (err) {
          console.warn('Session sync note:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync state to localStorage with user isolation
  useEffect(() => {
    if (isLoggingOutRef.current) return;
    try {
      const activeUid = user?.id || fbUser?.uid;
      const key = getAddressStorageKey(activeUid);
      localStorage.setItem(key, JSON.stringify(userAddresses));
    } catch (e) { console.error(e); }
  }, [userAddresses, user?.id, fbUser?.uid]);

  // Real-time Firestore addresses listener
  useEffect(() => {
    const targetUid = user?.id || fbUser?.uid;
    if (!targetUid || targetUid === 'guest' || isGuest) {
      setUserAddresses(loadLocalAddresses('guest'));
      return;
    }

    try {
      const addressesRef = collection(db, 'users', targetUid, 'addresses');
      const q = query(addressesRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedList: Address[] = [];
        snapshot.forEach((d) => {
          const raw = d.data();
          loadedList.push({
            id: d.id,
            title: raw.title || 'عنواني',
            city: raw.city || 'صنعاء',
            area: raw.area || 'حدة',
            street: raw.street || '',
            building: raw.building || '',
            details: raw.details || '',
            isDefault: !!raw.isDefault,
            coordinates: raw.coordinates || undefined,
            phone: raw.phone || '',
            addressType: raw.addressType || 'منزل',
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
          });
        });

        if (loadedList.length > 0) {
          // Sort so the default address is at index 0
          const sorted = [...loadedList].sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            return 0;
          });
          setUserAddresses(sorted);
        } else {
          // If Firestore subcollection is empty for this new user, clean state
          setUserAddresses([]);
        }
      }, (err) => {
        console.warn('Addresses subcollection listener note:', err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Addresses subcollection init note:', err);
    }
  }, [user?.id, fbUser?.uid, isGuest]);

  // Persist cart to user-scoped local storage and remote Firestore
  useEffect(() => {
    // Prevent saving during logout transitions
    if (isLoggingOutRef.current) {
      return;
    }

    try {
      const activeUid = user?.id || fbUser?.uid;
      
      // Guest handling
      if (!activeUid || activeUid === 'guest' || isGuest) {
        localStorage.setItem('troolly_cart_guest', JSON.stringify(cart));
        return;
      }

      // If user cart has not finished initial loading, do not overwrite remote Firestore!
      if (!isCartInitialLoadDoneRef.current[activeUid]) {
        return;
      }

      const key = getCartStorageKey(activeUid);
      localStorage.setItem(key, JSON.stringify(cart));

      // Persist cart to Firestore for authenticated user in the background
      saveUserCartToFirestore(activeUid, cart);
    } catch (e) { console.error(e); }
  }, [cart, user?.id, fbUser?.uid, isGuest]);

  useEffect(() => {
    try {
      localStorage.setItem('troolly_favs', JSON.stringify(favorites));
    } catch (e) { console.error(e); }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('troolly_is_guest', isGuest ? 'true' : 'false');
    } catch (e) { console.error(e); }
  }, [isGuest]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('troolly_user_session', JSON.stringify(user));
        // Automatically load and synchronize the user's saved cart whenever active user changes
        if (user.id && user.id !== 'guest') {
          loadAndSetUserCart(user.id);
        }
      } else {
        localStorage.removeItem('troolly_user_session');
      }
    } catch (e) { console.error(e); }
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3000);
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Delivery Fee is 1000 YER, free if subtotal > 20,000 YER
  const deliveryFee = cartSubtotal >= 20000 || cartSubtotal === 0 ? 0 : 1000;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCode && PROMO_CODES[appliedCode] && cartSubtotal >= PROMO_CODES[appliedCode].minSpend) {
    const promo = PROMO_CODES[appliedCode];
    if (promo.discountPercent) {
      discountAmount = Math.round((cartSubtotal * promo.discountPercent) / 100);
    } else if (promo.discountFixed) {
      discountAmount = promo.discountFixed;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Active address
  const activeAddress = userAddresses.find(a => a.isDefault) || userAddresses[0] || null;

  // Handlers
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`تمت إضافة "${product.name}" إلى السلة 🛒`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('تم حذف المنتج من السلة');
  };

  const clearCart = () => {
    setCart([]);
    const activeUid = user?.id || fbUser?.uid;
    const key = getCartStorageKey(activeUid);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    if (activeUid && activeUid !== 'guest') {
      clearUserCartInFirestore(activeUid).catch(() => {});
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'تمت الإزالة من المفضلة ❤️' : 'تمت الإضافة للمفضلة ❤️');
      return next;
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const applyPromo = (code: string) => {
    const upper = code.trim().toUpperCase();
    const promo = PROMO_CODES[upper];
    if (!promo) {
      return { success: false, message: 'كوبون الخصم غير صحيح أو منتهي الصلاحية' };
    }
    if (cartSubtotal < promo.minSpend) {
      return {
        success: false,
        message: `حد الشراء الأدنى لاستخدام الكوبون هو ${promo.minSpend.toLocaleString('ar-YE')} ر.ي`
      };
    }
    setAppliedCode(upper);
    return { success: true, message: `تم تطبيق الكوبون! ${promo.description}` };
  };

  const removePromo = () => {
    setAppliedCode(null);
    showToast('تمت إزالة كوبون الخصم');
  };

  const placeOrder = (
    address: Address,
    paymentMethod: 'cash' | 'hasib' | 'kuraimi' | 'flooss',
    notes = '',
    slot = 'توصيل سريع (خلال 35 - 45 دقيقة)'
  ): Order => {
    const orderNum = `TRL-${Math.floor(1000 + Math.random() * 9000)}`;
    const points = Math.round(cartTotal / 100); // 1 point per 100 YER

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discountAmount,
      promoCodeUsed: appliedCode || undefined,
      tipAmount: 0,
      totalAmount: cartTotal,
      status: 'received',
      address,
      paymentMethod,
      deliverySlot: slot,
      orderNotes: notes,
      earnedPoints: points,
      driverInfo: {
        name: 'مندوب ترولي للتوصيل السريع',
        phone: '777 000 111',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        vehicle: 'دراجة نارية ترولي #110',
        rating: 5.0,
        currentLocName: 'مركز التجميع والتوزيع'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    
    if (user) {
      const updatedPoints = user.loyaltyPoints + points;
      setUser(prev => prev ? ({
        ...prev,
        loyaltyPoints: updatedPoints
      }) : null);

      // Save order and updated points in Firestore
      const targetUid = user.id || fbUser?.uid || 'usr_default';
      const orderDocRef = doc(db, 'users', targetUid, 'orders', newOrder.id);
      setDoc(orderDocRef, cleanForFirestore({
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        userId: targetUid,
        status: newOrder.status,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        deliveryFee: newOrder.deliveryFee,
        discountAmount: newOrder.discountAmount,
        totalAmount: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        deliverySlot: newOrder.deliverySlot,
        address: {
          id: address.id,
          title: address.title,
          city: address.city,
          area: address.area,
          street: address.street || '',
          building: address.building || '',
          details: address.details || '',
          isDefault: Boolean(address.isDefault),
          phone: address.phone || '',
          addressType: address.addressType || 'منزل',
          coordinates: address.coordinates ? {
            lat: address.coordinates.lat,
            lng: address.coordinates.lng
          } : null
        },
        orderNotes: newOrder.orderNotes,
        earnedPoints: newOrder.earnedPoints,
        driverInfo: newOrder.driverInfo,
        createdAt: newOrder.createdAt
      })).catch(err => console.warn('Order save in firestore note:', err));

      // Update loyaltyPoints on user document in Firestore
      const userDocRef = doc(db, 'users', targetUid);
      updateDoc(userDocRef, {
        loyaltyPoints: updatedPoints,
        updatedAt: new Date().toISOString()
      }).catch(() => {});

      // Record loyalty history transaction entry
      if (points > 0) {
        const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const historyDocRef = doc(db, 'users', targetUid, 'loyalty_history', txId);
        setDoc(historyDocRef, {
          id: txId,
          userId: targetUid,
          points: points,
          type: 'earned',
          title: `نقاط مكتسبة من طلب #${orderNum}`,
          description: `تم إضافة ${points} نقطة بنجاح مع إتمام الطلب`,
          relatedOrderId: newOrder.id,
          createdAt: new Date().toISOString()
        }).catch(e => console.warn('Loyalty transaction log error:', e));
      }
    }
    
    clearCart();
    setAppliedCode(null);
    setIsCheckoutOpen(false);
    setIsCartDrawerOpen(false);
    setTrackingOrder(newOrder);

    showToast(`تم إرسال طلبك بنجاح! رقم الطلب ${orderNum} 🎉`);
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    if (trackingOrder?.id === orderId) {
      setTrackingOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
    const targetUid = user?.id || fbUser?.uid;
    if (targetUid) {
      const orderDocRef = doc(db, 'users', targetUid, 'orders', orderId);
      updateDoc(orderDocRef, { status: 'cancelled' }).catch(() => {});
    }
    showToast('تم إلغاء الطلب بنجاح');
  };

  const addAddress = (addrData: Omit<Address, 'id'>): Address => {
    const addressId = `addr_${Date.now()}`;
    const newAddr: Address = {
      ...addrData,
      id: addressId,
      createdAt: new Date().toISOString()
    };

    const isFirstAddress = userAddresses.length === 0;
    // Only the very first address becomes default automatically, unless explicitly requested
    const shouldBeDefault = isFirstAddress || (addrData.isDefault === true);

    const finalAddrWithDefault: Address = {
      ...newAddr,
      isDefault: shouldBeDefault
    };

    if (!user) {
      setUserAddresses(prev => {
        if (shouldBeDefault) {
          return [finalAddrWithDefault, ...prev.map(a => ({ ...a, isDefault: false }))];
        }
        return [...prev, finalAddrWithDefault];
      });
      showToast('تمت إضافة العنوان الجديد بنجاح 📍');
      return finalAddrWithDefault;
    }

    setUserAddresses(prev => {
      if (shouldBeDefault) {
        return [finalAddrWithDefault, ...prev.map(a => ({ ...a, isDefault: false }))];
      }
      return [...prev, finalAddrWithDefault];
    });

    const targetUid = user.id || fbUser?.uid;
    if (targetUid) {
      const addressDocRef = doc(db, 'users', targetUid, 'addresses', addressId);
      setDoc(addressDocRef, {
        title: finalAddrWithDefault.title,
        city: finalAddrWithDefault.city,
        area: finalAddrWithDefault.area,
        street: finalAddrWithDefault.street || '',
        building: finalAddrWithDefault.building || '',
        details: finalAddrWithDefault.details || '',
        isDefault: shouldBeDefault,
        coordinates: finalAddrWithDefault.coordinates || null,
        phone: finalAddrWithDefault.phone || user.phone || '',
        addressType: finalAddrWithDefault.addressType || 'منزل',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});

      if (shouldBeDefault) {
        const userDocRef = doc(db, 'users', targetUid);
        updateDoc(userDocRef, {
          defaultAddressId: addressId,
          defaultAddressSummary: `${finalAddrWithDefault.city} - ${finalAddrWithDefault.area} - ${finalAddrWithDefault.street}`,
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
    }

    showToast('تمت إضافة العنوان الجديد بنجاح 📍');
    return finalAddrWithDefault;
  };

  const setDefaultAddress = (addrId: string) => {
    // 1. Move target address to top of the list and set isDefault: true
    setUserAddresses(prev => {
      const target = prev.find(a => a.id === addrId);
      if (!target) return prev;
      const rest = prev.filter(a => a.id !== addrId).map(a => ({ ...a, isDefault: false }));
      return [{ ...target, isDefault: true }, ...rest];
    });

    const selectedAddr = userAddresses.find(a => a.id === addrId);
    const targetUid = user?.id || fbUser?.uid;
    if (targetUid) {
      // 1. Update subcollection document in Firestore
      try {
        const addressesRef = collection(db, 'users', targetUid, 'addresses');
        userAddresses.forEach(a => {
          const docRef = doc(addressesRef, a.id);
          updateDoc(docRef, {
            isDefault: a.id === addrId,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        });
      } catch (e) {
        console.warn('Firestore set default note:', e);
      }

      // 2. Set default pointer on user doc
      if (selectedAddr) {
        const userDocRef = doc(db, 'users', targetUid);
        updateDoc(userDocRef, {
          defaultAddressId: addrId,
          defaultAddressSummary: `${selectedAddr.city} - ${selectedAddr.area} - ${selectedAddr.street}`,
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
    }
    showToast('تم تعيين العنوان الافتراضي ورفعه لأول القائمة 📍');
  };

  const redeemPoints = (points: number, voucherRiyal: number) => {
    if (!user) {
      showToast('يرجى تسجيل الدخول لاستبدال النقاط');
      return;
    }
    if (user.loyaltyPoints < points) {
      showToast('عذراً، لا تملك رصيد نقاط كافٍ');
      return;
    }
    const updatedPoints = user.loyaltyPoints - points;
    const updatedUser = { ...user, loyaltyPoints: updatedPoints };
    setUser(updatedUser);
    localStorage.setItem('troolly_user_session', JSON.stringify(updatedUser));

    const targetUid = user.id || fbUser?.uid;
    if (targetUid) {
      const userDocRef = doc(db, 'users', targetUid);
      updateDoc(userDocRef, {
        loyaltyPoints: updatedPoints,
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    }

    showToast(`تم استبدال ${points} نقطة بقسيمة خصم بقيمة ${voucherRiyal.toLocaleString('ar-YE')} ر.ي!`);
  };

  const deleteAddress = (id: string) => {
    setUserAddresses(prev => prev.filter(a => a.id !== id));

    const targetUid = user?.id || fbUser?.uid;
    if (targetUid) {
      const addressDocRef = doc(db, 'users', targetUid, 'addresses', id);
      deleteDoc(addressDocRef).catch(() => {});
    }
    showToast('تم حذف العنوان بنجاح');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...data
    };
    setUser(updatedUser);
    localStorage.setItem('troolly_user_session', JSON.stringify(updatedUser));

    const targetUid = user.id || fbUser?.uid || 'usr_default';
    try {
      await updateUserProfileInFirestore(targetUid, data);
      showToast('تم تحديث الملف الشخصي ومزامنته مع السحابة ☁️');
    } catch (e) {
      showToast('تم حفظ التعديلات');
    }
  };

  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; message?: string }> => {
    // 1. Strict Yemeni phone number validation prior to contacting Firebase
    const validation = validateYemeniPhoneNumber(phone);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errorMessage || 'رقم الهاتف غير صحيح'
      };
    }

    const formattedPhone = validation.formattedInternational!;

    try {
      setPendingPhone(formattedPhone);
      localStorage.setItem('troolly_pending_phone', formattedPhone);

      // 2. Initialize reCAPTCHA and call Firebase Phone Auth
      const verifier = setupRecaptchaVerifier('recaptcha-container');
      const confirmation = await sendPhoneAuthOtp(formattedPhone, verifier);
      
      // Store confirmation result in state
      setConfirmationResult(confirmation);
      
      showToast(`تم إرسال رمز التحقق بنجاح إلى ${formattedPhone} 📱`);
      return { success: true };
    } catch (error: any) {
      console.warn('Firebase Phone Auth send error:', error);
      const errorMsg = getFirebaseAuthErrorMessage(error);
      setConfirmationResult(null);
      return { success: false, message: errorMsg };
    }
  };

  const verifyPhoneOtp = async (otpCode: string): Promise<{ success: boolean; message?: string }> => {
    // Strict requirement: confirmationResult from real Firebase Phone Auth MUST exist
    if (!confirmationResult) {
      return {
        success: false,
        message: 'لا توجد جلسة تحقق نشطة. يرجى العودة لشاشة تسجيل الدخول وطلب كود جديد.'
      };
    }

    if (!otpCode || otpCode.trim().length < 6) {
      return {
        success: false,
        message: 'يرجى إدخال كود التحقق المكون من 6 أرقام كاملاً.'
      };
    }
    
    try {
      // 1. Confirm code with Firebase Auth
      const userCred = await confirmPhoneAuthOtp(confirmationResult, otpCode.trim());
      const firebaseUser = userCred.user;
      const activeUid = firebaseUser.uid;
      const verifiedPhone = firebaseUser.phoneNumber || pendingPhone;

      // 2. Sync profile in Firestore
      const realProfile = await syncUserProfileInFirestore(activeUid, {
        phone: verifiedPhone,
        isPhoneVerified: true
      });

      // 3. Security check: Banned or inactive accounts
      if (realProfile.isBanned) {
        await signOutFirebaseUser();
        setUser(null);
        localStorage.removeItem('troolly_user_session');
        return { 
          success: false, 
          message: 'عذراً، هذا الحساب محظور من قِبل إدارة المتجر.' 
        };
      }

      setIsGuest(false);
      setUser(realProfile);
      localStorage.setItem('troolly_user_session', JSON.stringify(realProfile));

      // 4. Fetch user's real orders from Firestore
      const userOrders = await fetchUserOrdersFromFirestore(activeUid);
      setOrders(userOrders);

      // 5. Fetch and restore user's isolated cart safely
      await loadAndSetUserCart(activeUid);

      // 6. Navigate to main shop
      setCurrentScreen('main');
      showToast('تم التحقق من الحساب وتسجيل الدخول بنجاح! 🛒🌟');
      return { success: true };
    } catch (error: any) {
      console.warn('Firebase OTP verify error:', error);
      const errorMsg = getFirebaseAuthErrorMessage(error);
      return { success: false, message: errorMsg };
    }
  };

  const loginUser = async (phone: string, optionalName?: string) => {
    setIsGuest(false);
    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = phone.startsWith('+967') ? phone : `+967 ${cleanDigits || phone}`;
    
    // Deterministic UID based on phone so each phone has its own real Firestore document
    const userUid = fbUser?.uid || `user_${cleanDigits || 'guest'}`;

    try {
      const initialData: Partial<UserProfile> = {
        phone: formattedPhone,
        ...(optionalName ? { name: optionalName } : {})
      };

      const realProfile = await syncUserProfileInFirestore(userUid, initialData);
      
      if (realProfile.isBanned) {
        showToast('عذراً، هذا الحساب محظور حالياً.');
        return;
      }

      setUser(realProfile);
      localStorage.setItem('troolly_user_session', JSON.stringify(realProfile));

      // Fetch user's real orders from Firestore
      const userOrders = await fetchUserOrdersFromFirestore(userUid);
      setOrders(userOrders);

      // Fetch and restore user's isolated cart safely
      await loadAndSetUserCart(userUid);

    } catch (e) {
      console.warn('Login sync note:', e);
      const fallbackProfile: UserProfile = {
        id: userUid,
        name: optionalName || '',
        phone: formattedPhone,
        email: '',
        city: 'صنعاء',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        loyaltyPoints: 50,
        role: 'customer',
        isActive: true,
        isBanned: false,
        isPhoneVerified: true,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(fallbackProfile);
      localStorage.setItem('troolly_user_session', JSON.stringify(fallbackProfile));
      await loadAndSetUserCart(userUid);
    }

    setCurrentScreen('main');
    showToast('تم تسجيل الدخول بنجاح! أهلاً بك في ترولي 🛒');
  };

  const logoutUser = async () => {
    // 1. Mark logging out to freeze any auto-sync from overwriting saved cart in cloud or local storage
    isLoggingOutRef.current = true;

    try {
      await signOutFirebaseUser();
    } catch {
      // ignore
    }

    // 2. Reset in-memory session
    setUser(null);
    setFbUser(null);
    setIsGuest(true);
    setOrders([]);
    setUserAddresses(loadLocalAddresses('guest'));
    
    // 3. Switch active in-memory cart to clean guest cart WITHOUT touching user's stored cart
    const guestCart = loadLocalCart('guest');
    setCart(guestCart);
    setConfirmationResult(null);
    localStorage.removeItem('troolly_user_session');
    localStorage.setItem('troolly_is_guest', 'true');
    setCurrentScreen('login');
    setActiveDialog(null);
    showToast('تم تسجيل الخروج بنجاح');

    // 4. Release lock after state flush
    setTimeout(() => {
      isLoggingOutRef.current = false;
    }, 150);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        appliedCode,
        cartTotal,
        orders,
        favorites,
        user,
        setUser,
        userAddresses,
        isGuest,
        setIsGuest,
        activeAddress,
        activeTab,
        setActiveTab,
        currentScreen,
        setCurrentScreen,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        selectedVariantProduct,
        setSelectedVariantProduct,
        trackingOrder,
        setTrackingOrder,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addressReturnScreen,
        setAddressReturnScreen,
        tempSelectedAddressId,
        setTempSelectedAddressId,
        isLoyaltyModalOpen,
        setIsLoyaltyModalOpen,
        activeDialog,
        setActiveDialog,
        targetAddressIdForDelete,
        setTargetAddressIdForDelete,
        targetCartItemIdForDelete,
        setTargetCartItemIdForDelete,
        targetOrderIdForCancel,
        setTargetOrderIdForCancel,
        emptyStateType,
        setEmptyStateType,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        applyPromo,
        applyCoupon: applyPromo,
        removePromo,
        removeCoupon: removePromo,
        placeOrder,
        cancelOrder,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        redeemPoints,
        updateUserProfile,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginUser,
        logoutUser,
        showToast,
        toastMessage,
        fbUser,
        pendingPhone,
        setPendingPhone,
        reloadUserCart: loadAndSetUserCart
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

