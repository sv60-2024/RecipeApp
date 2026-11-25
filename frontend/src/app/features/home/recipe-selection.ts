import { IngredientAmount } from '../../shared/models/ingredient.model';
import { RecipeSummary } from '../../shared/models/recipe.model';

export function selectLatestRecipes(recipes: RecipeSummary[], now: Date): RecipeSummary[] {
  return recipes
    .filter((recipe) => {
      const published = new Date(recipe.publishedAt).getTime();
      return Number.isFinite(published) && published <= now.getTime();
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() || a.id - b.id,
    );
}

function baseAmount(item: IngredientAmount): { key: string; quantity: number } | null {
  if (!Number.isFinite(item.quantity) || item.quantity <= 0) return null;
  switch (item.unit) {
    case 'g':
      return { key: `${item.ingredientId}:g`, quantity: item.quantity };
    case 'kg':
      return { key: `${item.ingredientId}:g`, quantity: item.quantity * 1000 };
    case 'ml':
      return { key: `${item.ingredientId}:ml`, quantity: item.quantity };
    case 'l':
      return { key: `${item.ingredientId}:ml`, quantity: item.quantity * 1000 };
    case 'piece':
      return { key: `${item.ingredientId}:piece`, quantity: item.quantity };
    default:
      return null;
  }
}

export function selectCookableRecipes(
  recipes: RecipeSummary[],
  available: IngredientAmount[],
  now: Date,
): RecipeSummary[] {
  const stock = new Map<string, number>();
  for (const ingredient of available) {
    const amount = baseAmount(ingredient);
    if (amount) stock.set(amount.key, (stock.get(amount.key) ?? 0) + amount.quantity);
  }

  return selectLatestRecipes(recipes, now).filter((recipe) => {
    // An incomplete recipe without ingredient requirements must not match every inventory.
    if (!recipe.ingredients.length) return false;
    const required = new Map<string, number>();
    for (const ingredient of recipe.ingredients) {
      const amount = baseAmount(ingredient);
      if (!amount) return false;
      required.set(amount.key, (required.get(amount.key) ?? 0) + amount.quantity);
    }
    return [...required].every(([key, quantity]) => (stock.get(key) ?? 0) + 1e-9 >= quantity);
  });
}
