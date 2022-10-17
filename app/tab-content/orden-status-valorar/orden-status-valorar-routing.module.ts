import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenStatusValorarPage } from './orden-status-valorar.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenStatusValorarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenStatusValorarPageRoutingModule {}
