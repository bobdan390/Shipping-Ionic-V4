import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodoPagosPage } from './metodo-pago.page';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodoPagoPageRoutingModule {}
