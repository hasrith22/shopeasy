import { TestBed } from '@angular/core/testing';
import { ProductService } from './product';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain laptop, smartphone, and headphones', () => {
    const products = service.getProducts();
    expect(products.length).toBeGreaterThanOrEqual(3);

    const hasLaptop = products.some((p) => p.name.toLowerCase().includes('laptop'));
    const hasSmartphone = products.some((p) => p.name.toLowerCase().includes('smartphone'));
    const hasHeadphones = products.some((p) => p.name.toLowerCase().includes('headphones'));

    expect(hasLaptop).toBe(true);
    expect(hasSmartphone).toBe(true);
    expect(hasHeadphones).toBe(true);
  });

  it('should return categories including All', () => {
    const categories = service.getCategories();
    expect(categories).toContain('All');
    expect(categories).toContain('Laptops');
    expect(categories).toContain('Smartphones');
    expect(categories).toContain('Audio');
  });

  it('should find product by id', () => {
    const product = service.getProductById(1);
    expect(product).toBeDefined();
    expect(product?.id).toBe(1);
  });
});
