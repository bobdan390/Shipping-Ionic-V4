import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenStatusValorarPageRoutingModule } from './orden-status-valorar-routing.module';

import { OrdenStatusValorarPage } from './orden-status-valorar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenStatusValorarPageRoutingModule
  ],
  declarations: [OrdenStatusValorarPage]
})
export class OrdenStatusValorarPageModule {}
