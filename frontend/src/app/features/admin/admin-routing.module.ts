import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin.component';
import { AllergenTable } from './allergen-table/allergen-table.component';

const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: '', redirectTo: 'allergens', pathMatch: 'full' },
      { path: 'allergens', component: AllergenTable },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}