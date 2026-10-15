import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from './cart.service';
import { AuthService } from './auth.service';

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
  orderDate: string; // ISO string
  userEmail: string; // Associated customer account
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
  private readonly authService = inject(AuthService);
  private readonly STORAGE_KEY = 'shopeasy_customer_orders_v2';

  // All placed orders stored in client state
  readonly orders = signal<Order[]>([]);

  // Only the orders belonging to the currently logged in customer account
  readonly currentUserOrders = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.orders().filter(
      (o) => o.userEmail.toLowerCase() === user.email.toLowerCase()
    );
  });

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.orders.set(parsed);
          return;
        }
      }
      // No mock/fake orders - clean real orders only
      this.orders.set([]);
    } catch {
      this.orders.set([]);
    }
  }

  addOrder(order: Order): void {
    this.orders.update((prev) => [order, ...prev]);
    this.saveToStorage();
  }

  getOrdersForCurrentUser(): Order[] {
    return this.currentUserOrders();
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

  clearOrdersForCurrentUser(): void {
    const user = this.authService.currentUser();
    if (!user) return;
    this.orders.update((prev) =>
      prev.filter((o) => o.userEmail.toLowerCase() !== user.email.toLowerCase())
    );
    this.saveToStorage();
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
