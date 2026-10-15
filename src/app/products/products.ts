import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../product';
import { CartService } from '../cart.service';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  readonly allProducts: Product[] = this.productService.getProducts();
  readonly categories: string[] = this.productService.getCategories();

  searchTerm = '';
  selectedCategory = 'All';
  sortBy: SortOption = 'featured';

  get filteredProducts(): Product[] {
    let result = [...this.allProducts];

    // Filter by category
    if (this.selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    const query = this.searchTerm.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // preserve base order
        break;
    }

    return result;
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  setSort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value as SortOption;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.sortBy = 'featured';
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f1f5f9"/><text x="50%" y="50%" fill="%2364748b" font-family="sans-serif" font-size="14" dominant-baseline="middle" text-anchor="middle">ShopEasy Product</text></svg>';
  }
}
