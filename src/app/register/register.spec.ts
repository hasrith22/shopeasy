import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RegisterComponent } from './register';
import { NgForm } from '@angular/forms';

describe('RegisterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should detect password mismatch', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;

    component.user.password = 'Secret1234';
    component.user.confirmPassword = 'DifferentPassword';
    expect(component.passwordMismatch).toBe(true);

    component.user.confirmPassword = 'Secret1234';
    expect(component.passwordMismatch).toBe(false);
  });

  it('should handle registration submit in demo mode', async () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const component = fixture.componentInstance;

    const email = `jane_${Date.now()}@example.com`;
    component.user.fullName = 'Jane Doe';
    component.user.email = email;
    component.user.password = 'password123';
    component.user.confirmPassword = 'password123';

    const mockForm = {
      invalid: false,
      resetForm: () => {},
    } as unknown as NgForm;

    component.onSubmit(mockForm);
    expect(component.isSubmitting).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 550));
    expect(component.isSuccess).toBe(true);
    expect(component.submittedUser.fullName).toBe('Jane Doe');
    expect(component.submittedUser.email).toBe(email);
  });
});
