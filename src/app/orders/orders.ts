import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../order.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent {
  readonly orderService = inject(OrderService);
  readonly cartService = inject(CartService);

  get orders(): Order[] {
    return this.orderService.orders();
  }

  buyAgain(order: Order): void {
    for (const item of order.items) {
      this.cartService.addToCart(item.product, item.quantity);
    }
    this.cartService.openCart();
    this.cartService.showToast(`Items from #${order.orderId} added to cart`);
  }

  clearAllOrders(): void {
    this.orderService.clearOrders();
    this.cartService.showToast('Orders history cleared');
  }
}
