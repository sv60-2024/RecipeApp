import { Injectable, computed, signal } from '@angular/core';

export type Role = 'ADMIN' | 'USER';

const ROLE_KEY = 'role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentRole = signal<Role | null>(this.readStoredRole());

  readonly role = this.currentRole.asReadonly();
  readonly isAdmin = computed(() => this.currentRole() === 'ADMIN');

  // PRIVREMENO: dok ne postoji prijava, uloga se bira ručno u navigaciji.
  // Kad login bude gotov, ovde se upisuje uloga iz JWT-a dobijenog posle prijave.
  setRole(role: Role | null): void {
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
    this.currentRole.set(role);
  }

  private readStoredRole(): Role | null {
    const stored = localStorage.getItem(ROLE_KEY);
    return stored === 'ADMIN' || stored === 'USER' ? stored : null;
  }
}
