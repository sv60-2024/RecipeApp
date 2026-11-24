import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { Admin } from './admin.component';
import { CatalogPage } from './catalog-page/catalog-page.component';

@NgModule({
  declarations: [Admin, CatalogPage],
  imports: [CommonModule, AdminRoutingModule, MatTabsModule, SharedModule],
})
export class AdminModule {}
