export type IngredientUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece';

export interface IngredientAmount {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: IngredientUnit;
}
