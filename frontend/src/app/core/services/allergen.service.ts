import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Allergen } from '../../shared/models/allergen.model';

// PRIVREMENO: probni podaci dok ne postoji backend.
// Kasnije ovde ide HTTP poziv, npr. this.http.get<Allergen[]>('/api/allergens').
const MOCK_ALLERGENS: Allergen[] = [
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
];

@Injectable({ providedIn: 'root' })
export class AllergenService {
  getAll(): Observable<Allergen[]> {
    return of(MOCK_ALLERGENS);
  }
}