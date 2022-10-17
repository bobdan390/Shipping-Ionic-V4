import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilFormPageRoutingModule } from './perfil-form-routing.module';

import { PerfilFormPage } from './perfil-form.page';

//import {MetodoPagoPageModule} from '../map-modal/metodo-pago.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilFormPageRoutingModule,
    //MetodoPagoPageModule
  ],
  declarations: [PerfilFormPage]
})
export class PerfilFormPageModule {}
