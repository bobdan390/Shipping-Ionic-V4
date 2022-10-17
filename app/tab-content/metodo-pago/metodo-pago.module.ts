import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';

import { MetodoPagoPageRoutingModule } from './metodo-pago-routing.module';

import { MetodoPagosPage } from './metodo-pago.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserModule,
    MetodoPagoPageRoutingModule
  ],
  declarations: [MetodoPagosPage]
})
export class MetodoPagosPageModule {}
