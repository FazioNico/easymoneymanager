import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FirebaseService } from '../../providers/firebase-service';

/*
  Generated class for the Categories page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {

  uid:number;
  categories:string[];

  constructor(
    public navCtrl: NavController,
    public fb: FirebaseService
  ) {
    let user = this.fb.fireAuth.currentUser
    if(user!= null){
      this.uid = user.uid
      this.loadData(this.uid)
    }
  }

  ionViewDidLoad() {
    console.log('Hello Categories Page');
  }

  loadData(uid){
    console.log('load user categories');
  }

  saveCategorie(){
    console.log('Save new categories');
  }

  goBackPage(){
    this.navCtrl.pop();
  }

}
