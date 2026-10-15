import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  isSubmitting = false;
  isSuccess = false;
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
    if (form.invalid || this.passwordMismatch) {
      return;
    }

    this.isSubmitting = true;

    // Simulate instant secure client-side demo validation
    setTimeout(() => {
      this.submittedUser = {
        fullName: this.user.fullName,
        email: this.user.email,
      };
      this.isSuccess = true;
      this.isSubmitting = false;
      form.resetForm();
    }, 450);
  }

  registerAgain(): void {
    this.isSuccess = false;
    this.user = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }
}
