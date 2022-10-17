import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenStatusCompletedPage } from './orden-status-completed.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenStatusCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenStatusCompletedPageRoutingModule {}
