import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColaPageRoutingModule } from './cola-routing.module';

import { ColaPage } from './cola.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColaPageRoutingModule
  ],
  declarations: [ColaPage]
})
export class ColaPageModule {}
