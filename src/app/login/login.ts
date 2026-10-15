import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  credentials = {
    email: '',
    password: '',
  };

  isSubmitting = false;
  errorMessage: string | null = null;

  onSubmit(form: NgForm): void {
    this.errorMessage = null;

    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const result = this.authService.login(
        this.credentials.email,
        this.credentials.password
      );

      this.isSubmitting = false;

      if (!result.success) {
        this.errorMessage = result.message || 'Invalid credentials.';
        return;
      }

      const currentUser = this.authService.currentUser();
      this.cartService.showToast(
        currentUser ? `Welcome back, ${currentUser.fullName}!` : 'Successfully logged in!'
      );
      this.router.navigate(['/products']);
    }, 400);
  }

  fillDemoCredentials(): void {
    this.credentials.email = 'demo@shopeasy.com';
    this.credentials.password = 'Password123';
    this.errorMessage = null;
  }
}
