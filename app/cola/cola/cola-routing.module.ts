import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColaPage } from './cola.page';

const routes: Routes = [
  {
    path: '',
    component: ColaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColaPageRoutingModule {}
