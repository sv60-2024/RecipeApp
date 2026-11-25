import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipeSummary } from '../../shared/models/recipe.model';
import { Home } from './home.component';

describe('Home', () => {
  const now = new Date();
  const ratedAt = new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString();
  const recipes: RecipeSummary[] = [
    {
      id: 1,
      name: 'Lower rated',
      description: 'Soup',
      author: 'Andrej',
      preparationMinutes: 30,
      servings: 2,
      ratings: [{ value: 3, ratedAt }],
    },
    {
      id: 2,
      name: 'Highest rated',
      description: 'Pasta',
      author: 'Marko',
      preparationMinutes: 20,
      servings: 4,
      ratings: [{ value: 5, ratedAt }],
    },
  ];
  let service: { getRecipes: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    service = { getRecipes: vi.fn(() => of(recipes)) };
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [Home],
      providers: [{ provide: RecipeService, useValue: service }],
    });
  });

  it('shows popular recipes by default in descending rating order', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const page: HTMLElement = fixture.nativeElement;
    expect(Array.from(page.querySelectorAll('.recipe-card h4'), (h) => h.textContent)).toEqual([
      'Highest rated',
      'Lower rated',
    ]);
    expect(page.querySelector('.recipe-rating')?.textContent).toContain('5.0 / 5');
    expect(page.textContent).toContain('Popular recipes');
  });

  it('shows an empty state when no recipes were rated last month', async () => {
    service.getRecipes.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No recipes were rated');
    expect(fixture.nativeElement.querySelectorAll('.recipe-card').length).toBe(0);
  });

  it('shows loading while waiting for recipe data', async () => {
    service.getRecipes.mockReturnValue(new Subject<RecipeSummary[]>());
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Loading',
    );
  });

  it('shows a readable error if the recipe service fails', async () => {
    service.getRecipes.mockReturnValue(throwError(() => new Error('Unavailable')));
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Recipes could not be loaded',
    );
  });
});
