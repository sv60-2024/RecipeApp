import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('recipe-app');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // PRIVREMENO: menja ulogu dok ne postoji prijava (briše se zajedno sa izborom uloge u HTML-u).
  protected changeRole(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.auth.setRole(value === 'ADMIN' || value === 'USER' ? value : null);

    if (!this.auth.isAdmin() && this.router.url.startsWith('/admin')) {
      this.router.navigate(['/home']);
    }
  }
}
