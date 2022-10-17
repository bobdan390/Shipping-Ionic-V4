import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenStatusCompletedPageRoutingModule } from './orden-status-completed-routing.module';

import { OrdenStatusCompletedPage } from './orden-status-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenStatusCompletedPageRoutingModule
  ],
  declarations: [OrdenStatusCompletedPage]
})
export class OrdenStatusCompletedPageModule {}
