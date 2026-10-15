import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home';
import { CartService } from '../cart.service';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should load featured products', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component.featuredProducts.length).toBeGreaterThan(0);
  });

  it('should add product to cart', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    const cartService = TestBed.inject(CartService);

    const initialCount = cartService.totalItems();
    component.addToCart(component.featuredProducts[0]);
    expect(cartService.totalItems()).toBe(initialCount + 1);
  });
});
