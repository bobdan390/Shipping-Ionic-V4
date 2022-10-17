import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificarOrdenPage } from './verificar-orden.page';

const routes: Routes = [
  {
    path: '',
    component: VerificarOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificarOrdenPageRoutingModule {}
