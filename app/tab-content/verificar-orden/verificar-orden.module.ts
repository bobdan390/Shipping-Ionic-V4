import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificarOrdenPageRoutingModule } from './verificar-orden-routing.module';

import { VerificarOrdenPage } from './verificar-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificarOrdenPageRoutingModule
  ],
  declarations: [VerificarOrdenPage]
})
export class VerificarOrdenPageModule {}
