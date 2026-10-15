import { TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products';
import { CartService } from '../cart.service';

describe('ProductsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(component.allProducts.length).toBeGreaterThanOrEqual(3);
  });

  it('should filter products by search query', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.searchTerm = 'laptop';
    expect(component.filteredProducts.length).toBeGreaterThan(0);
    expect(component.filteredProducts.every((p) => p.name.toLowerCase().includes('laptop'))).toBe(true);
  });

  it('should filter products by category', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.setCategory('Audio');
    expect(component.filteredProducts.length).toBeGreaterThan(0);
    expect(component.filteredProducts.every((p) => p.category === 'Audio')).toBe(true);
  });

  it('should sort products by price ascending', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.sortBy = 'price-asc';
    const prices = component.filteredProducts.map((p) => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it('should sort products by price descending', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.sortBy = 'price-desc';
    const prices = component.filteredProducts.map((p) => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
  });

  it('should reset filters', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;

    component.searchTerm = 'xyznonexistent';
    component.selectedCategory = 'Laptops';
    component.sortBy = 'price-desc';

    component.resetFilters();
    expect(component.searchTerm).toBe('');
    expect(component.selectedCategory).toBe('All');
    expect(component.sortBy).toBe('featured');
    expect(component.filteredProducts.length).toBe(component.allProducts.length);
  });

  it('should add product to cart', () => {
    const fixture = TestBed.createComponent(ProductsComponent);
    const component = fixture.componentInstance;
    const cartService = TestBed.inject(CartService);

    const initial = cartService.totalItems();
    component.addToCart(component.allProducts[0]);
    expect(cartService.totalItems()).toBe(initial + 1);
  });
});
