import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../services/global.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  correo = "";
  cargando = false;
  constructor(
  	private GlobalService: GlobalService,
    private toastCtrl: ToastController,
    private router: Router
  ) {

  }

  ngOnInit() {

  }

  checkEmail() {
  	if (this.correo != "" && this.cargando == false) {
  		this.cargando = true;
  		
  		this.GlobalService._post("users/create_verification", {"email": this.correo}).subscribe(result => { 
	  		if(result){
          if (result.action == "success") {
            this.cargando = false;
            //this.showToast(result.msg);
            let data = {
              id_verification: result.id_verification,
              correo: this.correo,
              code_email: result.code_email
            };
            this.router.navigateByUrl('/verification/' + JSON.stringify(data));
          }else{
            this.showToast(result.msg);
            this.cargando = false;
          }
        }else{
          this.showToast("Error en el envio del codigo, intentelo nuevamente!");
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



}
