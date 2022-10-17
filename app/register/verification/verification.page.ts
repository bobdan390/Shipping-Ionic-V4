import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GlobalService } from './../../services/global.service';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  @ViewChild('codigo1', { static: true }) codigo1: ElementRef;
  @ViewChild('codigo2', { static: true }) codigo2: ElementRef;
  @ViewChild('codigo3', { static: true }) codigo3: ElementRef;
  @ViewChild('codigo4', { static: true }) codigo4: ElementRef;
  @ViewChild('codigo5', { static: true }) codigo5: ElementRef;

  codigo = "";
  c1 ="";
  c2 ="";
  c3 ="";
  c4 ="";
  c5 ="";
  cargando = false;
  data={
    id_verification: "",
    correo: "",
    code_email: ""
  }

  constructor(
  	private GlobalService: GlobalService,
    private storage: Storage,
  	private router: Router, 
  	private route: ActivatedRoute,
  	private alertController: AlertController,
  	private toastCtrl: ToastController,
  ) {
  	let data = this.route.snapshot.paramMap.get('data');

  	if(data != null) {
  		this.data = JSON.parse(data);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void { this.codigo1.nativeElement.focus(); }

  onChange(e, i){
  	if (e.data) {
  		switch (i) {
  			case 1:
  				this.c1 = e.data;
  				this.codigo2.nativeElement.focus();
  				break;
  			case 2:
  				this.c2 = e.data;
  				this.codigo3.nativeElement.focus();
  				break;
  			case 3:
  				this.c3 = e.data;
  				this.codigo4.nativeElement.focus();
  				break;
  			case 4:
  				this.c4 = e.data;
  				this.codigo5.nativeElement.focus();
  				break;
  			case 5:
  				this.c5 = e.data;
  				this.codigo5.nativeElement.focus();
  				break;
  		}
  	}
  }

  async backToSend(){
	  	const alert = await this.alertController.create({
		      message: '<h5>¿Enviar nuevamente el código? </h5>',
		      backdropDismiss: false,
		      buttons: [
		                  {
		                    text: 'Cancelar',
		                    handler: () => {
		                      
		                    }
		                  },
		                  {
		                    text: 'Ok',
		                    handler: () => {
		                    	this.router.navigateByUrl('register');
		                    }
		                   }
		                  
		               ]
		});

		await alert.present();

  }

  verificarCodigo(){
  	this.cargando = true;
  	let codigo = this.c1 + "" + this.c2 + "" +  this.c3 + "" + this.c4 + "" + this.c5;
  	this.GlobalService._post("users/verification_code", {email: this.data.correo, code: codigo, id: this.data.id_verification}).subscribe(verification_code => { 
  		this.cargando = false;

  		if (verification_code) {

  			if (verification_code.action=="success") {

          this.storage.set('email-verified', this.data.correo).then(() => {
             this.router.navigateByUrl('email-verified');
          });

  			}else{
  				this.showToast(verification_code.msg);
  			}

  		}else{
  			this.showToast("Error inesperado, intentelo nuevamente!");
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
