import { TestBed } from '@angular/core/testing';
import { OrderService, Order } from './order.service';
import { AuthService } from './auth.service';

describe('OrderService', () => {
  let service: OrderService;
  let authService: AuthService;

  const sampleOrder: Order = {
    orderId: 'SE-999999',
    orderDate: new Date().toISOString(),
    userEmail: 'alex@example.com',
    items: [],
    subtotal: 1999,
    shipping: 0,
    total: 1999,
    shippingAddress: {
      fullName: 'Alex Test',
      phone: '9876543210',
      street: '45 Tech Street',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
    },
    paymentMethod: 'UPI',
    status: 'Confirmed',
    estimatedDelivery: 'Oct 20',
  };

  const otherUserOrder: Order = {
    ...sampleOrder,
    orderId: 'SE-888888',
    userEmail: 'other@example.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
    authService = TestBed.inject(AuthService);
    service.clearOrders();
    authService.logout();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add order to history', () => {
    service.addOrder(sampleOrder);
    expect(service.orders().length).toBe(1);
    expect(service.orders()[0].orderId).toBe('SE-999999');
  });

  it('should find order by id', () => {
    service.addOrder(sampleOrder);
    const found = service.getOrderById('SE-999999');
    expect(found).toBeDefined();
    expect(found?.total).toBe(1999);
  });

  it('should filter orders strictly by current logged-in user account', () => {
    service.addOrder(sampleOrder); // alex@example.com
    service.addOrder(otherUserOrder); // other@example.com

    // Not logged in -> no orders visible
    expect(service.currentUserOrders().length).toBe(0);

    // Register & log in as alex
    authService.register('Alex Test', 'alex@example.com', 'Password@123');
    expect(service.currentUserOrders().length).toBe(1);
    expect(service.currentUserOrders()[0].orderId).toBe('SE-999999');

    // Switch account to other
    authService.register('Other User', 'other@example.com', 'Password@123');
    expect(service.currentUserOrders().length).toBe(1);
    expect(service.currentUserOrders()[0].orderId).toBe('SE-888888');
  });

  it('should clear only current user orders with clearOrdersForCurrentUser', () => {
    const userAOrder: Order = { ...sampleOrder, orderId: 'SE-111111', userEmail: 'user_a@example.com' };
    const userBOrder: Order = { ...sampleOrder, orderId: 'SE-222222', userEmail: 'user_b@example.com' };

    service.addOrder(userAOrder);
    service.addOrder(userBOrder);

    authService.register('User A', 'user_a@example.com', 'Password@123');
    expect(service.currentUserOrders().length).toBe(1);
    expect(service.currentUserOrders()[0].orderId).toBe('SE-111111');

    service.clearOrdersForCurrentUser();
    expect(service.currentUserOrders().length).toBe(0);

    // User B order remains intact in storage
    authService.register('User B', 'user_b@example.com', 'Password@123');
    expect(service.currentUserOrders().length).toBe(1);
    expect(service.currentUserOrders()[0].orderId).toBe('SE-222222');
  });

  it('should clear all orders history when clearOrders is called', () => {
    service.addOrder(sampleOrder);
    expect(service.orders().length).toBe(1);
    service.clearOrders();
    expect(service.orders().length).toBe(0);
  });
});
