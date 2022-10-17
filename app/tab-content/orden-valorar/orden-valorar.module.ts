import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenValorarPageRoutingModule } from './orden-valorar-routing.module';

import { OrdenValorarPage } from './orden-valorar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenValorarPageRoutingModule
  ],
  declarations: [OrdenValorarPage]
})
export class OrdenValorarPageModule {}
