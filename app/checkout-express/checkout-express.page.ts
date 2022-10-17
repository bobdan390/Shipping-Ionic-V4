import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from './../services/global.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { MetodoPagosPage } from '../tab-content/metodo-pago/metodo-pago.page';
declare var google;

@Component({
  selector: 'app-checkout-express',
  templateUrl: './checkout-express.page.html',
  styleUrls: ['./checkout-express.page.scss'],
})
export class CheckoutExpressPage implements OnInit {
   
  @ViewChild('expressMap',  {static: false}) mapElement: ElementRef;
  itemMap: any;
  global:any;
  metodos:any;
  loading=false;
  object="";

  origin_lat=0.0;
  origin_long=0.0;
  origin_address="";

  finish_lat=0.0;
  finish_long=0.0;
  finish_address="";

  total = 0;
  delivery = 0;
  subtotal = 0;
  distance = 0.0;
  propina = 0.0;
  ExpressInCart:any;
  gain_rider=0.0;
  user_id=0;
  routing:any;
  payment_id:any;

  directionsService:any;
  directionsRenderer:any;

  markerOrigin:any;
  markerFinish:any;

  nota="";

  constructor(
  	private storage: Storage,
    private GlobalService: GlobalService, 
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private router: Router,
    public modalController: ModalController
  ) {
    this.global = this.GlobalService;
  }

  ngOnInit() {
    this.storage.get('userSession').then((userSession) => {
      if(userSession != null) {
        this.user_id = userSession.id_user;
      } else {        
        this.storage.get('proceedTo-express').then((result) => {
          if (result != null) {
            this.storage.set('proceedTo-express', null);
          } else {
            this.router.navigateByUrl('/login')
            this.storage.set('proceedTo-express', true);
            this.toastCtrl.create({
              message: "Por favor, inicie sesión primero",
              duration: 3000,
              position: 'top'
            }).then(toast => toast.present());
          }
        })
      }
  });
  }

  ionViewDidEnter() {

    this.GlobalService._get("payments").subscribe(payments => {
      let metodos = payments.pasarelas.map(p=>{
        p.css = "card mt-3 card-2 pb-2";
        p.img = "dinner-logo.png";
        p.var = "movil";
        return p;
      });

      this.metodos = metodos;
    })

    this.storage.get('ExpressInCart').then((ExpressInCart) => {
        if(ExpressInCart != null) {
          	console.log(ExpressInCart);
          	
          	this.ExpressInCart=ExpressInCart;
          	this.finish_address=ExpressInCart.finish_address;
      			this.finish_lat=ExpressInCart.finish_lat;
      			this.finish_long=ExpressInCart.finish_long;
      			this.gain_rider=ExpressInCart.gain_rider;
      			this.origin_address=ExpressInCart.origin_address;
      			this.origin_lat=ExpressInCart.origin_lat;
      			this.origin_long=ExpressInCart.origin_long;
      			this.total=ExpressInCart.total;
      			this.object=ExpressInCart.object;

            let mapOptions = {
                center: new google.maps.LatLng(ExpressInCart.origin_lat, ExpressInCart.origin_long),
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

            let request = {
              origin: new google.maps.LatLng(ExpressInCart.origin_lat, ExpressInCart.origin_long),
              destination: new google.maps.LatLng(ExpressInCart.finish_lat, ExpressInCart.finish_long),
              travelMode: 'DRIVING'
            };

            this.directionsService.route(request, (result, status) => {
              if (status == 'OK') {
                this.directionsRenderer.setDirections(result);
              }
            });

            this.markerOrigin = new google.maps.Marker({
                position: new google.maps.LatLng(ExpressInCart.origin_lat, ExpressInCart.origin_long),
                title: "Origen de la encomienda",
                icon: "../../../assets/images/ping.png"
            });

            this.markerOrigin.setMap(this.itemMap);

            this.markerFinish = new google.maps.Marker({
                position: new google.maps.LatLng(ExpressInCart.finish_lat, ExpressInCart.finish_long),
                title: "Llegada de la encomienda",
                icon: "../../../assets/images/ping.png"
            });

            this.markerFinish.setMap(this.itemMap);
      	
        }
    });

   }

   /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    //this.itemMap.remove();
  }

  async presentModal(metodo){

    //metodo efectivo
    if (metodo.name =="Efectivo" || metodo.name =="efectivo") {
        
        this.metodos = this.metodos.map(s=>{
            s.css = "card mt-3 card-2 pb-2";
            if (metodo.id==s.id) {
              s.css = s.css + " selected";
            }
            return s;
        });

        this.payment_id = 0;

        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Debe realizar pago justo, el Rider no posee cambio!',
          buttons: [
            {
              text: 'Entendido!',
              handler: (input) => {
                console.log('Confirm Cancel');
              }
            }
          ]
        });

        await alert.present();


    }else{

      const modal = await this.modalController.create({
        component: MetodoPagosPage,
        componentProps: { 
          metodo: metodo,
        }
      });

      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data.data.data!=null) {
          this.payment_id = data.data.data;
          this.metodos = this.metodos.map(s=>{
            s.css = "card mt-3 card-2 pb-2";
            if (data.data.metodo.id==s.id) {
              s.css = s.css + " selected";
            }
            return s;
          });

        }

      })

      return await modal.present();

    }
  }


  completarOrden(){
    this.loading = true;
    let items = [];

    this.ExpressInCart.payment_id = this.payment_id;
    this.ExpressInCart.user_id = this.user_id;
    this.ExpressInCart.nota = this.nota;

    console.log(this.ExpressInCart);
    
    this.GlobalService._post("orders/guardar-express", this.ExpressInCart).subscribe(orderSave => {
      
      if (orderSave && orderSave.action=="success") {
        

            const order_id = orderSave.order_id;
            //this.itemsInCart.order_id = orderSave.order_id;

            let setOrderDetail = {
              id: orderSave.order_id,
              status_orden: "0",
              user_delivery: null,
              isShipping: true,
              ...this.ExpressInCart
            }
            
                this.storage.set('setOrderDetail', setOrderDetail).then(() => {
                    this.loading = false;
                    this.router.navigateByUrl('orden-realizada');
                  
                });  

      }else{
        this.loading = false;
        this.showToast("Error desconocido, intentelo nuevamente en unos momentos!");
      }
    });
    
  }

  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top'
    }).then(toast => toast.present());
  }

}
