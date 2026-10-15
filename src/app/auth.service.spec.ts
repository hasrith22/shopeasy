import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    service.logout();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should successfully log in with demo credentials', () => {
    const res = service.login('demo@shopeasy.com', 'Password123');
    expect(res.success).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.email).toBe('demo@shopeasy.com');
  });

  it('should reject invalid password for demo user', () => {
    const res = service.login('demo@shopeasy.com', 'WrongPassword!');
    expect(res.success).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should reject non-existent user', () => {
    const res = service.login('nobody@example.com', 'Password123');
    expect(res.success).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should register a new user and log them in', () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const res = service.register('John Doe', uniqueEmail, 'Password123');
    expect(res.success).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.fullName).toBe('John Doe');
    expect(service.currentUser()?.email).toBe(uniqueEmail);
  });

  it('should prevent registering duplicate email', () => {
    const res = service.register('Duplicate Demo', 'demo@shopeasy.com', 'Password123');
    expect(res.success).toBe(false);
    expect(res.message).toContain('already exists');
  });

  it('should log out correctly', () => {
    service.login('demo@shopeasy.com', 'Password123');
    expect(service.isLoggedIn()).toBe(true);
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });
});
