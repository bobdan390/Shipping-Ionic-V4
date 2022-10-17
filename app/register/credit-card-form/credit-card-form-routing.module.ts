import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditCardFormPage } from './credit-card-form.page';

const routes: Routes = [
  {
    path: '',
    component: CreditCardFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardFormPageRoutingModule {}
