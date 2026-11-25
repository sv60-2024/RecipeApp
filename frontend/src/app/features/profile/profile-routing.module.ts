import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Profile },
  { path: ':username', component: Profile },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}