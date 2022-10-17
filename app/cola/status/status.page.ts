import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import { Storage } from '@ionic/storage';
import { GlobalService } from './../../services/global.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

declare var google;
@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

  @ViewChild('statusMap',  {static: false}) mapElement: ElementRef;
  statusMap: any;
  order:any;
  statuses = [];
  reload:any;
  loading=false;
  isDelivered = false;
  nOrden:any;
  deliverer = null;
  status_message="";
  status_date1="";
  status_date2="";
  routing:any;
  type_vehicle:any;
  pictureDeliverer = null;
  global:any;

  directionsService:any;
  directionsRenderer:any;

  markerOrigin:any;
  markerFinish:any;

  constructor(
  	private storage: Storage,
    private GlobalService: GlobalService,
    private router: Router,
    private alertController: AlertController,
    private toastCtrl: ToastController
  ) {
  	this.global = GlobalService;
  }

  ionViewWillLeave() {
    clearInterval(this.reload);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {

    this.storage.get('setOrderDetail').then((setOrderDetail) => {

      console.log(setOrderDetail);

        this.type_vehicle = setOrderDetail.type_vehicle;

        this.order = setOrderDetail;
        this.nOrden = setOrderDetail.id;

        let mapOptions = {
              center: new google.maps.LatLng(setOrderDetail.origin_lat, setOrderDetail.origin_long),
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
            origin: new google.maps.LatLng(setOrderDetail.origin_lat, setOrderDetail.origin_long),
            destination: new google.maps.LatLng(setOrderDetail.finish_lat, setOrderDetail.finish_long),
            travelMode: 'DRIVING'
          };

          this.directionsService.route(request, (result, status) => {
            if (status == 'OK') {
              this.directionsRenderer.setDirections(result);
            }
          });

        this.markerOrigin = new google.maps.Marker({
              position: new google.maps.LatLng(setOrderDetail.origin_lat, setOrderDetail.origin_long),
              title: "Origen de la encomienda",
              icon: "../../../assets/images/ping.png"
          });

          this.markerOrigin.setMap(this.statusMap);

        this.markerFinish = new google.maps.Marker({
              position: new google.maps.LatLng(setOrderDetail.finish_lat, setOrderDetail.finish_long),
              title: "Llegada de la encomienda",
              icon: "../../../assets/images/ping.png"
          });

          this.markerFinish.setMap(this.statusMap);
      
      this.getStatus();
      this.reload  =  setInterval(()=>{
        this.getStatus();
      },30000);
      
    });

  }


  async finish() {

    const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Confirmación de carrera realizada',
          buttons: [
            {
              text: 'NO!',
              handler: () => {
                console.log('Confirm Cancel');
              }
            },
            {
              text: 'Si realizada!',
              handler: () => {
                this.GlobalService._post("orders/finishdelivery3",{id: this.order?.id}).subscribe(finishdelivery => {
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

	      this.GlobalService._post("orders/status-cola", {id: this.order.id, cola: true}).subscribe(statuses => {
	      	this.loading=false;
	        if (statuses) {
	          if (statuses.action == "success") {
	            console.log(statuses);

	            this.deliverer = statuses.deliverer?.name;
              this.pictureDeliverer = statuses.deliverer?.picture;
              let statu = parseInt(statuses.shippings.status_orden);
              switch (statu) {
                case 0:
                  this.status_message="Esperando confirmación de pago";
                  break;
                case 1:
                  this.status_message="Realizando carrera";
                  break;
              }
              
              let cake = statuses.shippings.updated_at.split(".")[0].split("T")[1].split(":");
              this.status_date1= statuses.shippings.updated_at.split(".")[0].split("T")[0];
              this.status_date2= cake[0] + ":" + cake[1];
              this.isDelivered = parseInt(statuses.shippings.status_orden) == 1 ? true : false ;
	          this.loading=false;

              if (parseInt(statuses.shippings.status_orden) == 2) {
                this.router.navigateByUrl('/orden-status-valorar');
              }

	            if (parseInt(statuses.shippings.status_orden) == 1) {
                this.type_vehicle = statuses.deliverer.type_vehicle;
                this.order.status_orden = parseInt(statuses.shippings.status_orden);
                if (statuses.shippings.delivery_lat) {

                  let request = {
                    origin: new google.maps.LatLng(statuses.shippings.delivery_lat, statuses.shippings.delivery_long),
                    destination: new google.maps.LatLng(this.order.finish_lat, this.order.finish_long),
                    travelMode: 'DRIVING'
                  };

                  this.directionsService.route(request, (result, status) => {
                    if (status == 'OK') {
                      this.directionsRenderer.setDirections(result);
                    }
                  });

                  let pingDeliverer = "../../../assets/images/oval.png";

                  if (this.type_vehicle == "Motocicleta") {
                    pingDeliverer = "../../../assets/images/moto_icon_x2.png";
                  }

                  if (this.type_vehicle == "Bicicleta") {
                    pingDeliverer = "../../../assets/images/bycicle_icon_x2.png";
                  }

                  if (this.type_vehicle == "Automovil") {
                    pingDeliverer = "../../../assets/images/car_icon_x2.png";
                  }

                  this.markerOrigin.setMap(null);

                  this.markerOrigin = new google.maps.Marker({
                      position: new google.maps.LatLng(statuses.shippings.delivery_lat, statuses.shippings.delivery_long),
                      title: "Delivery",
                      icon: pingDeliverer
                  });

                  this.markerOrigin.setMap(this.statusMap);
                
                }  
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
