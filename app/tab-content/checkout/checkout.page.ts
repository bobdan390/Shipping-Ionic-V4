import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from './../../services/global.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { MetodoPagosPage } from '../metodo-pago/metodo-pago.page';

import { MetodoPagoPage } from './../../register/map-modal/metodo-pago.page';

declare var google;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  @ViewChild('itemMap',  {static: false}) mapElement: ElementRef;
  itemMap: any;
  global:any;
  nameRestaurant = "";
  logoRestaurant = "";
  name="";
  itemsInCart:any;
  user_id:any;
  loading = false;
  userAddress = "";
  restAddress = "";
  userLat = 0.0;
  userLong = 0.0;
  payment_id:any;

  metodos = [];
  routing:any;
  total:any;
  isChange = false;

  delivery=0.0;
  cupon:any;
  userSession:any;

   markerUser:any;
   markerUser2:any;
   directionsService:any;
   directionsRenderer:any;

   map:any;
   markerNegocio:any;
   nota:"";

  constructor(
    private storage: Storage,
    private GlobalService: GlobalService, 
    private toastCtrl: ToastController,
    private router: Router,
    public modalController: ModalController,
    private alertController: AlertController
  ) {
    this.global = GlobalService;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {

    this.storage.get('userSession').then((userSession) => {
        if(userSession != null) {
          this.name = userSession.name;
          this.user_id = userSession.id_user;
          this.userAddress = userSession.address;
          this.userLat = userSession.lat;
          this.userLong = userSession.long;
          this.userSession = userSession;
        } else {        
          this.storage.get('proceedTo').then((result) => {
            if (result != null) {
              this.storage.set('proceedTo', null);
            } else {
              this.router.navigateByUrl('/login')
              this.storage.set('proceedTo', true);
              this.toastCtrl.create({
                message: "Por favor, inicie sesión primero",
                duration: 3000,
                position: 'top'
              }).then(toast => toast.present());
            }
          })
        }
    });

    
    this.storage.get('itemsInCartCheckout').then((itemsInCartCheckout) => {
      console.log(itemsInCartCheckout);

      if (itemsInCartCheckout) {
        this.metodos = [];
        this.cupon = itemsInCartCheckout.cupon  ? itemsInCartCheckout.cupon : null;

          this.GlobalService._get("payments").subscribe(payments => {
             let metodos = payments.pasarelas.map(p=>{
                p.css = "card mt-3 card-2 pb-2";
                p.img = "dinner-logo.png";
                p.var = "movil";
                return p;
              });
              this.metodos = metodos;
           });

        this.total = parseFloat(itemsInCartCheckout.total).toFixed(2);

        let mapOptions = {
            center: new google.maps.LatLng(itemsInCartCheckout.items[0].item.restaurant.lat, itemsInCartCheckout.items[0].item.restaurant.long),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false
        } 

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true
        });
        this.directionsRenderer.setMap(this.map);


        let request = {
          origin: new google.maps.LatLng(itemsInCartCheckout.items[0].item.restaurant.lat, itemsInCartCheckout.items[0].item.restaurant.long),
          destination: new google.maps.LatLng(this.userLat, this.userLong),
          travelMode: 'DRIVING'
        };

        this.directionsService.route(request, (result, status) => {
          if (status == 'OK') {
            this.directionsRenderer.setDirections(result);
          }
        });

        this.markerNegocio = new google.maps.Marker({
            position: new google.maps.LatLng(itemsInCartCheckout.items[0].item.restaurant.lat, itemsInCartCheckout.items[0].item.restaurant.long),
            title: itemsInCartCheckout.items[0].item.restaurant.name,
            icon: "../../../assets/images/ping.png"
        });

        this.markerNegocio.setMap(this.map);

        this.markerUser = new google.maps.Marker({
            position: new google.maps.LatLng(this.userLat, this.userLong),
            title: "Usuario",
            icon: "../../../assets/images/ping.png"
        });

        this.markerUser.setMap(this.map);


        this.itemsInCart = itemsInCartCheckout;
        this.nameRestaurant = itemsInCartCheckout.items[0].item.restaurant.name;
        this.logoRestaurant = itemsInCartCheckout.items[0].item.restaurant.logo;
        this.restAddress = itemsInCartCheckout.items[0].item.restaurant.adress;

      }
    });

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

  completarOrden(){
    this.loading = true;
    let items = [];
    let restaurant_id = this.itemsInCart.items[0].item.restaurant_id;
    this.itemsInCart.items.map(it=>{
      let re = {
        id: it.item.id,
        restaurant_id: it.item.restaurant_id,
        qty: it.qty,
        name: it.item.name,
        price: it.item.price,
        total: it.total,
        option: it.optionSelected,
        addons: it.addonsSelected,
        promo: it.item.promo ? 1 : 0,
        optionsVarSelected: it.optionsVarSelected,
        isvar: it.optionsVarSelected && it.optionsVarSelected.length > 0 ? true : false
      }
      items.push(re);
    });

    let data = {
    	user_id: this.user_id, 
    	payment_id: this.payment_id, 
    	items: JSON.stringify(items), 
    	restaurant_id: restaurant_id, 
    	total: this.total,
    	gain_rider: parseFloat(this.itemsInCart.gain_rider).toFixed(2),
      userLat: this.userLat,
      userLong: this.userLong,
      userAddress: this.userAddress,
      cuponId: this.cupon != null ? this.cupon.id : null ,
      nota: this.nota
    }
    

    this.GlobalService._post("orders/guardar", data).subscribe(orderSave => {
      
      if (orderSave && orderSave.action=="success") {
        

            const order_id = orderSave.order_id;
            //this.itemsInCart.order_id = orderSave.order_id;

            let setOrderDetail = {
              id: orderSave.order_id,
              restaurant: this.itemsInCart.items[0].item.restaurant,
              status_orden: "0",
              user_delivery: null,
              isShipping: false,
              user_lat: this.userLat,
              user_long: this.userLong
            }
            
                this.storage.set('setOrderDetail', setOrderDetail).then(() => {

                    this.storage.remove('itemsInCart');
                    this.storage.remove('itemsInCartCheckout');
                    this.loading = false;
                    this.router.navigateByUrl('orden-realizada');
                  
                });  

      }else{
        this.loading = false;
        this.showToast("Error desconocido, intentelo nuevamente en unos momentos!");
      }
    });
    
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


    }else if(metodo.name != null && metodo.name !=undefined){

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


  async modalMap(){

    const modal = await this.modalController.create({
      component: MetodoPagoPage
    });


    modal.onDidDismiss().then((data) => {
      
      if(data.data && data.data.coords){
        this.userLat = data.data.coords[0];
        this.userLong = data.data.coords[1];
        this.userAddress = data.data.adress;

        let request = {
          origin: new google.maps.LatLng(this.itemsInCart.items[0].item.restaurant.lat, this.itemsInCart.items[0].item.restaurant.long),
          destination: new google.maps.LatLng(this.userLat, this.userLong),
          travelMode: 'DRIVING'
        };

        this.directionsService.route(request, (result, status) => {
          if (status == 'OK') {
            this.directionsRenderer.setDirections(result);

            let distance = result.routes[0].legs[0].distance.value/1000;

            this.delivery = parseFloat(this.userSession.delivery_base_3km);

            if (distance > 3) {
              let nDistance = distance - 3;
              let n = parseFloat(this.userSession.delivery_fuera_base_3km) * nDistance;
              let sum = this.delivery + n;
              this.delivery = sum;
            }

            let s1 = parseFloat(this.total) - parseFloat(this.itemsInCart.delivery) - parseFloat(this.itemsInCart.propina);
            let s2 = s1 + this.delivery;
            this.total = s2.toFixed(2);

            let gain_rider =  this.userSession.rider_delivery_base_3km;
            if (distance > 3) {
              let nDistance = distance - 3;
              gain_rider += this.userSession.rider_delivery_fuera_base_3km * nDistance ;
            }

            gain_rider += parseFloat(this.itemsInCart.propina);
            this.itemsInCart.gain_rider = gain_rider.toFixed(2);
            this.itemsInCart.delivery = this.delivery;

            console.log(distance);
          }
        });

        this.markerUser.setMap(null);

        this.markerUser = new google.maps.Marker({
            position: new google.maps.LatLng(this.userLat, this.userLong),
            title: "Usuario",
            icon: "../../../assets/images/ping.png"
        });

        this.markerUser.setMap(this.map);

        this.isChange = true;


      }
    })

    return await modal.present();
  }


  showToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top'
    }).then(toast => toast.present());
  }

}
