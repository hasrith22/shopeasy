import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OrdersComponent } from './orders';
import { OrderService, Order } from '../order.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';

describe('OrdersComponent', () => {
  let orderService: OrderService;
  let cartService: CartService;
  let authService: AuthService;

  const sampleOrder: Order = {
    orderId: 'SE-123456',
    orderDate: new Date().toISOString(),
    userEmail: 'hasrith@example.com',
    items: [
      {
        product: {
          id: 1,
          name: 'Pro Ultra Laptop',
          price: 54999,
          category: 'Laptops',
          description: 'High performance laptop',
          imageUrl: 'https://example.com/laptop.jpg',
        },
        quantity: 2,
      },
    ],
    subtotal: 109998,
    shipping: 0,
    total: 109998,
    shippingAddress: {
      fullName: 'Hasrith Rao',
      phone: '9876543210',
      street: '123 Tech Park',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
    },
    paymentMethod: 'UPI / QR Payment',
    status: 'Confirmed',
    estimatedDelivery: 'Oct 21',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    orderService = TestBed.inject(OrderService);
    cartService = TestBed.inject(CartService);
    authService = TestBed.inject(AuthService);
    orderService.clearOrders();
    cartService.clearCart();
    authService.logout();
  });

  it('should create the orders component', () => {
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should return empty orders when user is not logged in', () => {
    orderService.addOrder(sampleOrder);
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;
    expect(component.orders.length).toBe(0);
  });

  it('should list existing orders for the logged-in customer account only', () => {
    // Log in as hasrith
    authService.register('Hasrith Rao', 'hasrith@example.com', 'Password@123');
    orderService.addOrder(sampleOrder);

    // Also add another order for someone else
    orderService.addOrder({
      ...sampleOrder,
      orderId: 'SE-777777',
      userEmail: 'stranger@example.com',
    });

    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;
    // Should only see hasrith's order, NOT stranger's order
    expect(component.orders.length).toBe(1);
    expect(component.orders[0].orderId).toBe('SE-123456');
  });

  it('should support Buy Again to re-add order items to cart', () => {
    authService.register('Hasrith Rao', 'hasrith@example.com', 'Password@123');
    orderService.addOrder(sampleOrder);
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;

    component.buyAgain(sampleOrder);
    expect(cartService.totalItems()).toBe(2);
    expect(cartService.subtotal()).toBe(109998);
  });
});
