export interface PromoCodeEntity {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 15 for 15%) or fixed YER amount
  description: string;
  minOrder?: number;
  maxDiscount?: number;
}
