import { Component, inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { RecipeService } from '../../core/services/recipe.service';
import { InventoryService } from '../../core/services/inventory.service';
import { IngredientAmount } from '../../shared/models/ingredient.model';
import { PopularRecipe, RecipeSummary } from '../../shared/models/recipe.model';
import { previousMonthStart, selectPopularRecipes } from './popular-recipes';
import { selectCookableRecipes, selectLatestRecipes } from './recipe-selection';

type RecipeView = 'popular' | 'latest' | 'cookable';
interface DataState<T> {
  status: 'loading' | 'ready' | 'error';
  data: T[];
}
interface HomeRecipe {
  recipe: RecipeSummary;
  averageRating?: PopularRecipe['averageRating'];
  ratingCount?: number;
}
interface HomeState {
  status: 'loading' | 'ready' | 'error';
  recipes: HomeRecipe[];
  inventory: IngredientAmount[];
  error?: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home {
  private readonly today = new Date();
  private readonly view$ = new BehaviorSubject<RecipeView>('popular');
  protected selectedView: RecipeView = 'popular';
  protected readonly ratingMonth = previousMonthStart(this.today);
  protected readonly views: { id: RecipeView; label: string }[] = [
    { id: 'popular', label: 'Popular' },
    { id: 'latest', label: 'Latest' },
    { id: 'cookable', label: 'Can cook' },
  ];
  protected readonly viewCopy = {
    popular: {
      title: 'Popular recipes',
      list: 'Popular recipes, highest rated first',
      empty: 'No recipes were rated in the previous month.',
    },
    latest: {
      title: 'Latest recipes',
      list: 'Latest recipes, newest first',
      empty: 'No published recipes are available yet.',
    },
    cookable: {
      title: 'Recipes you can cook',
      list: 'Recipes you can cook, newest first',
      empty: 'No recipes can be prepared with your available ingredients.',
    },
  };

  private readonly recipes$ = inject(RecipeService)
    .getRecipes()
    .pipe(
      map((data): DataState<RecipeSummary> => ({ status: 'ready', data })),
      startWith<DataState<RecipeSummary>>({ status: 'loading', data: [] }),
      catchError(() => of<DataState<RecipeSummary>>({ status: 'error', data: [] })),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  // Subscribe only in Can cook, so inventory failure/loading never blocks Popular or Latest.
  private readonly inventory$ = inject(InventoryService)
    .getAvailableIngredients()
    .pipe(
      map((data): DataState<IngredientAmount> => ({ status: 'ready', data })),
      startWith<DataState<IngredientAmount>>({ status: 'loading', data: [] }),
      catchError(() => of<DataState<IngredientAmount>>({ status: 'error', data: [] })),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  protected readonly state$ = this.view$.pipe(
    switchMap((view) => {
      if (view !== 'cookable') {
        return this.recipes$.pipe(
          map((source): HomeState => ({
            status: source.status,
            inventory: [],
            error: 'Recipes could not be loaded. Please try again later.',
            recipes:
              view === 'popular'
                ? selectPopularRecipes(source.data, this.today)
                : selectLatestRecipes(source.data, new Date()).map((recipe) => ({ recipe })),
          })),
        );
      }
      return combineLatest([this.recipes$, this.inventory$]).pipe(
        map(([recipes, inventory]): HomeState => {
          if (recipes.status === 'error' || inventory.status === 'error') {
            return {
              status: 'error',
              recipes: [],
              inventory: [],
              error:
                recipes.status === 'error'
                  ? 'Recipes could not be loaded. Please try again later.'
                  : 'Available ingredients could not be loaded. Please try again later.',
            };
          }
          if (recipes.status === 'loading' || inventory.status === 'loading') {
            return { status: 'loading', recipes: [], inventory: [] };
          }
          return {
            status: 'ready',
            inventory: inventory.data,
            recipes: selectCookableRecipes(recipes.data, inventory.data, new Date()).map(
              (recipe) => ({ recipe }),
            ),
          };
        }),
      );
    }),
  );

  protected selectView(view: RecipeView): void {
    if (view === this.selectedView) return;
    this.selectedView = view;
    this.view$.next(view);
  }
}
