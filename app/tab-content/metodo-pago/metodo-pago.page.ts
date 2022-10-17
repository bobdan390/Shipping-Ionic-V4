import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, ModalController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';
import { GlobalService } from './../../services/global.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {File, IWriteOptions, FileEntry} from '@ionic-native/file/ngx';

@Component({
  selector: 'app-metodo-pago',
  templateUrl: './metodo-pago.page.html',
  styleUrls: ['./metodo-pago.page.scss'],
})
export class MetodoPagosPage implements OnInit {
   
  metodo;
  email = "";
  referencia = "";
  objectFile:any;
  nameFile = "";
  loading=false;

  constructor(
    private nav:NavController,
    private modalCtrl:ModalController, 
    private navParams: NavParams, 
    private toastCtrl: ToastController,
    private GlobalService: GlobalService,
    private camera: Camera,
    private file: File
  ) {
        
  }

  ngOnInit() {
    console.log(this.metodo);
  }

  enviarPago() {
    if (this.email!="" && this.referencia!="" && this.loading!=true) {
      this.loading=true;
      //si envia un capture
      if (this.nameFile!="") {

        const reader = new FileReader();
        reader.onloadend = () => {
          const imgBlob = new Blob([reader.result], {
            type: this.objectFile.type
          });
          const formData = new FormData();
          formData.append('email', this.email);
          formData.append('referencia', this.referencia);
          formData.append('gateway', this.metodo.name);
          formData.append('file', imgBlob, this.objectFile.name);

          console.log(imgBlob);

          this.GlobalService._post('orders/payment', formData).subscribe(result => { 
            this.loading=false;
            this.modalCtrl.dismiss({
              'data': result.id,
              'metodo': this.metodo
            });
          });
        };
        reader.readAsArrayBuffer(this.objectFile);

        //si envia sin capture
      }else{

          
          const formData = new FormData();
          formData.append('email', this.email);
          formData.append('referencia', this.referencia);
          formData.append('gateway', this.metodo.name);

          this.GlobalService._post('orders/payment', formData).subscribe(result => { 
            this.loading=false;
            this.modalCtrl.dismiss({
              'data': result.id,
              'metodo': this.metodo
            });
          });

      }

    }
    
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


  getPhoto() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

        this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
          entry.file(file => {
            console.log(file);
            this.nameFile = file.name + "." + file.type.split("/")[1];
            this.objectFile = file;
          });
        });

    }, (err) => {
      // Handle error
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
