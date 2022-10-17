import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavParams, NavController, ModalController } from '@ionic/angular';

import { ToastController, LoadingController } from '@ionic/angular';
import { GlobalService } from './../../services/global.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.page.html',
  styleUrls: ['./metodo-pago.page.scss'],
})
export class MetodoPagoPage implements OnInit {
  
  @ViewChild('mapUbicacion',  {static: false}) mapElement: ElementRef;
  coords = null;
  loading:any;

  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  markerUser:any;
  geocoder:any;

  constructor(
    private nav:NavController,
    private modalCtrl:ModalController, 
    private navParams: NavParams, 
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private GlobalService: GlobalService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {

  }

  localizar() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.updating(resp.coords.latitude, resp.coords.longitude);
    })
  }

  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  SelectSearchResult(item) {
    this.ClearAutocomplete();

    this.geocoder.geocode({ 
        'placeId': item.place_id
     }, (responses, status) => {
       if (status == 'OK') {
         this.updating(responses[0].geometry.location.lat(), responses[0].geometry.location.lng());
        }
     });
  }

  updating(lat, lng) {
    this.markerUser.setMap(null);
    let latLng = new google.maps.LatLng(lat, lng);
    this.markerUser = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      title:""
    });
    this.markerUser.setMap(this.map);
    this.map.setCenter(new google.maps.LatLng(lat, lng));
    this.map.setZoom(15);
    this.coords = [lat, lng];
  }


  ionViewDidEnter() {

    let latLng = new google.maps.LatLng(10.4170231, -64.2419142);
    let mapOptions = {
        center: latLng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl:false,
        fullscreenControl: false,
        streetViewControl: false
    } 

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.markerUser = new google.maps.Marker({
        position: new google.maps.LatLng(10.4170231, -64.2419142),
        title:""
    });

    this.markerUser.setMap(this.map);
    

    google.maps.event.addListener(this.map, 'click', (event) => {
      this.ClearAutocomplete();
      this.updating(event.latLng.lat(), event.latLng.lng());
    });
  }


  closeModal()
  {
    this.modalCtrl.dismiss({
      'data': null
    });
  }


  returnData() {
  	this.modalCtrl.dismiss({
      'data': 1
    });
  }


  guardarUbicacion() {
    if (this.coords == null) {
      this.showToast("Seleccione su ubicación!");
    }else{

      this.GlobalService._reverseGeocode(this.coords).subscribe(result => { 
        let address = "Ubicación no encontrada";
        let state = "Estado no encontrado";
        if (result && result.results) {

          result.results[0].address_components.map(e=>{
            if(e.types[0] == "administrative_area_level_1"){
              state = e.long_name;
            }
          })

          address = result.results[0].formatted_address;
        }
        this.modalCtrl.dismiss({
          'coords': this.coords,
          'adress': address,
          'state': state
        });
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
