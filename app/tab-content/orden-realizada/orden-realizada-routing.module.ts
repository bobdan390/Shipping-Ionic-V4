import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenRealizadaPage } from './orden-realizada.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenRealizadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenRealizadaPageRoutingModule {}
