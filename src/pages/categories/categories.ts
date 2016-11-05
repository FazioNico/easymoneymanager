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
  categories:any[] = [];
  focus: boolean = false;
  newCat: string;

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
    this.fb.userCat.child(uid)
    .on('value', (snapshot)=> {
      if(snapshot.val() != null){
        this.categories = [];
        snapshot.forEach((childSnapshot)=>{
          //console.log(childSnapshot.val())
          this.categories.push(childSnapshot)
        })

      }
    });
  }

  saveCategorie(){
    console.log('Save new categories...');
    this.focus = false
    this.fb.userCat.child(this.uid).push({
      name: this.newCat
    })
    .then(()=>{
      console.log('Categorie save!')
      this.newCat = '';
    })
  }

  goBackPage(){
    this.navCtrl.pop();
  }

  onFocus(){
    console.log(this.newCat)
    if(this.newCat.length >= 2){
      this.focus = true
    }

  }
  dellCategorie(catKey:string){
    console.log('Dell new categories...');
    this.fb.userCat.child(this.uid).child(catKey).remove()
    .then(()=>{
      console.log('Categorie dell!')
    })
    console.log(catKey)
  }

}
