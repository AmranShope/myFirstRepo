import { LoyaltyPointHistory, LoyaltyReward, LoyaltyTier } from '../../domain/entities/loyalty.entity';

export const DEFAULT_LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'bronze',
    title: 'المستوى البرونزي',
    minPoints: 0,
    multiplier: 1.0,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    perks: ['نقطة مقابل كل 100 ر.ي', 'عروض أسبوعية خاصة', 'استبدال النقاط بقسائم']
  },
  {
    name: 'silver',
    title: 'المستوى الفضي',
    minPoints: 300,
    multiplier: 1.2,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    perks: ['1.2x مضاعفة النقاط مع كل طلب', 'أولوية في تجهيز الطلبات', 'خصومات حصرية للأعضاء']
  },
  {
    name: 'gold',
    title: 'المستوى الذهبي 👑',
    minPoints: 800,
    multiplier: 1.5,
    badgeColor: 'bg-amber-400/20 text-amber-900 border-amber-400',
    perks: ['1.5x مضاعفة النقاط', 'توصيل مجاني لطلبات فوق 3,000 ر.ي', 'هدايا وعينات منتجات مجانية']
  }
];

export const AVAILABLE_LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'reward_1000',
    title: 'قسيمة خصم 1,000 ر.ي',
    description: 'خصم مباشر فوري على أي سلة مشتريات',
    requiredPoints: 100,
    discountRiyal: 1000,
    badge: 'الأكثر طلباً',
    icon: 'Ticket',
    isPopular: true
  },
  {
    id: 'reward_2500',
    title: 'قسيمة خصم 2,500 ر.ي',
    description: 'خصم مميز يشمل الخضار والفواكه واللحوم الطازجة',
    requiredPoints: 250,
    discountRiyal: 2500,
    badge: 'قيمة مضافة',
    icon: 'Gift',
    isPopular: false
  },
  {
    id: 'reward_5500',
    title: 'قسيمة خصم ذهبية 5,500 ر.ي 🔥',
    description: 'خصم ذهبي شامل لجميع أقسام المتجر',
    requiredPoints: 500,
    discountRiyal: 5500,
    badge: 'خصم مميز',
    icon: 'Award',
    isPopular: true
  },
  {
    id: 'reward_free_delivery',
    title: 'توصيل مجاني لطلبك القادم 🛵',
    description: 'إعفاء كامل من رسوم التوصيل أينما كنت',
    requiredPoints: 50,
    discountRiyal: 500,
    badge: 'توفير سريع',
    icon: 'Truck',
    isPopular: false
  }
];
