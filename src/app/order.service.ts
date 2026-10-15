import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from './cart.service';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  orderId: string;
  orderDate: string; // ISO string for safe JSON serialization
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'shopeasy_orders_v1';

  readonly orders = signal<Order[]>([]);

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.orders.set(parsed);
          return;
        }
      }
      // Seed with an initial sample order so the user sees a complete history right away
      const initialSampleOrder: Order = {
        orderId: 'SE-892401',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            product: {
              id: 3,
              name: 'Wireless Noise-Canceling Headphones',
              price: 4999,
              category: 'Audio',
              description: 'Active noise cancellation, plush earcups, 40hr playback.',
              imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
            },
            quantity: 1,
          },
        ],
        subtotal: 4999,
        shipping: 0,
        total: 4999,
        shippingAddress: {
          fullName: 'Demo Shopper',
          phone: '9876543210',
          street: 'Flat 402, Skyline Residency, MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
        paymentMethod: 'UPI / QR Payment',
        status: 'Shipped',
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      };

      this.orders.set([initialSampleOrder]);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([initialSampleOrder]));
    } catch {
      // Safe fallback
    }
  }

  addOrder(order: Order): void {
    this.orders.update((prev) => [order, ...prev]);
    this.saveToStorage();
  }

  getOrders(): Order[] {
    return this.orders();
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find((o) => o.orderId === id);
  }

  clearOrders(): void {
    this.orders.set([]);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch {
        // Safe fallback
      }
    }
  }

  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders()));
    } catch {
      // Safe fallback
    }
  }
}
