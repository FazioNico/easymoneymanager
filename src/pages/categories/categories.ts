import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

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
  categories:Array<any> = [];
  focus: boolean = false;
  newCat: string;
  loader:any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public fb: FirebaseService
  ) {
    let user = this.fb.fireAuth.currentUser
    if(user!= null){
      this.uid = user.uid
      this.loader = this.loadingCtrl.create({
        content: "Chargement..."
      });
    }
  }

  /* Events Methode */

  ionViewDidLoad() {
    if(this.uid){
      this.loader.present();
      this.loadData(this.uid)
    }
  }

  onKeyUp(){
    console.log(this.newCat.length);
    (this.newCat.length >= 2) ? this.focus = true : this.focus = false
  }

  saveCategorie(){
    //console.log('Save new categories...');
    this.focus = false
    this.fb.userCat.child(this.uid).push({
      name: this.newCat
    })
    .then(()=>{
      //console.log('Categorie save!')
      this.newCat = '';
    })
  }

  dellCategorie(catKey:string){
    //console.log('Dell new categories...');
    this.fb.userCat.child(this.uid).child(catKey).remove()
    .then(()=>{
      //console.log('Categorie dell!')
    })
  }

  /* Core Methode */
  loadData(uid){
    this.fb.userCat.child(uid)
    .on('value', (snapshot)=> {
      if(snapshot.val() != null){
        this.categories = [];
        snapshot.forEach((childSnapshot)=>{
          //console.log(childSnapshot.val().name)
          if(childSnapshot.val().name){
            this.categories.push(childSnapshot)
          }
        })
        this.hideLoading()
      }
      else {
        this.hideLoading()
      }
    });
  }

  private hideLoading(){
    this.loader.dismiss();
  }

}
