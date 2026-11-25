import { RecipeSummary } from '../../shared/models/recipe.model';
import { previousMonthStart, selectPopularRecipes } from './popular-recipes';

const recipe = (id: number, ratings: RecipeSummary['ratings']): RecipeSummary => ({
  id,
  name: `Recipe ${id}`,
  description: '',
  author: 'Marko',
  preparationMinutes: 20,
  servings: 2,
  ratings,
});

describe('Popular recipes', () => {
  const now = new Date(2026, 10, 25);
  const rated = (value: number, date: Date) => ({ value, ratedAt: date.toISOString() });
  const october = (value: number) => rated(value, new Date(2026, 9, 15));

  it('ranks by previous-month average, not total stars or number of ratings', () => {
    const result = selectPopularRecipes(
      [
        recipe(1, [october(4), october(4), october(4)]),
        recipe(2, [october(5), october(4)]),
        recipe(3, [october(5)]),
      ],
      now,
    );
    expect(result.map((item) => item.recipe.id)).toEqual([3, 2, 1]);
    expect(result[1].averageRating).toBe(4.5);
    expect(result[1].ratingCount).toBe(2);
  });

  it('includes the previous month start and excludes current month and older ratings', () => {
    const result = selectPopularRecipes(
      [
        recipe(1, [
          rated(1, new Date(2026, 8, 30, 23, 59, 59, 999)),
          rated(4, new Date(2026, 9, 1)),
          rated(5, new Date(2026, 9, 31, 23, 59, 59, 999)),
          rated(1, new Date(2026, 10, 1)),
        ]),
      ],
      now,
    );
    expect(result[0].ratingCount).toBe(2);
    expect(result[0].averageRating).toBe(4.5);
  });

  it('uses December of the previous year when today is in January', () => {
    const january = new Date(2027, 0, 20);
    expect(previousMonthStart(january)).toEqual(new Date(2026, 11, 1));
    const result = selectPopularRecipes(
      [recipe(1, [rated(5, new Date(2026, 11, 31))]), recipe(2, [rated(5, new Date(2027, 0, 1))])],
      january,
    );
    expect(result.map((item) => item.recipe.id)).toEqual([1]);
  });

  it('excludes unrated recipes and invalid ratings', () => {
    expect(
      selectPopularRecipes(
        [
          recipe(1, []),
          recipe(2, [rated(5, now)]),
          recipe(3, [october(0), october(6), { value: 5, ratedAt: 'invalid' }]),
        ],
        now,
      ),
    ).toEqual([]);
  });

  it('does not change the source recipe order or ratings', () => {
    const source = [recipe(1, [october(3)]), recipe(2, [october(5)])];
    const original = JSON.stringify(source);
    selectPopularRecipes(source, now);
    expect(JSON.stringify(source)).toBe(original);
  });
});
