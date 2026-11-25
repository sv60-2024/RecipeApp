import { PopularRecipe, RecipeSummary } from '../../shared/models/recipe.model';

// Local calendar boundaries: [first day of previous month, first day of this month).
export function previousMonthStart(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
}

export function selectPopularRecipes(recipes: RecipeSummary[], now: Date): PopularRecipe[] {
  const start = previousMonthStart(now).getTime();
  const end = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return recipes
    .map((recipe): PopularRecipe => {
      const ratings = recipe.ratings.filter((rating) => {
        const time = new Date(rating.ratedAt).getTime();
        return (
          time >= start &&
          time < end &&
          Number.isFinite(rating.value) &&
          rating.value >= 1 &&
          rating.value <= 5
        );
      });

      return {
        recipe,
        averageRating: ratings.length
          ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
          : 0,
        ratingCount: ratings.length,
      };
    })
    .filter((item) => item.ratingCount > 0)
    .sort(
      (a, b) =>
        b.averageRating - a.averageRating ||
        b.ratingCount - a.ratingCount ||
        a.recipe.name.localeCompare(b.recipe.name),
    );
}
