import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { AdminModule } from '../admin.module';

describe('CatalogPage', () => {
  let harness: RouterTestingHarness;

  const page = () => harness.routeNativeElement as HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), AdminModule],
    });
    harness = await RouterTestingHarness.create();
  });

  it('should open the first catalog by default', async () => {
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Router).url).toBe('/meal-types');
    expect(page().textContent).toContain('Doručak');
  });

  it('should show a tab for every catalog', async () => {
    await harness.navigateByUrl('/');
    expect(page().querySelectorAll('a[mat-tab-link]').length).toBe(5);
  });

  it('should show allergens with their description', async () => {
    await harness.navigateByUrl('/allergens');
    expect(page().textContent).toContain('Gluten');
    expect(page().textContent).toContain('Opis');
  });
});
