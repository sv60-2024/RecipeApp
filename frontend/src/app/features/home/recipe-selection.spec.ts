import { IngredientAmount } from '../../shared/models/ingredient.model';
import { RecipeSummary } from '../../shared/models/recipe.model';
import { selectCookableRecipes, selectLatestRecipes } from './recipe-selection';

const now = new Date('2026-11-25T12:00:00Z');
const ingredient = (
  ingredientId: number,
  quantity: number,
  unit: IngredientAmount['unit'] = 'g',
): IngredientAmount => ({
  ingredientId,
  name: `Ingredient ${ingredientId}`,
  quantity,
  unit,
});
const recipe = (
  id: number,
  ingredients: IngredientAmount[],
  publishedAt = '2026-11-24T12:00:00Z',
): RecipeSummary => ({
  id,
  name: `Recipe ${id}`,
  description: '',
  author: 'Marko',
  preparationMinutes: 20,
  servings: 2,
  ratings: [],
  publishedAt,
  ingredients,
});

describe('Latest recipes', () => {
  it('orders by publication time, not id or rating, without changing the source array', () => {
    const recipes = [
      recipe(1, [], '2026-11-20T10:00:00Z'),
      recipe(2, [], '2026-11-24T09:00:00Z'),
      recipe(3, [], '2026-11-24T18:00:00Z'),
    ];
    const before = JSON.stringify(recipes);
    expect(selectLatestRecipes(recipes, now).map((r) => r.id)).toEqual([3, 2, 1]);
    expect(JSON.stringify(recipes)).toBe(before);
  });

  it('excludes invalid and future publication dates and handles an empty source', () => {
    expect(
      selectLatestRecipes(
        [
          recipe(1, [], 'invalid'),
          recipe(2, [], '2026-12-01T12:00:00Z'),
          recipe(3, [], now.toISOString()),
        ],
        now,
      ).map((r) => r.id),
    ).toEqual([3]);
    expect(selectLatestRecipes([], now)).toEqual([]);
  });
});

describe('Cookable recipes', () => {
  it('requires every ingredient, not just one matching ingredient', () => {
    const recipes = [
      recipe(1, [ingredient(1, 100), ingredient(2, 50)]),
      recipe(2, [ingredient(1, 100)]),
    ];
    expect(selectCookableRecipes(recipes, [ingredient(1, 200)], now).map((r) => r.id)).toEqual([2]);
  });

  it('rejects insufficient quantities and accepts exact quantities', () => {
    const recipes = [recipe(1, [ingredient(1, 200)]), recipe(2, [ingredient(1, 201)])];
    expect(selectCookableRecipes(recipes, [ingredient(1, 200)], now).map((r) => r.id)).toEqual([1]);
  });

  it('converts kg to g and liters to ml, including decimal quantities', () => {
    const recipes = [
      recipe(1, [ingredient(1, 500), ingredient(2, 0.25, 'l')]),
      recipe(2, [ingredient(1, 501)]),
    ];
    expect(
      selectCookableRecipes(recipes, [ingredient(1, 0.5, 'kg'), ingredient(2, 250, 'ml')], now).map(
        (r) => r.id,
      ),
    ).toEqual([1]);
  });

  it('does not equate different ingredients or incompatible units', () => {
    const recipes = [recipe(1, [ingredient(1, 1, 'piece')]), recipe(2, [ingredient(2, 100)])];
    expect(selectCookableRecipes(recipes, [ingredient(1, 1000)], now)).toEqual([]);
  });

  it('sums duplicate stock and repeated requirements without double counting', () => {
    const recipes = [
      recipe(1, [ingredient(1, 100), ingredient(1, 150)]),
      recipe(2, [ingredient(1, 100), ingredient(1, 151)]),
    ];
    const stock = [ingredient(1, 200), ingredient(1, 0.05, 'kg')];
    const before = JSON.stringify({ recipes, stock });
    expect(selectCookableRecipes(recipes, stock, now).map((r) => r.id)).toEqual([1]);
    expect(JSON.stringify({ recipes, stock })).toBe(before);
  });

  it('returns no recipes for empty/invalid stock or missing/invalid requirements', () => {
    const recipes = [
      recipe(1, [ingredient(1, 100)]),
      recipe(2, []),
      recipe(3, [ingredient(1, -1)]),
      recipe(4, [ingredient(1, NaN)]),
    ];
    expect(selectCookableRecipes(recipes, [], now)).toEqual([]);
    expect(
      selectCookableRecipes(
        recipes,
        [ingredient(1, 0), ingredient(1, -5), ingredient(1, NaN)],
        now,
      ),
    ).toEqual([]);
    expect(selectCookableRecipes(recipes.slice(1), [ingredient(1, 1000)], now)).toEqual([]);
  });

  it('sorts matches newest first and evaluates each recipe independently without consuming stock', () => {
    const recipes = [
      recipe(1, [ingredient(1, 100)], '2026-11-20T12:00:00Z'),
      recipe(2, [ingredient(1, 100)], '2026-11-24T12:00:00Z'),
    ];
    expect(selectCookableRecipes(recipes, [ingredient(1, 100)], now).map((r) => r.id)).toEqual([
      2, 1,
    ]);
  });
});
