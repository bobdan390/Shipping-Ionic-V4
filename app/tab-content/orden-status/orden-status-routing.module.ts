import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenStatusPage } from './orden-status.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenStatusPageRoutingModule {}
