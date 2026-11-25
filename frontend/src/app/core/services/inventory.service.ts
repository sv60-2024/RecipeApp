import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IngredientAmount } from '../../shared/models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  // Temporary current-user stock. Replace with the authenticated ISS inventory API.
  // Inventory editing belongs to IKS-17, not the home-page card.
  getAvailableIngredients(): Observable<IngredientAmount[]> {
    return of([
      { ingredientId: 1, name: 'Pasta', quantity: 200, unit: 'g' },
      { ingredientId: 2, name: 'Tomato', quantity: 0.5, unit: 'kg' },
      { ingredientId: 3, name: 'Basil', quantity: 20, unit: 'g' },
      { ingredientId: 4, name: 'Chickpeas', quantity: 300, unit: 'g' },
      { ingredientId: 5, name: 'Cucumber', quantity: 1, unit: 'piece' },
      { ingredientId: 6, name: 'Lemon', quantity: 1, unit: 'piece' },
    ]);
  }
}
