import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  isSubmitting = false;
  isSuccess = false;
  errorMessage: string | null = null;
  submittedUser = {
    fullName: '',
    email: '',
  };

  get passwordMismatch(): boolean {
    return Boolean(
      this.user.password &&
      this.user.confirmPassword &&
      this.user.password !== this.user.confirmPassword
    );
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = null;

    if (form.invalid || this.passwordMismatch) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const result = this.authService.register(
        this.user.fullName,
        this.user.email,
        this.user.password
      );

      this.isSubmitting = false;

      if (!result.success) {
        this.errorMessage = result.message || 'Registration failed.';
        return;
      }

      this.submittedUser = {
        fullName: this.user.fullName,
        email: this.user.email,
      };
      this.isSuccess = true;
      this.cartService.showToast(`Welcome to ShopEasy, ${this.user.fullName}!`);
      form.resetForm();
    }, 450);
  }

  registerAgain(): void {
    this.isSuccess = false;
    this.errorMessage = null;
    this.user = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }
}
