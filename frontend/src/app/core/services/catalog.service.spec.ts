import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;

  const names = async () =>
    (await firstValueFrom(service.getAll('meal-types'))).map((item) => item.name);

  beforeEach(() => {
    service = TestBed.inject(CatalogService);
  });

  it('should add an item with the next id', async () => {
    const created = await firstValueFrom(service.create('meal-types', { name: 'Užina' }));
    expect(created).toEqual({ id: 9, name: 'Užina' });
    expect(await names()).toContain('Užina');
  });

  it('should update an item', async () => {
    await firstValueFrom(service.update('meal-types', 1, { name: 'Rani doručak' }));
    expect(await names()).toContain('Rani doručak');
    expect(await names()).not.toContain('Doručak');
  });

  it('should delete an item', async () => {
    await firstValueFrom(service.delete('meal-types', 1));
    expect(await names()).not.toContain('Doručak');
  });
});
