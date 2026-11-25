export interface RecipeRating {
  value: number;
  ratedAt: string;
}

export interface RecipeSummary {
  id: number;
  name: string;
  description: string;
  author: string;
  preparationMinutes: number;
  servings: number;
  ratings: RecipeRating[];
}

export interface PopularRecipe {
  recipe: RecipeSummary;
  averageRating: number;
  ratingCount: number;
}
