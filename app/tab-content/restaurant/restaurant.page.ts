import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../services/global.service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { MenuPictureComponent } from '../product-modal/menu-picture.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage implements OnInit {

  global:any;
  restaurant = {
  	background: "",
  	created_at: null,
  	id: 0,
  	lat: 0,
  	logo: "",
  	long: 0,
  	min_order: 0,
  	name: "",
  	stars: "0/0",
  	status: "",
  	tags: [],
  	updated_at: null
  };
  data_for_categories = [];
  addons:any;
  loading=false;
  categoria = "";
  distance = 0.0;

  constructor(
  	private GlobalService: GlobalService,
  	private storage: Storage,
  	private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
  	this.global = this.GlobalService;
    
  }

  ngOnInit() {
  }

  formatear(val): string | number {
    let x:any;
    if (typeof val == "number") {
      x = val.toFixed(2);
    }else{
      x = val;
    }
    //console.log(x);
    return x;
  }

  ionViewWillEnter() {

    let categoria = this.route.snapshot.paramMap.get('data');
    if (this.data_for_categories.length == 0 || categoria!=this.categoria) {

      this.categoria = categoria;
      this.loading = true;
      this.storage.get('setRestaurantDetail').then((setRestaurantDetail) => {

        this.storage.get('userSession').then((userSession) => {
          if (userSession) {

              this.GlobalService._post("distance", {lat1: setRestaurantDetail.lat, long1: setRestaurantDetail.long, lat2: userSession.lat, long2: userSession.long}).subscribe(async distance => {
                if (distance.action == "success") {
                  this.distance = distance.data?.routes[0].legs[0].distance?.value / 1000;
                  console.log(distance.data?.routes[0].legs[0].distance?.value);
                }
              });

            //let distance = this.global._distance(setRestaurantDetail.lat, setRestaurantDetail.long, userSession.lat, userSession.long);
            //this.distance = distance.toFixed(1);
          }
        });
      

      

      this.restaurant = setRestaurantDetail;
      console.log(setRestaurantDetail);
      this.GlobalService._post("productsrestaurant",{id:setRestaurantDetail.id, categoria: this.categoria}).subscribe(restaurants => { 

          

            this.addons = restaurants.addons;
            let data_for_categories = [];
            
            //get categories first
            restaurants.products.map(rest=>{
              if(!data_for_categories.find(e => e.id == rest.subcategorie_id)){
                let subcategorie = rest.subcategorie;
                subcategorie.products = [];
                data_for_categories.push(subcategorie);
              }
              delete rest.subcategorie;
            });


            //set products in each categorie
            data_for_categories.map(cate=>{
              restaurants.products.map(rest=>{
                if (cate.id == rest.subcategorie_id) {
                  cate.products.push(rest);
                }
              });
            });

            this.loading = false;
            this.data_for_categories = data_for_categories;

        });

      });
    }
    
  }

  goBack(){
    this.location.back();
  }

  toItem(item){
    if (this.categoria == 'comida') {

      let addons = [];
      if (item.addons != "" && item.addons != null) {
          let a = item.addons.split(",");
          a.map(e=>{

            this.addons.map(a_=>{
              if (a_.id == parseInt(e)) {
                addons.push(a_);
              }
            });

          });
      }

      this.storage.set('setProductDetail', {...item,addons: addons, restaurant: this.restaurant}).then(() => {
        this.router.navigateByUrl('item');
      });
    }else{
      this.addCart(item);
    }
  	
  }

  async addCart(item){

    const popover = await this.popoverController.create({
      component: MenuPictureComponent,
      componentProps: {item:item},
      translucent: false
    });

    popover.onDidDismiss()
    .then((result) => {
      console.log(result);
      if (result && result.data && result.data.qty && result.data.qty > 0) {
        this.addItemCart(item, result.data.qty, result.data.total);
      }
    });
    
    return await popover.present();

  }

  addItemCart(item, qty, total){

    item.restaurant = this.restaurant;
    
    let itemToCart = {
      item: item,
      qty: qty,
      optionSelected: "0",
      addonsSelected: [],
      total: total
    };

    this.storage.get('itemsInCart').then(async itemsInCart => {
      let cart = [];
      if (itemsInCart) {
        cart = itemsInCart
      }

      cart.push(itemToCart);

      this.storage.set('itemsInCart', cart);

      const alert = await this.alertController.create({
        message: '<div class="text-center w-100"><img src = "./../../assets/images/carrito.png" width="20px" height="20px"> <h3> Agregado al carrito! </h3></div>',
        backdropDismiss: false,
        buttons: [
                    {
                      text: 'Ir al carrito',
                      handler: () => {
                        this.router.navigateByUrl('tabs/tabs/cart');
                      }
                    },
                    {
                      text: 'Ok',
                      handler: () => {
                        alert.dismiss();
                      }
                     }
                    
                 ]
      });

      await alert.present();

    });
  }

}
