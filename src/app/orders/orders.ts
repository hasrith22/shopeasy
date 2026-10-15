import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order } from '../order.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';

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
  readonly authService = inject(AuthService);

  get orders(): Order[] {
    return this.orderService.currentUserOrders();
  }

  buyAgain(order: Order): void {
    for (const item of order.items) {
      this.cartService.addToCart(item.product, item.quantity);
    }
    this.cartService.openCart();
    this.cartService.showToast(`Items from #${order.orderId} added to cart`);
  }

  clearAllOrders(): void {
    this.orderService.clearOrdersForCurrentUser();
    this.cartService.showToast('Your order history has been cleared');
  }
}
