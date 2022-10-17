import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditCardFormPageRoutingModule } from './credit-card-form-routing.module';

import { CreditCardFormPage } from './credit-card-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditCardFormPageRoutingModule
  ],
  declarations: [CreditCardFormPage]
})
export class CreditCardFormPageModule {}
