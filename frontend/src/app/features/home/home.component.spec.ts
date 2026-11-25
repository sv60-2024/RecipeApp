import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, defer, of, Subject, throwError } from 'rxjs';
import { RecipeService } from '../../core/services/recipe.service';
import { InventoryService } from '../../core/services/inventory.service';
import { IngredientAmount } from '../../shared/models/ingredient.model';
import { RecipeSummary } from '../../shared/models/recipe.model';
import { Home } from './home.component';

describe('Home', () => {
  const now = new Date();
  const ratedAt = new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString();
  const ingredient: IngredientAmount = { ingredientId: 1, name: 'Flour', quantity: 100, unit: 'g' };
  const stock: IngredientAmount[] = [{ ...ingredient, quantity: 200 }];
  const recipes: RecipeSummary[] = [
    {
      id: 1,
      name: 'Lower rated',
      description: 'Soup',
      author: 'Andrej',
      preparationMinutes: 30,
      servings: 2,
      ratings: [{ value: 3, ratedAt }],
      publishedAt: new Date(now.getTime() - 86_400_000).toISOString(),
      ingredients: [ingredient],
    },
    {
      id: 2,
      name: 'Highest rated',
      description: 'Pasta',
      author: 'Marko',
      preparationMinutes: 20,
      servings: 4,
      ratings: [{ value: 5, ratedAt }],
      publishedAt: new Date(now.getTime() - 2 * 86_400_000).toISOString(),
      ingredients: [{ ...ingredient, quantity: 300 }],
    },
    {
      id: 3,
      name: 'New recipe',
      description: 'Salad',
      author: 'Marko',
      preparationMinutes: 15,
      servings: 2,
      ratings: [],
      publishedAt: now.toISOString(),
      ingredients: [{ ...ingredient, ingredientId: 2, name: 'Sugar' }],
    },
  ];
  let service: { getRecipes: ReturnType<typeof vi.fn> };
  let inventory: { getAvailableIngredients: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    service = { getRecipes: vi.fn(() => of(recipes)) };
    inventory = { getAvailableIngredients: vi.fn(() => of(stock)) };
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [Home],
      providers: [
        { provide: RecipeService, useValue: service },
        { provide: InventoryService, useValue: inventory },
      ],
    });
  });

  async function render() {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const page: HTMLElement = fixture.nativeElement;
    return {
      fixture,
      page,
      names: () => Array.from(page.querySelectorAll('.recipe-card h4'), (h) => h.textContent),
      select: async (label: string) => {
        const button = Array.from(page.querySelectorAll('button')).find(
          (b) => b.textContent?.trim() === label,
        );
        expect(button).toBeDefined();
        button!.click();
        await fixture.whenStable();
      },
    };
  }

  it('uses the actual demo sources consistently across all three views', async () => {
    TestBed.overrideProvider(RecipeService, { useValue: new RecipeService() });
    TestBed.overrideProvider(InventoryService, { useValue: new InventoryService() });
    const { names, select } = await render();
    expect(names()).toEqual(['Apple and cinnamon pancakes', 'Tomato pasta', 'Vegetable risotto']);
    await select('Latest');
    expect(names()).toEqual([
      'Chickpea salad',
      'Tomato pasta',
      'Apple and cinnamon pancakes',
      'Vegetable risotto',
    ]);
    await select('Can cook');
    expect(names()).toEqual(['Chickpea salad', 'Tomato pasta']);
  });

  it('keeps popular recipes selected by default and uses previous-month ratings', async () => {
    const { page, names } = await render();
    expect(names()).toEqual(['Highest rated', 'Lower rated']);
    expect(page.querySelector('.recipe-rating')?.textContent).toContain('5.0 / 5');
    expect(page.querySelector('button[aria-pressed="true"]')?.textContent?.trim()).toBe('Popular');
  });

  it('switches to newest-first recipes including ones without previous-month ratings, then back', async () => {
    const { page, names, select } = await render();
    await select('Latest');
    expect(names()).toEqual(['New recipe', 'Lower rated', 'Highest rated']);
    expect(page.querySelector('h3')?.textContent).toContain('Latest recipes');
    expect(page.querySelector('button[aria-pressed="true"]')?.textContent?.trim()).toBe('Latest');
    await select('Popular');
    expect(names()).toEqual(['Highest rated', 'Lower rated']);
  });

  it('shows only recipes with sufficient stock and exposes stock and required amounts', async () => {
    const { page, names, select } = await render();
    await select('Can cook');
    expect(names()).toEqual(['Lower rated']);
    expect(page.querySelector('.available-ingredients')?.textContent).toContain('200 g');
    expect(page.querySelector('.recipe-card')?.textContent).toContain('100 g');
  });

  it('recomputes matching recipes when available stock changes', async () => {
    const updates = new BehaviorSubject(stock);
    inventory.getAvailableIngredients.mockReturnValue(updates);
    const { fixture, names, select } = await render();
    await select('Can cook');
    expect(names()).toEqual(['Lower rated']);
    updates.next([{ ...ingredient, quantity: 300 }]);
    await fixture.whenStable();
    expect(names()).toEqual(['Lower rated', 'Highest rated']);
    updates.next([]);
    await fixture.whenStable();
    expect(names()).toEqual([]);
  });

  it('does not request inventory until Can cook is selected', async () => {
    const subscribed = vi.fn(() => of(stock));
    inventory.getAvailableIngredients.mockReturnValue(defer(subscribed));
    const { select } = await render();
    await select('Latest');
    expect(subscribed).not.toHaveBeenCalled();
    await select('Can cook');
    expect(subscribed).toHaveBeenCalledTimes(1);
  });

  it('shows a specific empty message for each view', async () => {
    service.getRecipes.mockReturnValue(of([]));
    const { page, select } = await render();
    expect(page.textContent).toContain('No recipes were rated');
    await select('Latest');
    expect(page.textContent).toContain('No published recipes');
    await select('Can cook');
    expect(page.textContent).toContain('No recipes can be prepared');
  });

  it('shows empty inventory rather than treating it as all recipes being cookable', async () => {
    inventory.getAvailableIngredients.mockReturnValue(of([]));
    const { page, names, select } = await render();
    await select('Can cook');
    expect(names()).toEqual([]);
    expect(page.textContent).toContain('Your ingredient inventory is empty');
  });

  it('shows loading while waiting for recipe data', async () => {
    service.getRecipes.mockReturnValue(new Subject<RecipeSummary[]>());
    const { page } = await render();
    expect(page.querySelector('[role="status"]')?.textContent).toContain('Loading recipes');
  });

  it('waits for inventory only in Can cook and can return to Latest', async () => {
    inventory.getAvailableIngredients.mockReturnValue(new Subject<IngredientAmount[]>());
    const { page, names, select } = await render();
    await select('Can cook');
    expect(page.querySelector('[role="status"]')?.textContent).toContain(
      'Loading recipes and available ingredients',
    );
    await select('Latest');
    expect(names()).toHaveLength(3);
  });

  it('shows a readable error if recipes fail in any view', async () => {
    service.getRecipes.mockReturnValue(throwError(() => new Error('Unavailable')));
    const { page, select } = await render();
    for (const view of ['Popular', 'Latest', 'Can cook']) {
      await select(view);
      expect(page.querySelector('[role="alert"]')?.textContent).toContain(
        'Recipes could not be loaded',
      );
    }
  });

  it('keeps Popular and Latest usable when inventory loading fails', async () => {
    inventory.getAvailableIngredients.mockReturnValue(throwError(() => new Error('Unavailable')));
    const { page, names, select } = await render();
    expect(names()).toHaveLength(2);
    await select('Can cook');
    expect(page.querySelector('[role="alert"]')?.textContent).toContain(
      'Available ingredients could not be loaded',
    );
    await select('Latest');
    expect(names()).toHaveLength(3);
    expect(page.querySelector('[role="alert"]')).toBeNull();
  });
});
