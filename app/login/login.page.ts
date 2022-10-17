import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../services/global.service';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  correo = "";
  password = "";
  cargando = false;
  token = "este es un token 2";
  global:any;

  constructor(
  	private GlobalService: GlobalService,
    private toastCtrl: ToastController,
    private router: Router,
    private storage: Storage,
    private fcm: FCM,
    private iab: InAppBrowser,
    public platform: Platform, 
    private alertController: AlertController, 
    private loading: LoadingController,
    private market: Market
  ) {
    this.global = GlobalService;
    this.fcm.getToken().then(token => {
        this.token = token;
    });

    this.platform.backButton.subscribeWithPriority(0, () => {
      
    });
  }

  ngOnInit() {
  }


  async openUpdate() {

   const alert = await this.alertController.create({
      header: 'Hay una nueva version de Shipping',
      subHeader: '',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Actualizar',
          handler: () => {
            if (this.platform.is('android')) {
              this.market.open('io.shipping.app');
            }
            if (this.platform.is('ios')) {

              const options: InAppBrowserOptions = {
                zoom: 'no',
                fullscreen: "yes",
                hidenavigationbuttons: "no",
                toolbar:'no',
                hideurlbar: 'yes',
              }

              let url = "https://apps.apple.com/us/app/shipping/id1548372959";
              this.iab.create(url,'_blank', { toolbar: 'no',  hideurlbar: 'yes', fullscreen: "yes",location:"no", options});

            }

          }
        }
      ]
    });

    await alert.present();
     
  }

  ionViewWillEnter() {
      this.storage.get('userSession').then(async (userSession) => {
        
        if(userSession != null) {

          const load = await this.loading.create({
            message: "Espere..."
          });
          await load.present();

          this.GlobalService._post("version", {
            state: userSession.state
          }).subscribe(result => {
              load.dismiss();

              //check version
              if (result && result.action) {
                if (result.data.version_text != "0.0.11") {
                  this.openUpdate();
    
                  return;
                }

                userSession.delivery_base_3km = result.data.data.DELIVERY_BASE_3km;
                userSession.coste_gasto_gestion = result.data.data.COSTE_GASTO_GESTION;
                userSession.delivery_fuera_base_3km= result.data.data.DELIVERY_FUERA_BASE_3km;
                userSession.limite_gasto_gestion= result.data.data.LIMITE_GASTO_GESTION;
                userSession.rider_delivery_base_3km= result.data.data.RIDER_DELIVERY_BASE_3km;
                userSession.rider_delivery_fuera_base_3km= result.data.data.RIDER_DELIVERY_FUERA_BASE_3km;

                //redireccion si login
                this.storage.set('userSession', userSession).then(() => {
                  this.storage.get('proceedTo').then((checkout) => {
                    if(checkout == true) {
                      this.router.navigateByUrl('/checkout');
                      this.storage.remove('proceedTo');
                    } else {
                      this.router.navigateByUrl('/tabs/tabs/categories');
                    }
                  })
                  this.storage.get('proceedTo-express').then((checkout) => {
                    if(checkout == true) {
                      this.router.navigateByUrl('/checkout-express');
                      this.storage.remove('proceedTo-express');
                    } else {
                      this.router.navigateByUrl('/tabs/tabs/categories');
                    }
                  }) 
                });
              }
          });
        }
      })  
  }


  login() {
  	if (this.correo != "" && this.password != "" && this.cargando == false) {
  		this.cargando = true;
  		
  		this.GlobalService._post("users/login", {"email": this.correo, "password": this.password, "token": this.token}).subscribe(result => { 
		  	if(result){
	          if (result.action == "success") {
	            this.cargando = false;
              
              this.storage.get('proceedTo').then((checkout) => {
                if(checkout == true) {
                  this.storage.set('userSession', result.userSession).then(() => {
                    this.router.navigateByUrl('/checkout');
                    this.storage.remove('proceedTo');
                });
                } else {
                    this.storage.set('userSession', result.userSession).then(() => {
                      this.router.navigateByUrl('/tabs/tabs/categories');
                  });
                }
              })

              this.storage.get('proceedTo-express').then((checkout) => {
                if(checkout == true) {
                  this.storage.set('userSession', result.userSession).then(() => {
                    this.router.navigateByUrl('/checkout-express');
                    this.storage.remove('proceedTo-express');
                });
                } 
              })

              console.log(this.storage.get('userSession'));

	          }else{
	            this.showToast(result.msg);
	            this.cargando = false;
	          }
	        }else{
	          this.showToast("Error en el proceso, intentelo nuevamente!");
	          this.cargando = false;
	        }
	  	});
  	}
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top'
    }).then(toast => toast.present());
  }

  recover(){
    const options: InAppBrowserOptions = {
      zoom: 'no',
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar:'no',
      hideurlbar: 'yes',
    }

    //send dev=true for develope
    let url = this.global.base + "password/reset";
    this.iab.create(url,'_blank', { toolbar: 'no',  hideurlbar: 'yes', fullscreen: "yes",location:"no", options});
  }

}
