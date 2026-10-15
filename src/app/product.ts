import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly products: Product[] = [
    {
      id: 1,
      name: 'Pro Ultra Laptop',
      price: 54999,
      category: 'Laptops',
      description: '15.6" FHD display, Intel Core i7, 16GB RAM, 512GB NVMe SSD with all-day battery life.',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
      badge: 'Best Seller',
      rating: 4.8,
      reviewsCount: 142,
    },
    {
      id: 2,
      name: 'Edge 5G Smartphone',
      price: 24999,
      category: 'Smartphones',
      description: '6.5" 120Hz AMOLED, 50MP triple camera, 5000mAh battery, and ultra-fast 5G connectivity.',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      badge: 'Popular',
      rating: 4.6,
      reviewsCount: 98,
    },
    {
      id: 3,
      name: 'Wireless Noise-Canceling Headphones',
      price: 4999,
      category: 'Audio',
      description: 'Active noise cancellation, plush memory foam earcups, 40hr playback, and crystal-clear audio.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      badge: 'Top Rated',
      rating: 4.9,
      reviewsCount: 215,
    },
    {
      id: 4,
      name: 'Pulse Smartwatch Series 3',
      price: 3499,
      category: 'Wearables',
      description: 'SpO2 & heart rate monitor, sleep tracking, 100+ fitness modes, and water resistance.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      badge: 'New',
      rating: 4.5,
      reviewsCount: 64,
    },
    {
      id: 5,
      name: 'ErgoGlide Wireless Mouse',
      price: 1299,
      category: 'Accessories',
      description: 'Precision optical tracking, ergonomic thumb rest, silent click switches, and dual Bluetooth/USB.',
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      rating: 4.4,
      reviewsCount: 47,
    },
    {
      id: 6,
      name: 'Mechanical Backlit Keyboard',
      price: 3999,
      category: 'Accessories',
      description: 'Tactile blue switches, per-key RGB illumination, aircraft-grade aluminum top plate.',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      badge: 'Gamer Choice',
      rating: 4.7,
      reviewsCount: 89,
    },
  ];

  getProducts(): Product[] {
    return [...this.products];
  }

  getFeaturedProducts(): Product[] {
    return this.products.slice(0, 3);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getCategories(): string[] {
    const categories = Array.from(new Set(this.products.map((p) => p.category)));
    return ['All', ...categories];
  }
}
