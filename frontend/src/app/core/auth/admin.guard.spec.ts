import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { adminGuard } from './admin.guard';
import { AuthService, Role } from './auth.service';

@Component({ template: 'home' })
class HomeStub {}

@Component({ template: 'admin' })
class AdminStub {}

describe('adminGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'home', component: HomeStub },
          { path: 'admin', canMatch: [adminGuard], component: AdminStub },
        ]),
      ],
    });
  });

  const openAdminAs = async (role: Role | null) => {
    TestBed.inject(AuthService).setRole(role);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/admin');
    return TestBed.inject(Router).url;
  };

  it('should let an admin open /admin', async () => {
    expect(await openAdminAs('ADMIN')).toBe('/admin');
  });

  it('should send a regular user back to /home', async () => {
    expect(await openAdminAs('USER')).toBe('/home');
  });

  it('should send a guest back to /home', async () => {
    expect(await openAdminAs(null)).toBe('/home');
  });
});
