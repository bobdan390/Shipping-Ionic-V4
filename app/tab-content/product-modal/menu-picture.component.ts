import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { GlobalService } from './../../services/global.service';

@Component({
  selector: 'app-menu-picture',
  templateUrl: './menu-picture.component.html',
  styleUrls: ['./menu-picture.component.scss'],
})
export class MenuPictureComponent implements OnInit {

  item:any;
  global:any;
  qty = 1;
  total = 0.0;
  constructor(
    private GlobalService: GlobalService,
    private popoverCtrl: PopoverController,
    public navParams: NavParams
  ) {
    this.global = this.GlobalService;
    this.item = this.navParams.get('item');
    this.total = parseFloat(this.item.price);
  }

  ngOnInit() {
    
  }

  async close() {
    try {
            await this.popoverCtrl.dismiss({qty: 0});
        } catch (e) {
            //click more than one time popover throws error, so ignore...
        }
  }

  async addCart() {
    try {
            await this.popoverCtrl.dismiss({qty: this.qty, total: this.total});
        } catch (e) {
            //click more than one time popover throws error, so ignore...
        }
  }

  minus(){
    this.qty = (this.qty - 1) < 1 ? 1 : (this.qty - 1) ;
    this.setPrice();
  }

  add(){
    this.qty = this.qty + 1;
    this.setPrice();
  }

  setPrice(){
    this.total = this.item.price * this.qty;
  }

}
