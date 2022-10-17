import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from './../../services/global.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MetodoPagoPage } from '../../register/map-modal/metodo-pago.page';

declare var google;

@Component({
  selector: 'app-cola',
  templateUrl: './cola.page.html',
  styleUrls: ['./cola.page.scss'],
})
export class ColaPage implements OnInit {


  @ViewChild('expressMap',  {static: false}) mapElement: ElementRef;
  itemMap: any;
  global:any;
  metodos:[];
  loading=false;
  object="";

  origin_lat=0.0;
  origin_long=0.0;
  origin_address="";

  finish_lat=0.0;
  finish_long=0.0;
  finish_address="";

  total:number= 0.0;
  delivery:number= 0.0;
  subtotal:number= 0.0;
  distance:number= 0.0;
  propina:number= 0.0;
  routing:any;
  userSession:any;
  gain_rider:number=0.0;

  directionsService:any;
  directionsRenderer:any;

  markerOrigin:any;
  markerFinish:any;

  loadinCupon = false;
  btnCupon = "Aplicar cupón";
  cupon=null;
  descuento = 0.0;

  recibe = "";
  cambio = 0.0;
  totalCambio = 0.0;
  nota = "";
  cola_km = 0.0;
  rider_cola_km = 0.0;
  tipo: "Automóvil";

  constructor(
  	private storage: Storage,
    private GlobalService: GlobalService, 
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private router: Router,
    public modalController: ModalController
  ) {
  	this.global = GlobalService;
  }

  ngOnInit() {
  }

  formatear(val): string | number {
    let x:any;

    if (typeof val == "number") {
      x = val.toFixed(2);
    }else{
      x = val;
    }

    return x;
  }

  formatearBs(val): string | number {
    let x:any;

    const formatter = new Intl.NumberFormat('es-ES', {
       minimumFractionDigits: 2,      
       maximumFractionDigits: 2,
    });

    x = formatter.format(val);
    //console.log(x);
    return x;
  }

