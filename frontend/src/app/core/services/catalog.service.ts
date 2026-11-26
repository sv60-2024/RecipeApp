import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CatalogItem } from '../../shared/models/catalog-item.model';

export type CatalogKind =
  'meal-types' | 'dish-types' | 'diet-types' | 'ingredient-categories' | 'allergens';

// Pravi listu { id, name } od samih naziva.
const items = (names: string[]): CatalogItem[] =>
  names.map((name, index) => ({ id: index + 1, name }));

// PRIVREMENO: probni podaci iz specifikacije dok ne postoji backend.
// Kad bude backend-a, metode servisa postaju HTTP pozivi, npr. this.http.get<CatalogItem[]>(`/api/${kind}`).
const MOCK_CATALOGS: Record<CatalogKind, CatalogItem[]> = {
  'meal-types': items([
    'Doručak',
    'Ručak',
    'Večera',
    'Glavna jela',
    'Predjela',
    'Salate',
    'Deserti',
    'Pića',
  ]),
  'dish-types': items([
    'Supa',
    'Čorba',
    'Testenina',
    'Pica',
    'Sendvič',
    'Burger',
    'Rižoto',
    'Jelo od mesa',
    'Jelo od ribe',
    'Jelo od povrća',
    'Pekarski proizvod',
    'Kolač',
    'Torta',
    'Palačinke',
  ]),
  'diet-types': items(['Vegetarijanska', 'Veganska', 'Posna', 'Mrsna', 'Hrono', 'Pesketarijanska']),
  'ingredient-categories': items([
    'Povrće',
    'Voće',
    'Meso',
    'Riba',
    'Mlečni proizvodi',
    'Žitarice',
    'Začini',
    'Orašasti plodovi',
  ]),
  allergens: [
    { id: 1, name: 'Gluten', description: 'Pšenica, raž, ječam, ovas, pir' },
    { id: 2, name: 'Rakovi', description: 'Škampi, jastog, rakovice' },
    { id: 3, name: 'Jaja', description: 'Jaja i proizvodi od jaja' },
    { id: 4, name: 'Riba', description: 'Riba i proizvodi od ribe' },
    { id: 5, name: 'Kikiriki', description: 'Kikiriki, kikiriki puter, kikiriki ulje' },
    { id: 6, name: 'Soja', description: 'Soja, sojino mleko, tofu' },
    { id: 7, name: 'Mleko', description: 'Mleko i mlečni proizvodi, uključujući laktozu' },
    { id: 8, name: 'Orašasti plodovi', description: 'Bademi, lešnici, orasi, indijski orah' },
    { id: 9, name: 'Celer', description: 'Celer i proizvodi od celera' },
    { id: 10, name: 'Slačica', description: 'Slačica i senf' },
    { id: 11, name: 'Susam', description: 'Seme susama, tahini' },
    { id: 12, name: 'Sumpor-dioksid i sulfiti', description: 'Česti u vinu i suvom voću' },
    { id: 13, name: 'Lupina', description: 'Lupina i brašno od lupine' },
    { id: 14, name: 'Mekušci', description: 'Školjke, lignje, hobotnica, puževi' },
  ],
};

// Podaci koje korisnik šalje kad dodaje ili menja stavku (id dodeljuje server).
export type CatalogItemInput = Omit<CatalogItem, 'id'>;

@Injectable({ providedIn: 'root' })
export class CatalogService {
  // PRIVREMENO: radna kopija probnih podataka; izmene traju dok se stranica ne osveži.
  private readonly data: Record<CatalogKind, CatalogItem[]> = structuredClone(MOCK_CATALOGS);

  getAll(kind: CatalogKind): Observable<CatalogItem[]> {
    return of([...this.data[kind]]);
  }

  create(kind: CatalogKind, input: CatalogItemInput): Observable<CatalogItem> {
    const items = this.data[kind];
    const created = { ...input, id: Math.max(0, ...items.map((item) => item.id)) + 1 };
    this.data[kind] = [...items, created];
    return of(created);
  }

  update(kind: CatalogKind, id: number, input: CatalogItemInput): Observable<CatalogItem> {
    const updated = { ...input, id };
    this.data[kind] = this.data[kind].map((item) => (item.id === id ? updated : item));
    return of(updated);
  }

  delete(kind: CatalogKind, id: number): Observable<void> {
    this.data[kind] = this.data[kind].filter((item) => item.id !== id);
    return of(undefined);
  }
}
