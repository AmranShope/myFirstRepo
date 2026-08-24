import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where,
  setDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../../../shared/data/firebase';
import { ProductEntity, BundleOfferEntity } from '../../domain/entities/product.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { PromoBannerEntity } from '../../domain/entities/banner.entity';
import { CatalogFilterOptions } from '../../domain/repositories/catalog.repository';
import { ProductModel } from '../models/product.model';
import { CategoryModel } from '../models/category.model';
import { CatalogLocalDataSource, BUNDLE_OFFERS } from './catalog-local.datasource';
import { PRODUCTS, CATEGORIES, BANNERS } from '../../../../data/mockData';

export class CatalogRemoteDataSource {
  private localFallback = new CatalogLocalDataSource();

  async fetchProducts(options?: CatalogFilterOptions): Promise<ProductEntity[]> {
    try {
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);

      if (!snapshot.empty) {
        let products = snapshot.docs.map(docSnap => 
          ProductModel.fromFirestore(docSnap.id, docSnap.data())
        );

        if (options) {
          if (options.onlyOffers) {
            products = products.filter(p => p.originalPrice && p.originalPrice > p.price);
          }
          if (options.categoryId) {
            products = products.filter(p => p.categoryId === options.categoryId);
          }
          if (options.subcategory) {
            products = products.filter(p => p.subcategory === options.subcategory);
          }
          if (options.searchQuery && options.searchQuery.trim()) {
            const q = options.searchQuery.toLowerCase().trim();
            products = products.filter(p => {
              const nameMatch = p.name.toLowerCase().includes(q);
              const brandMatch = p.brand?.toLowerCase().includes(q) || false;
              const descMatch = p.description.toLowerCase().includes(q);
              const tagMatch = p.tags?.some(t => t.toLowerCase().includes(q)) || false;
              return nameMatch || brandMatch || descMatch || tagMatch;
            });
          }
        }

        return products;
      }
    } catch (error) {
      console.warn('Firestore fetchProducts fallback to local:', error);
    }

    return await this.localFallback.fetchProducts(options);
  }

  async fetchProductById(id: string): Promise<ProductEntity | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return ProductModel.fromFirestore(docSnap.id, docSnap.data());
      }
    } catch (error) {
      console.warn('Firestore fetchProductById fallback to local:', error);
    }

    return await this.localFallback.fetchProductById(id);
  }

  async fetchCategories(): Promise<CategoryEntity[]> {
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);

      if (!snapshot.empty) {
        return snapshot.docs.map(docSnap => 
          CategoryModel.fromFirestore(docSnap.id, docSnap.data())
        );
      }
    } catch (error) {
      console.warn('Firestore fetchCategories fallback to local:', error);
    }

    return await this.localFallback.fetchCategories();
  }

  async fetchCategoryById(id: string): Promise<CategoryEntity | null> {
    try {
      const docRef = doc(db, 'categories', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return CategoryModel.fromFirestore(docSnap.id, docSnap.data());
      }
    } catch (error) {
      console.warn('Firestore fetchCategoryById fallback to local:', error);
    }

    return await this.localFallback.fetchCategoryById(id);
  }

  async fetchPromoBanners(): Promise<PromoBannerEntity[]> {
    try {
      const bannersRef = collection(db, 'banners');
      const snapshot = await getDocs(bannersRef);

      if (!snapshot.empty) {
        return snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as PromoBannerEntity[];
      }
    } catch (error) {
      console.warn('Firestore fetchPromoBanners fallback to local:', error);
    }

    return await this.localFallback.fetchPromoBanners();
  }

  async fetchBundleOffers(): Promise<BundleOfferEntity[]> {
    try {
      const bundlesRef = collection(db, 'bundle_offers');
      const snapshot = await getDocs(bundlesRef);

      if (!snapshot.empty) {
        return snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as BundleOfferEntity[];
      }
    } catch (error) {
      console.warn('Firestore fetchBundleOffers fallback to local:', error);
    }

    return await this.localFallback.fetchBundleOffers();
  }

  /**
   * Utility to seed the initial catalog to Firestore database
   */
  async seedCatalogToFirestore(): Promise<{ seededCategories: number; seededProducts: number; seededBanners: number }> {
    try {
      const batch = writeBatch(db);

      // Seed categories
      for (const cat of CATEGORIES) {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, CategoryModel.toFirestore(cat), { merge: true });
      }

      // Seed products
      for (const prod of PRODUCTS) {
        const prodRef = doc(db, 'products', prod.id);
        batch.set(prodRef, ProductModel.toFirestore(prod), { merge: true });
      }

      // Seed banners
      for (const banner of BANNERS) {
        const bannerRef = doc(db, 'banners', banner.id);
        batch.set(bannerRef, banner, { merge: true });
      }

      // Seed bundle offers
      for (const bundle of BUNDLE_OFFERS) {
        const bundleRef = doc(db, 'bundle_offers', bundle.id);
        batch.set(bundleRef, bundle, { merge: true });
      }

      await batch.commit();
      return {
        seededCategories: CATEGORIES.length,
        seededProducts: PRODUCTS.length,
        seededBanners: BANNERS.length
      };
    } catch (error) {
      console.error('Error seeding catalog to Firestore:', error);
      throw error;
    }
  }
}
