import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly cartService = inject(CartService);

  readonly isMobileMenuOpen = signal(false);
  readonly showCheckoutNotice = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  openCheckoutNotice(): void {
    this.showCheckoutNotice.set(true);
  }

  closeCheckoutNotice(): void {
    this.showCheckoutNotice.set(false);
  }
}