  ionViewDidEnter() {

    this.storage.get('userSession').then((userSession) => {
        if(userSession != null) {
          console.log(userSession);
          this.userSession = userSession;

          let mapOptions = {
              center: new google.maps.LatLng(userSession.lat, userSession.long),
              zoom: 13,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              mapTypeControl:false,
              fullscreenControl: false,
              streetViewControl: false,
              zoomControl: false
          } 

          this.itemMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

          this.directionsService = new google.maps.DirectionsService();
          this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true
          });
          this.directionsRenderer.setMap(this.itemMap);
        } 
    });

   }


   async map(side){

    const modal = await this.modalController.create({
      component: MetodoPagoPage
    });


    modal.onDidDismiss().then((data) => {
      console.log(data);

      if(data.data && data.data.coords){
      	if(side=="origin"){

      		this.origin_address = data.data.adress;
	        this.origin_lat = data.data.coords[0];
	        this.origin_long = data.data.coords[1];

      	}else{

      		this.finish_address = data.data.adress;
	        this.finish_lat = data.data.coords[0];
	        this.finish_long = data.data.coords[1];

      	}

      	if (this.origin_address != "" && this.finish_address!="") {

      	  let distance = 0.0;

          let request = {
            origin: new google.maps.LatLng(this.origin_lat, this.origin_long),
            destination: new google.maps.LatLng(this.finish_lat, this.finish_long),
            travelMode: 'DRIVING'
          };

          console.log();
          this.GlobalService._post("distance", {lat1: this.origin_lat, long1: this.origin_long, lat2: this.finish_lat, long2: this.finish_long, state: this.userSession.state}).subscribe(async distance => {
                if (distance.action == "success") {
                  this.distance = distance.data?.routes[0].legs[0].distance?.value / 1000;
                  this.cambio = distance.cambio;
                  this.cola_km = distance.cola_km;
                  this.setPrice();
                }
          });

          
          this.directionsService.route(request, (result, status) => {
            if (status == 'OK') {
              //distance = result.routes[0].legs[0].distance.value/1000;
              this.directionsRenderer.setDirections(result);

	          //this.distance = distance;
	          //this.setPrice();

            }
          });
          

          if (this.markerOrigin) {
            this.markerOrigin.setMap(null);
          }
          

          this.markerOrigin = new google.maps.Marker({
              position: new google.maps.LatLng(this.origin_lat, this.origin_long),
              title: "Origen de la encomienda",
              icon: "../../../assets/images/ping.png"
          });

          this.markerOrigin.setMap(this.itemMap);

          if (this.markerFinish) {
            this.markerFinish.setMap(null);
          }

          this.markerFinish = new google.maps.Marker({
              position: new google.maps.LatLng(this.finish_lat, this.finish_long),
              title: "Llegada de la encomienda",
              icon: "../../../assets/images/ping.png"
          });

          this.markerFinish.setMap(this.itemMap);

      	}
        
      }
    })


    return await modal.present();

  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    //this.itemMap.remove();
  }


  setPrice(){
  	this.total = 0;

    this.delivery = this.distance * this.cola_km;

    let s1 = this.delivery + this.propina - this.descuento;
  	this.subtotal = s1;
    this.totalCambio = this.subtotal * this.cambio;

    this.gain_rider =  parseFloat(this.userSession.rider_delivery_base_3km);
    if (this.distance > 3) {
      let nDistance2 = parseFloat(this.userSession.rider_delivery_fuera_base_3km) * (this.distance - 3);
      this.gain_rider += nDistance2;
    }
    this.gain_rider += this.propina;

  }

  async propinaF() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ingrese la propina para el rider!',
      inputs: [
        {
          name: 'propina',
          type: 'number',
          min: 0,
          max: 100,
          placeholder:"0.0"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (input) => {
            console.log(input);
            if (input && input.propina != "") {
            	this.propina = parseFloat(input.propina);
            	this.setPrice();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  goto(){

    let data = {
      origin_lat:this.origin_lat,
      origin_long:this.origin_long,
      origin_address:this.origin_address,

      finish_lat:this.finish_lat,
      finish_long:this.finish_long,
      finish_address:this.finish_address,

      gain_rider: this.gain_rider.toFixed(2),
      total: this.subtotal,
      object: this.object,
      cupon_id: this.cupon ? this.cupon.id : null,
      nota: this.nota,
      tipo: this.tipo
    };

    console.log(data);

    this.storage.set('ColaInCart', data);
    this.router.navigateByUrl('checkout-cola');
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    }).then(toast => toast.present());
  }

  async codigo(){
    const alert = await this.alertController.create({
        message: '<h4>Ingrese el codigo promocional: </h4>',
        backdropDismiss: false,
        inputs: [
        {
            name: 'codigo',
            type: 'text',
            placeholder: "Ingrese codigo"
        }],
        buttons: [
                    {
                      text: 'Cancelar',
                      handler: () => {
                        this.cupon = null;
                        this.btnCupon = "Aplicar cupón";
                        this.descuento = 0.0;
                        this.setPrice();
                      }
                    },
                    {
                      text: 'Canjear',
                      handler: (codigo) => {
                        if (codigo.codigo != "") {
                           this.loadinCupon = true;
                           this.GlobalService._post("cupon/verCupon", {codigo: codigo}).subscribe(async codigoResponse => {
                               this.loadinCupon = false;
                               if (codigoResponse) {
                                 if (codigoResponse.action == "success") {

                                   if (this.subtotal >= parseFloat(codigoResponse.cupon.price_min)) {
                                     
                                     const alert = await this.alertController.create({
                                        message: '<div class="text-center w-100"><h5>Cupón: '+codigoResponse.cupon.nombre+' </h5> <h6 class="text-left mt-3">Descuento: $'+parseFloat(codigoResponse.cupon.price).toFixed(2)+' </h6> <h6 class="text-left">Monto min.: $'+codigoResponse.cupon.price_min+' </h6> <h6 class="text-left mt-3 text-success">Monto valido!</h6> </div>',
                                        backdropDismiss: false,
                                        buttons: [
                                                    {
                                                      text: 'Aplicar',
                                                      handler: () => {
                                                        this.cupon = codigoResponse.cupon;
                                                        this.btnCupon = "Cupón: " + codigoResponse.cupon.nombre;
                                                        this.descuento =  parseFloat(codigoResponse.cupon.price);
                                                        this.setPrice();
                                                      }
                                                     }
                                                    
                                                 ]
                                      });

                                      await alert.present();

                                   }else{

                                     const alert = await this.alertController.create({
                                        message: '<div class="text-center w-100"><h5>Cupón: '+codigoResponse.cupon.nombre+' </h5> <h6 class="text-left mt-3">Monto: $'+parseFloat(codigoResponse.cupon.price_min).toFixed(2)+' </h6> <h6 class="text-left">Monto min.: $'+codigoResponse.cupon.price_min+' </h6> <h6 class="text-left mt-3 text-danger">Monto no valido!</h6> </div>',
                                        backdropDismiss: false,
                                        buttons: [
                                                    {
                                                      text: 'Ok',
                                                      handler: () => {

                                                      }
                                                     }
                                                    
                                                 ]
                                      });

                                      await alert.present();


                                   }

                                 }else{
                                   this.showToast(codigoResponse.msg);
                                 }
                               }else{
                                 this.showToast("Error en el proceso, intentelo nuevamente!");
                               }

                           });

                        }else{
                          this.showToast("Ingrese un codigo valido!");
                        }
                      }
                     }
                    
                 ]
  });

  await alert.present();
  }


}
