import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenValorarPage } from './orden-valorar.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenValorarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenValorarPageRoutingModule {}
