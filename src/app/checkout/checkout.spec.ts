import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckoutComponent } from './checkout';
import { CartService } from '../cart.service';
import { Product } from '../product';
import { NgForm } from '@angular/forms';

describe('CheckoutComponent', () => {
  let cartService: CartService;

  const sampleProduct: Product = {
    id: 1,
    name: 'Pro Ultra Laptop',
    price: 54999,
    category: 'Laptops',
    description: 'Powerful laptop',
    imageUrl: 'https://example.com/laptop.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    cartService.clearCart();
  });

  it('should create the checkout component', () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(component.currentStep()).toBe(1);
  });

  it('should advance from Step 1 to Step 2 on valid address submit', () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    const component = fixture.componentInstance;

    component.address = {
      fullName: 'Hasrith Rao',
      phone: '9876543210',
      street: '123 Tech Park',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    };

    const mockForm = { invalid: false } as unknown as NgForm;
    component.proceedToPayment(mockForm);

    expect(component.currentStep()).toBe(2);
  });

  it('should place demo order, advance to Step 3, and clear cart', async () => {
    cartService.addToCart(sampleProduct, 1);
    expect(cartService.totalItems()).toBe(1);

    const fixture = TestBed.createComponent(CheckoutComponent);
    const component = fixture.componentInstance;

    component.address = {
      fullName: 'Hasrith Rao',
      phone: '9876543210',
      street: '123 Tech Park',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    };
    component.currentStep.set(2);
    component.paymentMethod = 'upi';

    component.completeOrder();
    expect(component.isProcessingPayment()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    expect(component.currentStep()).toBe(3);
    expect(component.placedOrder()).toBeTruthy();
    expect(component.placedOrder()?.orderId).toContain('SE-');
    expect(cartService.totalItems()).toBe(0); // Cart was cleared!
  });
});
