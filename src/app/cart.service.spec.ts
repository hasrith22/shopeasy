import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from './product';

describe('CartService', () => {
  let service: CartService;

  const mockProduct: Product = {
    id: 1,
    name: 'Pro Ultra Laptop',
    price: 54999,
    category: 'Laptops',
    description: 'High performance laptop',
    imageUrl: 'https://example.com/laptop.jpg',
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Edge 5G Smartphone',
    price: 24999,
    category: 'Smartphones',
    description: 'Crisp display smartphone',
    imageUrl: 'https://example.com/phone.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.totalItems()).toBe(0);
    expect(service.subtotal()).toBe(0);
  });

  it('should add a product to cart and update total count', () => {
    service.addToCart(mockProduct, 1);
    expect(service.totalItems()).toBe(1);
    expect(service.cartItems().length).toBe(1);
    expect(service.subtotal()).toBe(54999);
  });

  it('should increase quantity when adding same product multiple times', () => {
    service.addToCart(mockProduct, 1);
    service.addToCart(mockProduct, 2);
    expect(service.totalItems()).toBe(3);
    expect(service.cartItems().length).toBe(1);
    expect(service.subtotal()).toBe(54999 * 3);
  });

  it('should update quantity correctly', () => {
    service.addToCart(mockProduct, 1);
    service.updateQuantity(mockProduct.id, 4);
    expect(service.totalItems()).toBe(4);
    expect(service.subtotal()).toBe(54999 * 4);
  });

  it('should remove item when quantity is reduced to 0', () => {
    service.addToCart(mockProduct, 1);
    service.updateQuantity(mockProduct.id, 0);
    expect(service.totalItems()).toBe(0);
    expect(service.cartItems().length).toBe(0);
  });

  it('should calculate subtotal and total across multiple distinct products', () => {
    service.addToCart(mockProduct, 1);
    service.addToCart(mockProduct2, 1);
    expect(service.totalItems()).toBe(2);
    expect(service.subtotal()).toBe(54999 + 24999);
    expect(service.total()).toBe(54999 + 24999); // Free shipping >= 1000
  });

  it('should clear all items on clearCart()', () => {
    service.addToCart(mockProduct, 2);
    service.clearCart();
    expect(service.totalItems()).toBe(0);
    expect(service.cartItems().length).toBe(0);
  });
});
