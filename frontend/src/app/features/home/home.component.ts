import { Component, inject } from '@angular/core';
import { catchError, map, of, startWith } from 'rxjs';
import { RecipeService } from '../../core/services/recipe.service';
import { PopularRecipe } from '../../shared/models/recipe.model';
import { previousMonthStart, selectPopularRecipes } from './popular-recipes';

interface HomeState {
  status: 'loading' | 'ready' | 'error';
  recipes: PopularRecipe[];
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home {
  private readonly today = new Date();
  protected readonly ratingMonth = previousMonthStart(this.today);
  protected readonly state$ = inject(RecipeService)
    .getRecipes()
    .pipe(
      map((recipes): HomeState => ({
        status: 'ready',
        recipes: selectPopularRecipes(recipes, this.today),
      })),
      startWith<HomeState>({ status: 'loading', recipes: [] }),
      catchError(() => of<HomeState>({ status: 'error', recipes: [] })),
    );
}
