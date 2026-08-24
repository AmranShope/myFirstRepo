export interface PromoBannerEntity {
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
