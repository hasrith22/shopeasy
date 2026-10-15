import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../cart.service';
import { AuthService } from '../auth.service';
import { OrderService, Order } from '../order.service';

export interface OrderDetails {
  orderId: string;
  orderDate: Date;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  // Checkout Steps: 1 = Address, 2 = Payment, 3 = Order Placed Success
  currentStep = signal<1 | 2 | 3>(1);
  isProcessingPayment = signal(false);

  // Address details pre-filled if logged in
  address = {
    fullName: this.authService.currentUser()?.fullName || '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  };

  paymentMethod = 'upi'; // 'upi' | 'card' | 'cod'
  upiId = 'shopper@upi';
  cardNumber = '4242 •••• •••• 4242';

  // Confirmed Order snapshot
  placedOrder = signal<OrderDetails | null>(null);

  indianStates = [
    'Andhra Pradesh',
    'Delhi',
    'Gujarat',
    'Karnataka',
    'Kerala',
    'Maharashtra',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal',
  ];

  proceedToPayment(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.currentStep.set(2);
    // Scroll smoothly to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  backToAddress(): void {
    this.currentStep.set(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  completeOrder(): void {
    if (this.cartService.cartItems().length === 0) return;

    this.isProcessingPayment.set(true);

    setTimeout(() => {
      const randomOrderId = 'SE-' + Math.floor(100000 + Math.random() * 900000);
      const snapshot: OrderDetails = {
        orderId: randomOrderId,
        orderDate: new Date(),
        items: [...this.cartService.cartItems()],
        subtotal: this.cartService.subtotal(),
        shipping: this.cartService.shipping(),
        total: this.cartService.total(),
        shippingAddress: { ...this.address },
        paymentMethod:
          this.paymentMethod === 'upi'
            ? 'UPI / QR Payment'
            : this.paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : 'Cash on Delivery',
      };

      this.placedOrder.set(snapshot);
      this.isProcessingPayment.set(false);
      this.currentStep.set(3);

      // Save to booked orders history
      const savedOrderRecord: Order = {
        orderId: snapshot.orderId,
        orderDate: snapshot.orderDate.toISOString(),
        items: snapshot.items,
        subtotal: snapshot.subtotal,
        shipping: snapshot.shipping,
        total: snapshot.total,
        shippingAddress: snapshot.shippingAddress,
        paymentMethod: snapshot.paymentMethod,
        status: 'Confirmed',
        estimatedDelivery: this.estimatedDeliveryDate,
      };
      this.orderService.addOrder(savedOrderRecord);

      // Clear cart now that the order is confirmed
      this.cartService.clearCart();
      this.cartService.showToast(`Order ${randomOrderId} placed successfully!`);

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 800);
  }

  get estimatedDeliveryDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
}
