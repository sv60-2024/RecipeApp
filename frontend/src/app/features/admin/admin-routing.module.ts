import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ADMIN_CATALOGS } from './admin-catalogs';
import { Admin } from './admin.component';
import { CatalogPage } from './catalog-page/catalog-page.component';

const routes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: '', redirectTo: ADMIN_CATALOGS[0].kind, pathMatch: 'full' },
      ...ADMIN_CATALOGS.map((catalog) => ({
        path: catalog.kind,
        component: CatalogPage,
        data: { catalog },
      })),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
