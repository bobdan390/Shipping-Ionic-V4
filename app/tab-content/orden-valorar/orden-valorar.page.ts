import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../services/global.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-orden-valorar',
  templateUrl: './orden-valorar.page.html',
  styleUrls: ['./orden-valorar.page.scss'],
})
export class OrdenValorarPage implements OnInit {

  heightFooter = "bottom: -250px" ;
  bluerStyle = "";
  h = -250;

  star1="";
  star2="";
  star3="";
  star4="";
  star5="";
  stars = 0;
  loading=false;
  restaurant_id:any;
  order_id:any;

  constructor(
    private storage: Storage,
    private GlobalService: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.get('setOrderDetail').then((setOrderDetail) => {
      console.log(setOrderDetail);
      this.restaurant_id = setOrderDetail.restaurant.id;
      this.order_id = setOrderDetail.id;
    });
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

  sendValoration(){
    this.loading=true;

    this.GlobalService._post("orders/restaurant/valorar", {id: this.restaurant_id, stars: this.stars, order_id: this.order_id }).subscribe(valorar => {
      this.loading=false;

      if (valorar && valorar.action == "success") {
          this.router.navigateByUrl('/tabs');
      }
    });

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
