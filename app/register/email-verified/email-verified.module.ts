import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailVerifiedPageRoutingModule } from './email-verified-routing.module';

import { EmailVerifiedPage } from './email-verified.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailVerifiedPageRoutingModule
  ],
  declarations: [EmailVerifiedPage]
})
export class EmailVerifiedPageModule {}
