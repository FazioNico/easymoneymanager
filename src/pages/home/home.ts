import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { AddPage } from '../add/add';
import { HistoryPage } from '../history/history';
import { FirebaseService } from '../../providers/firebase-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  uid: number;
  title: string;
  solde: number;
  devise: string;
  isFloat: boolean = true;
  isBlur:boolean = false;
  loader:any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public fb: FirebaseService
  ) {

    this.title = 'Welcome to Ionic 2 RC.1 updated';
    this.devise = 'CHF';
    this.loader = this.loadingCtrl.create({
      content: "Chargement..."
    });
    this.loader.present();

    this.fb.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.loadUserWallet(this.uid);
        this.loadUserSettings(this.uid);
      }
    })
  }

  loadUserWallet(uid){
    this.fb.userSolde.child(uid).on('value', (snapshot)=> {
      if(snapshot.val() != null){
        this.setSolde(snapshot.val().solde)
        this.hideLoading()
      }
    })
  }

  loadUserSettings(uid){
    this.fb.userProfile.child(uid)
    .on('value', (snapshot)=> {
      console.log(snapshot.val())
      if(snapshot.val() != null || snapshot.val().blur){
        this.isBlur = snapshot.val().blur
      }
      else {
        this.isBlur = false
      }
      (this.isBlur === true) ?  document.querySelector('h1').classList.add("blur") : document.querySelector('h1').classList.remove("blur");
    });
  }

  setSolde(amount:number){
    this.solde = amount
    if (parseInt(this.solde.toString()) === this.solde)  {
      this.isFloat = false;
    }
  }

  goToLink(event,page){
    switch (page) {
      case 'add':
        this.navCtrl.push(AddPage, {solde: this.solde});
        break;
      case 'history':
        this.navCtrl.push(HistoryPage, {userID: this.uid, userSolde: this.solde});
        break;

    }
  }
  sortObj(list, key) {
      function compare(a, b) {
          a = a[key];
          b = b[key];
          let type = (typeof(a) === 'string' ||
                      typeof(b) === 'string') ? 'string' : 'number';
          let result;
          if (type === 'string') result = a.localeCompare(b);
          else result = a - b;
          return result;
      }
      return list.sort(compare);
  }
  onBlur(){
    this.fb.userProfile.child(this.uid).update({
      blur: !this.isBlur
    })
  }

  private hideLoading(){
    this.loader.dismiss();
  }
}
