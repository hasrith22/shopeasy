import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  fullName: string;
  email: string;
}

interface StoredAccount extends User {
  passwordHash: string; // In-memory / client demo storage
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly USER_KEY = 'shopeasy_current_user';
  private readonly ACCOUNTS_KEY = 'shopeasy_registered_accounts';

  // Seed with a standard demo account so users can test immediately
  private accounts: StoredAccount[] = [
    {
      id: 'demo-1',
      fullName: 'Demo Shopper',
      email: 'demo@shopeasy.com',
      passwordHash: 'Password123',
    },
  ];

  readonly currentUser = signal<User | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      // Load registered accounts
      const storedAcc = localStorage.getItem(this.ACCOUNTS_KEY);
      if (storedAcc) {
        const parsed = JSON.parse(storedAcc);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.accounts = parsed;
        }
      } else {
        localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(this.accounts));
      }

      // Restore active session
      const storedUser = localStorage.getItem(this.USER_KEY);
      if (storedUser) {
        this.currentUser.set(JSON.parse(storedUser));
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  register(fullName: string, email: string, password: string): { success: boolean; message?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = this.accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: StoredAccount = {
      id: 'user_' + Date.now(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: password,
    };

    this.accounts.push(newUser);
    this.saveAccounts();

    // Automatically authenticate new user
    const publicUser: User = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
    };
    this.setCurrentUser(publicUser);

    return { success: true };
  }

  login(email: string, password: string): { success: boolean; message?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const account = this.accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (!account) {
      return { success: false, message: 'No account found with this email. Please register first.' };
    }

    if (account.passwordHash !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const publicUser: User = {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
    };
    this.setCurrentUser(publicUser);

    return { success: true };
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(this.USER_KEY);
      } catch {
        // Safe fallback
      }
    }
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } catch {
        // Safe fallback
      }
    }
  }

  private saveAccounts(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(this.accounts));
    } catch {
      // Safe fallback
    }
  }
}
