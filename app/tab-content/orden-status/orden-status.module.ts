import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenStatusPageRoutingModule } from './orden-status-routing.module';

import { OrdenStatusPage } from './orden-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenStatusPageRoutingModule
  ],
  declarations: [OrdenStatusPage]
})
export class OrdenStatusPageModule {}
