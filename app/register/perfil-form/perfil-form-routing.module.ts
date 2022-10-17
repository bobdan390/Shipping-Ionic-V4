import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilFormPage } from './perfil-form.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilFormPageRoutingModule {}
