import { Component, OnInit } from '@angular/core';  
import { Storage } from '@ionic/storage';
import { GlobalService } from './../../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orden-status-valorar',
  templateUrl: './orden-status-valorar.page.html',
  styleUrls: ['./orden-status-valorar.page.scss'],
})
export class OrdenStatusValorarPage implements OnInit {
  heightFooter = "bottom: -250px" ;
  bluerStyle = "";
  h = -250;

  star1="";
  star2="";
  star3="";
  star4="";
  star5="";

  nOrden:any;
  status = [];
  stars = 0;
  loading=false;
  isShipping:any;
  isCola:any;

  constructor(
    private storage: Storage,
    private GlobalService: GlobalService,
    private router: Router
  ) { }

  formatearDate(date): string {
    let cake1 = date.split(" ");
    let cake2 = cake1[0].split(":");
    return cake2[0] + ":" + cake2[1] + " " + cake1[1];
  }
  
  ionViewDidEnter() {
    this.storage.get('setOrderDetail').then((setOrderDetail) => {
      console.log(setOrderDetail);
      this.nOrden = setOrderDetail.id;
      this.status = setOrderDetail.status;
      this.isShipping = setOrderDetail.isShipping;

      if (setOrderDetail.isShipping) {
        this.status = [
          {
            message: "Confirmación de pago", date:""
          },
          {
            message: "Orden confirmada", date:""
          },
          {
            message: "Pedido en camino", date:""
          },
          {
            message: "Pedido entregado", date:""
          }
        ]
      }

      if (setOrderDetail.isCola) {
        this.isCola = true;
        this.status = [
          {
            message: "Confirmación de pago", date:""
          },
          {
            message: "Orden confirmada", date:""
          },
          {
            message: "Taxi en camino", date:""
          },
          {
            message: "Llegada a destino", date:""
          }
        ]
      }

    });
  }

  sendValoration(){

    if (this.isShipping) {
      this.loading=true;
      this.GlobalService._post("orders/status/valorarShipping", {id: this.nOrden, valoration: this.stars}).subscribe(valorar => {
        this.loading=false;

        if (valorar && valorar.action == "success") {
          this.router.navigateByUrl('/tabs/tabs/categories');
        }
      });
    }else{
      this.loading=true;

      if (this.isCola) {
        this.GlobalService._post("orders/status/valorar/cola", {id: this.nOrden, valoration: this.stars}).subscribe(valorar => {
        this.loading=false;

        if (valorar && valorar.action == "success") {
          this.router.navigateByUrl('/tabs/tabs/categories');
        }
      });
      }else{
        this.GlobalService._post("orders/status/valorar", {id: this.nOrden, valoration: this.stars}).subscribe(valorar => {
          this.loading=false;

          if (valorar && valorar.action == "success") {
            this.router.navigateByUrl('orden-status-completed');
          }
        });
      }

      
    }

    
    
  }

  ngOnInit() {
  }

  valorar() {
  	setInterval(()=>{
  		if (this.h != 0) {
  			this.h = this.h+5;
  			this.heightFooter = "bottom: " +this.h+ "px";
  			this.bluerStyle = "filter: blur(6px);"
  		}
  	},1);
  }

  setStart(n){
    this.stars = n;
  	switch (n) {
  		case 1:
  			this.star1 = "fill:#FFC96F";
  			this.star2 = "";
  			this.star3 = "";
  			this.star4 = "";
  			this.star5 = "";
  		break;

  		case 2:
  			this.star1 = "fill:#FFC96F";
  			this.star2 = "fill:#FFC96F";
  			this.star3 = "";
  			this.star4 = "";
  			this.star5 = "";
  		break;

  		case 3:
  			this.star1 = "fill:#FFC96F";
  			this.star2 = "fill:#FFC96F";
  			this.star3 = "fill:#FFC96F";
  			this.star4 = "";
  			this.star5 = "";
  		break;

  		case 4:
  			this.star1 = "fill:#FFC96F";
  			this.star2 = "fill:#FFC96F";
  			this.star3 = "fill:#FFC96F";
  			this.star4 = "fill:#FFC96F";
  			this.star5 = "";
  		break;

  		case 5:
  			this.star1 = "fill:#FFC96F";
  			this.star2 = "fill:#FFC96F";
  			this.star3 = "fill:#FFC96F";
  			this.star4 = "fill:#FFC96F";
  			this.star5 = "fill:#FFC96F";
  		break;
  	}
  }

}
