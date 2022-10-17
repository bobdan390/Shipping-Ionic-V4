import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenRealizadaPageRoutingModule } from './orden-realizada-routing.module';

import { OrdenRealizadaPage } from './orden-realizada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenRealizadaPageRoutingModule
  ],
  declarations: [OrdenRealizadaPage]
})
export class OrdenRealizadaPageModule {}
