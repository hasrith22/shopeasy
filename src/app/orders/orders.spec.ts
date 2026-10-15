import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OrdersComponent } from './orders';
import { OrderService, Order } from '../order.service';
import { CartService } from '../cart.service';

describe('OrdersComponent', () => {
  let orderService: OrderService;
  let cartService: CartService;

  const sampleOrder: Order = {
    orderId: 'SE-123456',
    orderDate: new Date().toISOString(),
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
    orderService.clearOrders();
    cartService.clearCart();
  });

  it('should create the orders component', () => {
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should list existing orders', () => {
    orderService.addOrder(sampleOrder);
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;
    expect(component.orders.length).toBe(1);
    expect(component.orders[0].orderId).toBe('SE-123456');
  });

  it('should support Buy Again to re-add order items to cart', () => {
    orderService.addOrder(sampleOrder);
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;

    component.buyAgain(sampleOrder);
    expect(cartService.totalItems()).toBe(2);
    expect(cartService.subtotal()).toBe(109998);
  });
});
