import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { Home } from './home.component';

@NgModule({
  declarations: [Home],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
