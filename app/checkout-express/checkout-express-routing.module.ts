import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutExpressPage } from './checkout-express.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutExpressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutExpressPageRoutingModule {}
