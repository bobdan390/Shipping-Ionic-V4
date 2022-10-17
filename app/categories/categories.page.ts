import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../services/global.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  global:any;
  name = "";
  constructor(
  	private storage: Storage,
  	private GlobalService: GlobalService,
    public platform: Platform
  ) {
  	this.global = this.GlobalService;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {

        this.platform.backButton.subscribeWithPriority(9999, () => {
          document.addEventListener('backbutton', function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('hello');
          }, false);
        });


        this.storage.get('userSession').then((userSession) => {
            if(userSession != null) {
              this.name = userSession.name;
            } else {
              this.name = ""
            }
        });
  }

  _openModalContacto() {
    this.global._openModalContacto();
  }

}
