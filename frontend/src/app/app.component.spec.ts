import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app.component';
import { AuthService } from './core/auth/auth.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('RecipeApp');
  });

  it('should show the Admin link only to an admin', async () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
    expect(compiled.querySelector('a[href="/admin"]')).toBeNull();

    TestBed.inject(AuthService).setRole('ADMIN');
    await fixture.whenStable();
    expect(compiled.querySelector('a[href="/admin"]')).not.toBeNull();
  });
});
