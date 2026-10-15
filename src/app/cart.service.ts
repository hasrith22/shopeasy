import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'shopeasy_cart_v1';

  readonly cartItems = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);
  readonly toastMessage = signal<string | null>(null);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly shipping = computed(() => {
    const sub = this.subtotal();
    return sub > 0 && sub < 1000 ? 99 : 0;
  });

  readonly total = computed(() => this.subtotal() + this.shipping());

  constructor() {
    this.loadFromStorage();
  }

  addToCart(product: Product, quantity = 1): void {
    if (quantity <= 0) return;

    this.cartItems.update((items) => {
      const existingIndex = items.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...items, { product, quantity }];
    });

    this.saveToStorage();
    this.showToast(`Added "${product.name}" to cart`);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    this.saveToStorage();
  }

  removeFromCart(productId: number): void {
    const itemToRemove = this.cartItems().find((i) => i.product.id === productId);
    this.cartItems.update((items) => items.filter((i) => i.product.id !== productId));
    this.saveToStorage();

    if (itemToRemove) {
      this.showToast(`Removed "${itemToRemove.product.name}" from cart`);
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveToStorage();
    this.showToast('Cart cleared');
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  toggleCart(): void {
    this.isCartOpen.update((open) => !open);
  }

  showToast(message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastMessage.set(message);
    if (isPlatformBrowser(this.platformId)) {
      this.toastTimer = setTimeout(() => {
        this.toastMessage.set(null);
      }, 3000);
    }
  }

  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.cartItems.set(parsed);
        }
      }
    } catch {
      // Safe fallback if localStorage fails or is corrupted
      this.cartItems.set([]);
    }
  }

  private saveToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
    } catch {
      // Silently handle quota exceeded or private mode errors
    }
  }
}
