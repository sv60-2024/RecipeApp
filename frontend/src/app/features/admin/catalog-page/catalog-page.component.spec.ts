import { TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { AdminModule } from '../admin.module';

describe('CatalogPage', () => {
  let harness: RouterTestingHarness;

  const page = () => harness.routeNativeElement as HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), AdminModule],
      // Bez animacija dijalog se zatvara odmah, pa test ne mora da čeka.
      providers: [{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }],
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

  it('should add a new item through the form', async () => {
    await harness.navigateByUrl('/meal-types');
    (page().querySelector('.add-button') as HTMLElement).click();
    await harness.fixture.whenStable();

    const input = document.querySelector('mat-dialog-container input') as HTMLInputElement;
    input.value = 'Užina';
    input.dispatchEvent(new Event('input'));
    (document.querySelector('mat-dialog-container button[type=submit]') as HTMLElement).click();
    await harness.fixture.whenStable();

    const search = page().querySelector('.search input') as HTMLInputElement;
    search.value = 'uzina';
    search.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();
    expect(page().querySelectorAll('tr[mat-row]').length).toBe(1);
    expect(page().textContent).toContain('Užina');
  });

  it('should keep the item when the edit form is cancelled', async () => {
    await harness.navigateByUrl('/meal-types');
    (page().querySelector('button[aria-label="Izmeni"]') as HTMLElement).click();
    await harness.fixture.whenStable();

    const cancel = Array.from(document.querySelectorAll('mat-dialog-container button')).find(
      (button) => button.textContent?.trim() === 'Otkaži',
    ) as HTMLElement;
    cancel.click();
    await harness.fixture.whenStable();

    const firstName = page().querySelector('tr[mat-row] td.mat-column-name')?.textContent?.trim();
    expect(firstName).toBe('Doručak');
    expect(page().querySelectorAll('tr[mat-row]').length).toBe(5);
  });

  it('should not offer editing for catalogs that belong to IKS-22C', async () => {
    await harness.navigateByUrl('/allergens');
    expect(page().querySelector('.add-button')).toBeNull();
  });

  it('should show allergens with their description', async () => {
    await harness.navigateByUrl('/allergens');
    expect(page().textContent).toContain('Gluten');
    expect(page().textContent).toContain('Opis');
  });
});
