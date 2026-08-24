export interface ProductEntity {
  id: string;
  name: string;
  nameEn?: string;
  price: number; // in Yemeni Riyal (ر.ي)
  originalPrice?: number;
  unit: string;
  availableUnits?: string[];
  image: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  badge?: string;
  badgeColor?: 'red' | 'green' | 'blue' | 'amber';
  rating: number;
  reviewCount: number;
  isFresh?: boolean;
  isYemeniLocal?: boolean;
  inStock: boolean;
  description: string;
  brand?: string;
  origin?: string;
  tags?: string[];
}

export interface BundleOfferEntity {
  id: string;
  title: string;
  desc: string;
  originalPrice: number;
  price: number;
  saving: number;
  image: string;
  productIds: string[];
}
