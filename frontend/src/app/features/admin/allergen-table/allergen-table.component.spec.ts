import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AdminModule } from '../admin.module';
import { AllergenTable } from './allergen-table.component';

describe('AllergenTable', () => {
  let fixture: ComponentFixture<AllergenTable>;
  let element: HTMLElement;

  const rows = () => element.querySelectorAll('tr[mat-row]');

  const search = async (text: string) => {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), AdminModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AllergenTable);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should show 5 allergens on the first page', () => {
    expect(rows().length).toBe(5);
  });

  it('should find allergens without diacritics', async () => {
    await search('orasasti');
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Orašasti plodovi');
  });

  it('should show a message when nothing matches', async () => {
    await search('xyz');
    expect(rows().length).toBe(0);
    expect(element.textContent).toContain('Nema rezultata za „xyz”');
  });

  it('should sort by name', async () => {
    const nameHeader = element.querySelector('th.mat-column-name') as HTMLElement;

    nameHeader.click();
    await fixture.whenStable();
    expect(rows()[0].textContent).toContain('Celer');

    nameHeader.click();
    await fixture.whenStable();
    expect(rows()[0].textContent).toContain('Susam');
  });
});
