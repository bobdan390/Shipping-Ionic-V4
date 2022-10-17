import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../services/global.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.page.html',
  styleUrls: ['./promociones.page.scss'],
})
export class PromocionesPage implements OnInit {
  
  loading = true;
  promos = [];
  global : any;
  constructor(
  	private GlobalService: GlobalService,
    private storage: Storage,
    private router: Router
  ) {
  	this.global = this.GlobalService;
    this.storage.get('userSession').then((userSession) => {
      console.log(userSession);

      this.GlobalService._get("promotions/" + userSession.lat + "/" + userSession.long).subscribe(result => { 

        result.map(rest=>{
            rest.background = "background: url('"+this.global.baseImages + rest.background+"');"
        });

        this.loading = false;
        this.promos = result;

      });

    });


  }

  toItem(item){

    let addons = [];
    if (item.addons != "" && item.addons != null) {
        let a = item.addons.split(",");
        a.map(e=>{

          item.restaurant.addons.map(a_=>{
            if (a_.id == parseInt(e)) {
              addons.push(a_);
            }
          });

        });
     }

    let data = {
      ...item,
      addons: addons,
      //all_addons: item.restaurant.addons,
      restaurant: item.restaurant,
      options: [],
      logo: item.restaurant.logo,
      promo: true
    };

    console.log(data);

    this.storage.set('setProductDetail', data).then(() => {
      this.router.navigateByUrl('item');
    });
  }

  ngOnInit() {
  }

}
