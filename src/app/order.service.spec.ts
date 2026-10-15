import { TestBed } from '@angular/core/testing';
import { OrderService, Order } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  const sampleOrder: Order = {
    orderId: 'SE-999999',
    orderDate: new Date().toISOString(),
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
    service.clearOrders();
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

  it('should clear order history', () => {
    service.addOrder(sampleOrder);
    expect(service.orders().length).toBe(1);
    service.clearOrders();
    expect(service.orders().length).toBe(0);
  });
});
