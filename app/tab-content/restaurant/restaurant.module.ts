import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantPageRoutingModule } from './restaurant-routing.module';

import { RestaurantPage } from './restaurant.page';
import { MenuPictureComponent } from '../product-modal/menu-picture.component';

@NgModule({
  entryComponents: [MenuPictureComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantPageRoutingModule
  ],
  declarations: [RestaurantPage, MenuPictureComponent]
})
export class RestaurantPageModule {}
