import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orden-realizada',
  templateUrl: './orden-realizada.page.html',
  styleUrls: ['./orden-realizada.page.scss'],
})
export class OrdenRealizadaPage implements OnInit {
  
  estimado="";
  setOrderDetail: any;
  constructor(
    private storage: Storage,
    private router: Router
  ) {

  	let now = new Date();
  	now.setMinutes( now.getMinutes() + 20 );
    let hour = (now.getHours() < 10) ? "0"+now.getHours() : now.getHours() ;
    let min =  (now.getMinutes() < 10) ? "0"+now.getMinutes() : now.getMinutes() ;

    this.estimado =  hour + ":" + min; 

    this.storage.get('setOrderDetail').then((setOrderDetail) => {
      console.log(setOrderDetail);
      this.setOrderDetail = setOrderDetail;
      if (this.setOrderDetail.isCola) {
        this.estimado = "";
      }
    })

  }

  ngOnInit() {
  }

  goto(){
    //this.storage.get('setOrderDetail').then((setOrderDetail) => {
      if (this.setOrderDetail.isShipping) {
        this.router.navigateByUrl('status-express');
      }else{
        if (this.setOrderDetail.isCola) {
           this.router.navigateByUrl('status-cola');
           
        }else{
            this.router.navigateByUrl('orden-status');
        }
       
      }
    //})
  }

}
