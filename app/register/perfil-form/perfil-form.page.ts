import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from './../../services/global.service';
import { Storage } from '@ionic/storage';
import { FCM } from '@ionic-native/fcm/ngx';

import { ModalController } from '@ionic/angular';
import { MetodoPagoPage } from '../map-modal/metodo-pago.page';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.page.html',
  styleUrls: ['./perfil-form.page.scss'],
})
export class PerfilFormPage implements OnInit {
  
  name = "";
  phone = "";
  address = "";
  loading = false;
  email = "";
  token = "este es un token";
  lat= 0.0;
  long= 0.0;
  password="";
  state="";

  constructor(
  	private GlobalService: GlobalService,
  	private router: Router, 
  	private toastCtrl: ToastController,
  	private storage: Storage,
    private fcm: FCM,
    public modalController: ModalController
  ) {
  	this.storage.get('email-verified').then(email => {
  		this.email = email;
  	});

    this.fcm.getToken().then(token => {
        this.token = token;
    });
  }

  ngOnInit() {
  }

  completar(){
  	if (this.name!="" && this.phone!="" && this.address!="" && this.lat!=0.0 && this.password!="") {
  		this.loading = true;
  		let data = {
  			email: this.email, 
  			name: this.name, 
  			phone: this.phone, 
  			address: this.address,
        id_user:0,
        token: this.token,
        lat: this.lat,
        long: this.long,
        password: this.password,
        state: this.state  
  		}
  		this.GlobalService._post("users/guardar", data).subscribe(result => { 
	  		this.loading = false;
	  		if (result) {
	  			if (result.action == "success") {
	  				this.showToast(result.msg);	
            data.id_user = result.id_user;
	  				this.storage.set('userSession', data).then(() => {
			             this.router.navigateByUrl('/tabs/tabs/categories');
			        });
	  			}else{
	  				this.showToast("Error inesperado, intentelo nuevamente!");
	  			}
	  		}
	  		
		  });
  	}else{
  		this.showToast("Rellena los datos adecuadamente!");
  	}
  	
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top'
    }).then(toast => toast.present());
  }


  async presentModal(){

    const modal = await this.modalController.create({
      component: MetodoPagoPage
    });


    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data && data.data.coords){
        this.address = data.data.adress;
        this.lat = data.data.coords[0];
        this.long = data.data.coords[1];
        this.state = data.data.state;
      }
    })


    return await modal.present();

  }

}
