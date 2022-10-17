import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutExpressPageRoutingModule } from './checkout-express-routing.module';

import { CheckoutExpressPage } from './checkout-express.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutExpressPageRoutingModule
  ],
  declarations: [CheckoutExpressPage]
})
export class CheckoutExpressPageModule {}
