import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RecipeRating, RecipeSummary } from '../../shared/models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  // Temporary demo data, following CatalogService. Replace with the ISS API when available.
  // Dates are relative to today so the previous-month example stays usable in future demos.
  getRecipes(): Observable<RecipeSummary[]> {
    const now = new Date();
    const rating = (value: number, monthOffset: number, day: number): RecipeRating => ({
      value,
      ratedAt: new Date(now.getFullYear(), now.getMonth() + monthOffset, day, 12).toISOString(),
    });

    const published = (daysAgo: number) =>
      new Date(now.getTime() - daysAgo * 86_400_000).toISOString();

    return of([
      {
        id: 1,
        name: 'Vegetable risotto',
        description: 'Creamy rice with seasonal vegetables and parmesan.',
        author: 'Vukašin',
        preparationMinutes: 35,
        servings: 2,
        publishedAt: published(5),
        ingredients: [
          { ingredientId: 7, name: 'Rice', quantity: 200, unit: 'g' },
          { ingredientId: 2, name: 'Tomato', quantity: 100, unit: 'g' },
          { ingredientId: 8, name: 'Parmesan', quantity: 50, unit: 'g' },
        ],
        ratings: [rating(4, -1, 2), rating(4, -1, 14), rating(5, 0, 1)],
      },
      {
        id: 2,
        name: 'Apple and cinnamon pancakes',
        description: 'Soft pancakes with grated apple and a pinch of cinnamon.',
        author: 'Marko',
        preparationMinutes: 25,
        servings: 4,
        publishedAt: published(3),
        ingredients: [
          { ingredientId: 9, name: 'Flour', quantity: 250, unit: 'g' },
          { ingredientId: 10, name: 'Apple', quantity: 2, unit: 'piece' },
          { ingredientId: 11, name: 'Milk', quantity: 300, unit: 'ml' },
          { ingredientId: 12, name: 'Cinnamon', quantity: 2, unit: 'g' },
        ],
        ratings: [rating(5, -1, 3), rating(5, -1, 8), rating(4, -1, 15), rating(5, -1, 20)],
      },
      {
        id: 3,
        name: 'Tomato pasta',
        description: 'A quick pasta with fresh tomato sauce and basil.',
        author: 'Andrej',
        preparationMinutes: 20,
        servings: 2,
        publishedAt: published(1),
        ingredients: [
          { ingredientId: 1, name: 'Pasta', quantity: 200, unit: 'g' },
          { ingredientId: 2, name: 'Tomato', quantity: 300, unit: 'g' },
          { ingredientId: 3, name: 'Basil', quantity: 10, unit: 'g' },
        ],
        ratings: [rating(4, -1, 4), rating(5, -1, 18), rating(1, -2, 10)],
      },
      {
        id: 4,
        name: 'Chickpea salad',
        description: 'Chickpeas, cucumber and tomato with a lemon dressing.',
        author: 'Marko',
        preparationMinutes: 15,
        servings: 2,
        publishedAt: published(0),
        ingredients: [
          { ingredientId: 4, name: 'Chickpeas', quantity: 250, unit: 'g' },
          { ingredientId: 5, name: 'Cucumber', quantity: 1, unit: 'piece' },
          { ingredientId: 2, name: 'Tomato', quantity: 200, unit: 'g' },
          { ingredientId: 6, name: 'Lemon', quantity: 1, unit: 'piece' },
        ],
        ratings: [rating(5, 0, 1)],
      },
    ]);
  }
}
