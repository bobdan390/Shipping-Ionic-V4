import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../../services/global.service';
import { Storage } from '@ionic/storage';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  
  item = {
    promo: false,
  	addons: [],
  	background: "",
  	categorie_id: 0,
  	created_at: null,
  	description: "",
  	id: 2,
  	logo: "",
  	name: "",
  	options: [],
  	price: 0,
  	restaurant_id: 1,
  	status: "",
  	updated_at: null,
    variable: [],
  	restaurant: {
  		background: "",
  		created_at: null,
  		id: 0,
  		lat: 0,
  		logo: "",
  		long: 0,
  		min_order: 0,
  		name: "",
  		stars: 0,
  		status: "",
  		tags: [],
  		updated_at: null
  	}
  };

  iPrice=0.0;
  qty = 1;
  range = 15;
  option = 0;
  price:number=0.0;
  addons =[];

  collapseOpen = 0;
  optionsVarSelected = [];
  global:any;

  constructor(
  	private GlobalService: GlobalService,
  	private storage: Storage,
  	private alertController: AlertController,
  	private router: Router,
    private location: Location,
    private toastCtrl: ToastController
  ) {
    this.global = this.GlobalService;
  }

  ionViewWillEnter() {
  	this.storage.get('setProductDetail').then((setProductDetail) => {
      if (!setProductDetail.promo){
        setProductDetail.background = "background: url('"+this.GlobalService.baseImages + setProductDetail.background+"');";
      }


      if(setProductDetail.variable != null && setProductDetail.variable != ""){
        setProductDetail.variable = JSON.parse(setProductDetail.variable);
      }else{
        setProductDetail.variable = [];
      }

      
  		this.item = setProductDetail;
      this.iPrice = parseFloat(setProductDetail.price);
  		this.setPrice();
  	});
  }

  collapseAction(tab){
    if (tab == this.collapseOpen) {
      this.collapseOpen = 9999;
    }else{
      this.collapseOpen = tab;
    }
  }

  parseEntero(val) {
    return parseInt(val);
  }


  setNameCheck(val, val2): string {
    return "check_" + val + "_" + val2;
  }

  setNameRadio(val): string {
    return "radio_" + val;
  }

  setIdRadio(val, val2): string {
    return "radio_option_" + val+"_" + val2;
  }

  setClass(val): string {
      return val == this.collapseOpen ? "collapse show" : "collapse";
  }

  formatear(val): string | number {
    let x:any;

    if (typeof val == "number") {
      x = val.toFixed(2);
    }else{
      x = val;
    }

    return x;
  }

  goBack(){
    this.location.back();
  }

  ngOnInit() {
  }

  minus(){
  	this.qty = (this.qty - 1) < 1 ? 1 : (this.qty - 1) ;
  	this.setPrice();
  }

  add(){
  	this.qty = this.qty + 1;
  	this.setPrice();
  }

  showVal(range){
  	let r = Math.trunc( (range/ (100 / (this.item.options.length + 1)) ) ) ;
  	if (r <= this.item.options.length) {
  		this.option = r;
  		this.setPrice();
  	}
  }

  setAddon(event, id){
  	this.addons.find(e => e == id) ? this.addons = this.addons.filter(i => i != id ) : this.addons.push(id) ;
  	this.setPrice();
  }

  setVar(e, option, variable, index){
    //console.log(e, option, variable, index);

    let found = null;
    this.optionsVarSelected.map((o, indice)=>{
      if (o.index == index) {
        found = indice;
      }
    })

    if (found == null) {
      this.optionsVarSelected.push({
        title: variable.title,
        option: option.name,
        price: option.price,
        index: index
      })
    }else{
      this.optionsVarSelected[found] = {
        title: variable.title,
        option: option.name,
        price: option.price,
        index: index
      }
    }

    this.setPrice();
  }

  setVar2(e, option, variable, index){
    if (e.currentTarget.checked) {
      this.optionsVarSelected.push({
        title: variable.title,
        option: option.name,
        price: option.price,
        index: index
      })
    }else{
      let n = [];
      this.optionsVarSelected = this.optionsVarSelected.map(o=>{
        if (o.option != option.name) {
          n.push({
            title: o.title,
            option: o.option,
            price: o.price,
            index: o.index
          })
        }
      })
      this.optionsVarSelected = n;
    }

    this.setPrice();
  }

  setPrice(){
  	if (this.option == 0) {
      //Producto normal
      if (this.item.variable.length == 0) {
        let x = this.item.price * this.qty;
        this.price = x;
        this.iPrice = this.price;
      }else{
        //producto variable
        this.price = 0;
      }
      
  	}else {
      if (this.item.options.length > 0) {
        this.price = parseFloat(this.item.options[(this.option-1)].price) * this.qty;
        this.iPrice = parseFloat(this.item.options[(this.option-1)].price);
      }
  	}

    //addons
  	this.item.addons.map(addon=>{
  		if (this.addons.includes(addon.id)) {
  			this.price += parseFloat(addon.price);
  		}
  	});

    //variables
    if (this.optionsVarSelected.length > 0) {
      this.optionsVarSelected.map(op=>{
        if (op) {
          this.price += (parseFloat(op.price) * this.qty)
        }
      });
    }

  }

  addCart(){

    if (this.item.variable.length > 0 && this.optionsVarSelected.length < this.item.variable.length) {
      this.toastCtrl.create({
                message: "Complete las preferencias del producto",
                duration: 3000,
                position: 'top'
              }).then(toast => toast.present());

      return;
    }

    if (this.item.variable.length > 0) {
      let totalVars = 0;

      this.item.variable.map(vars =>{
        totalVars += parseInt(vars.count);
      });

      if (this.optionsVarSelected.length > totalVars) {
        this.toastCtrl.create({
                message: "Haz seleccionado una opción demas!!",
                duration: 3000,
                position: 'top'
              }).then(toast => toast.present());

        return;
      }
    }


  	let addonsSelected = [];
  	this.item.addons.map(addon=>{
  		if (this.addons.includes(addon.id)) {
  			addonsSelected.push(addon);
  		}
  	});
  	let itemToCart = {
  		item: this.item,
  		qty: this.qty,
  		optionSelected: this.option != 0 ? this.item.options[(this.option-1)] : 0 ,
  		addonsSelected: addonsSelected,
  		total: this.price.toFixed(2),
      optionsVarSelected: this.optionsVarSelected
  	};


  	this.storage.get('itemsInCart').then(async itemsInCart => {
  		let cart = [];
  		if (itemsInCart) {
  			cart = itemsInCart
  		}

  		cart.push(itemToCart);

  		this.storage.set('itemsInCart', cart);

	  	const alert = await this.alertController.create({
	      message: '<div class="text-center w-100"><img class="icon-agregado-al-carrito" src = "./../../assets/images/carrito.png" /> <h3> Agregado al carrito! </h3></div>',
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
                        if (this.item.promo) {
                          this.router.navigateByUrl('promociones');
                        }else{
                          //this.router.navigateByUrl('restaurant');
                          this.location.back();
                        }
	                      
	                    }
	                   }
	                  
	               ]
	    });

	    await alert.present();

  	});
  }

}
