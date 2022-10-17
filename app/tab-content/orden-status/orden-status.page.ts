import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GlobalService } from './../../services/global.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

declare var google;


@Component({
  selector: 'app-orden-status',
  templateUrl: './orden-status.page.html',
  styleUrls: ['./orden-status.page.scss'],
})
export class OrdenStatusPage implements OnInit {

  @ViewChild('statusMap',  {static: false}) mapElement: ElementRef;
  statusMap: any;
  order:any;
  statuses = [];
  reload:any;
  loading=false;
  isDelivered = false;
  nOrden:any;
  deliverer = null;
  routing:any;
  type_vehicle:any;
  pictureDeliverer = null;
  global:any;

  directionsService:any;
  directionsRenderer:any;

  markerUser:any;
  markerNegocio:any;

  constructor(
    private storage: Storage,
    private GlobalService: GlobalService,
    private router: Router,
    private alertController: AlertController,
    private toastCtrl: ToastController
  ) {
    this.global = GlobalService;
  }

  ngOnInit() {
  }

  /** Remove map when we have multiple map object */
  ionViewWillLeave() {
    //this.statusMap.remove();
    clearInterval(this.reload);
  }

  formatearDate(date): string {
    let cake1 = date.split(" ");
    let cake2 = cake1[0].split(":");
    return cake2[0] + ":" + cake2[1] + " " + cake1[1];
  }

  ionViewDidEnter() {

    

    this.storage.get('setOrderDetail').then((setOrderDetail) => {

      console.log(setOrderDetail);

        this.type_vehicle = setOrderDetail.type_vehicle;
        this.order = setOrderDetail;
        this.nOrden = setOrderDetail.id;


        let mapOptions = {
            center: new google.maps.LatLng(setOrderDetail.restaurant.lat, setOrderDetail.restaurant.long),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl:false,
            fullscreenControl: false,
            streetViewControl: false,
            zoomControl: false
        } 

        this.statusMap = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true
        });
        this.directionsRenderer.setMap(this.statusMap);

        let request = {
          origin: new google.maps.LatLng(setOrderDetail.restaurant.lat, setOrderDetail.restaurant.long),
          destination: new google.maps.LatLng(setOrderDetail.user_lat, setOrderDetail.user_long),
          travelMode: 'DRIVING'
        };

        this.directionsService.route(request, (result, status) => {
          if (status == 'OK') {
            this.directionsRenderer.setDirections(result);
          }
        });

        this.markerNegocio = new google.maps.Marker({
            position: new google.maps.LatLng(setOrderDetail.restaurant.lat, setOrderDetail.restaurant.long),
            title: setOrderDetail.restaurant.name,
            icon: "../../../assets/images/ping.png"
        });

        this.markerNegocio.setMap(this.statusMap);

        this.markerUser = new google.maps.Marker({
            position: new google.maps.LatLng(setOrderDetail.user_lat, setOrderDetail.user_long),
            title: "Usuario",
            icon: "../../../assets/images/ping.png"
        });

        this.markerUser.setMap(this.statusMap);

      
      this.getStatus();
      this.reload  =  setInterval(()=>{
        this.getStatus();
      },5000);
      
    });

  }

  async finish() {

    const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Confirmación de pedido entregado',
          buttons: [
            {
              text: 'NO!',
              handler: () => {
                console.log('Confirm Cancel');
              }
            },
            {
              text: 'Si lo he recibido!',
              handler: () => {
                this.GlobalService._post("orders/finishdelivery",{id: this.order?.id}).subscribe(finishdelivery => {
                  if (finishdelivery && finishdelivery.action == "success") {
                    this.router.navigateByUrl('/orden-status-valorar');
                  }else{
                    this.showToast("Error en el proceso, intentelo nuevamente!");
                  }
                });
              }
            }
          ]
      });

      await alert.present();
  }

  getStatus(){
    if (this.loading == false) {
      this.loading=true;

      this.GlobalService._post("orders/status", {id: this.order.id, express: false}).subscribe(statuses => {
        if (statuses) {
          if (statuses.action == "success") {
            console.log(statuses);
            this.deliverer = statuses.deliverer?.name;
            this.pictureDeliverer = statuses.deliverer?.picture;
            this.type_vehicle = statuses.deliverer?.type_vehicle;
            this.statuses = [];
            this.statuses.push(statuses.status[(statuses.status.length-1)]);
            this.loading=false;
            this.isDelivered = parseInt(statuses.status[(statuses.status.length-1)].status) >= 3 ? true : false ;
            this.order.status_orden = parseInt(statuses.status[(statuses.status.length-1)].status);
            this.order.status = statuses.status;
            this.storage.set('setOrderDetail', this.order);

            if (parseInt(statuses.status[(statuses.status.length-1)].status) == 4) {
              this.router.navigateByUrl('/orden-status-valorar');
            }

            if (parseInt(statuses.status[(statuses.status.length-1)].status) == 3) {

              let request = {
                origin: new google.maps.LatLng(this.order.user_lat, this.order.user_long),
                destination: new google.maps.LatLng(statuses.deliverer?.lat, statuses.deliverer?.long),
                travelMode: 'DRIVING'
              };

              this.directionsService.route(request, (result, status) => {
                if (status == 'OK') {
                  this.directionsRenderer.setDirections(result);
                }
              });

              this.markerNegocio.setMap(null);

              let pingDeliverer = "../../../assets/images/ping.png";

              if (statuses.deliverer && statuses.deliverer.type_vehicle == "Motocicleta") {
                pingDeliverer = "../../../assets/images/moto_icon_x2.png";
              }

              if (statuses.deliverer && statuses.deliverer.type_vehicle == "Bicicleta") {
                pingDeliverer = "../../../assets/images/bycicle_icon_x2.png";
              }

              if (statuses.deliverer && statuses.deliverer.type_vehicle == "Automovil") {
                pingDeliverer = "../../../assets/images/car_icon_x2.png";
              }

              this.markerNegocio = new google.maps.Marker({
                  position: new google.maps.LatLng(statuses.deliverer?.lat, statuses.deliverer?.long),
                  title: "Delivery",
                  icon: pingDeliverer
              });

              this.markerNegocio.setMap(this.statusMap);


            }
            	
          }
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
}
