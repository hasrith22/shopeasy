import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { vi } from 'vitest';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should auto fill demo credentials', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.fillDemoCredentials();
    expect(component.credentials.email).toBe('demo@shopeasy.com');
    expect(component.credentials.password).toBe('Password123');
  });

  it('should show error for invalid credentials', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;

    component.credentials.email = 'wrong@example.com';
    component.credentials.password = 'InvalidPass123';

    const mockForm = { invalid: false } as unknown as NgForm;
    component.onSubmit(mockForm);
    expect(component.isSubmitting).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 450));
    expect(component.isSubmitting).toBe(false);
    expect(component.errorMessage).toBeTruthy();
  });

  it('should log in successfully with demo credentials', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    const authService = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.fillDemoCredentials();
    const mockForm = { invalid: false } as unknown as NgForm;
    component.onSubmit(mockForm);

    await new Promise((resolve) => setTimeout(resolve, 450));
    expect(authService.isLoggedIn()).toBe(true);
    expect(authService.currentUser()?.email).toBe('demo@shopeasy.com');
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
