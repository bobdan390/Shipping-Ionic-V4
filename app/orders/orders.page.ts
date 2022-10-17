import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { GlobalService } from './../services/global.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  global:any;
  ordenes = [];
  loading=false;
  constructor(
  	private GlobalService: GlobalService,
  	private storage: Storage,
    private router: Router,
    private toastCtrl: ToastController
  ) {
  	this.global = this.GlobalService;
  }

  ngOnInit() {
  }

  formatear(val): string | number {
    let x:any;

    if (typeof val == "number") {
      x = val.toFixed(2);
    }else{
      let y = parseFloat(val);
      x = y.toFixed(2);
    }

    return x;
  }

  ionViewWillEnter() {
    this.storage.get('userSession').then((userSession) => {
      console.log(userSession);
      if(userSession != null){
        this.loading=true;
      this.GlobalService._post("orders/getmyorders", {user_id: userSession.id_user}).subscribe(ordenes => {
        this.loading=false;
        this.ordenes = ordenes.reverse();
      })
      } else {
        this.toastCtrl.create({
          message: "Por favor, inicie sesión primero",
          duration: 3000,
          position: 'top'
        }).then(toast => toast.present());
        this.router.navigateByUrl('/login')
      }
      
    });
  }

  toStatus(orden){
    
    console.log(orden);
  	this.storage.set('setOrderDetail', orden).then(() => {

      if (orden.isShipping) {
        if (parseInt(orden.status_orden) <= 1) {
            this.router.navigateByUrl('status-express');
        }

        if (parseInt(orden.status_orden) == 2) {
            this.router.navigateByUrl('orden-status-valorar');
        }
        
        if (parseInt(orden.status_orden) == 3) {
            this.router.navigateByUrl('order-details');
        }

      }else{

        if (orden.isCola) {
          if (parseInt(orden.status_orden) <= 1) {
              this.router.navigateByUrl('status-cola');
          }

          if (parseInt(orden.status_orden) == 2) {
              this.router.navigateByUrl('orden-status-valorar');
          }
          
          if (parseInt(orden.status_orden) == 3) {
              this.router.navigateByUrl('order-details');
          }
        }else{
          if (parseInt(orden.status_orden) == 5) {
              this.router.navigateByUrl('orden-status-completed');
          }

          if (parseInt(orden.status_orden) == 4) {
              this.router.navigateByUrl('orden-status-valorar');
          }

          if (parseInt(orden.status_orden) <= 3) {
              this.router.navigateByUrl('orden-status');
          }

          if (parseInt(orden.status_orden) == 6) {
              this.router.navigateByUrl('order-details');
          }          
        }


      }

    });
    
  }

}
