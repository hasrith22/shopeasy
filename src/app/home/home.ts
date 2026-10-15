import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductService } from '../product';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  readonly featuredProducts: Product[] = this.productService.getFeaturedProducts();

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f1f5f9"/><text x="50%" y="50%" fill="%2364748b" font-family="sans-serif" font-size="14" dominant-baseline="middle" text-anchor="middle">ShopEasy Product</text></svg>';
  }
}
