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
  solde: number;
  devise: string = 'CHF';
  isFloat: boolean = true;
  isBlur:boolean = false;
  loader:any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public fb: FirebaseService
  ) {

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

  /* Events Methode */
  goToLink(event,page){
    switch (page) {
      case 'add':
        this.navCtrl.push(AddPage, {solde: this.solde, devise: this.devise});
        break;
      case 'history':
        this.navCtrl.push(HistoryPage, {userID: this.uid, userSolde: this.solde, devise: this.devise});
        break;
    }
  }

  onBlur(){
    this.fb.userProfile.child(this.uid).update({
      blur: !this.isBlur
    })
  }

  /* Core Methode */

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
      //console.log(snapshot.val())
      if(snapshot.val() != null || snapshot.val().blur){
        this.isBlur = snapshot.val().blur
      }
      else {
        this.isBlur = false
      }
      if(snapshot.val().devise){
        this.devise = snapshot.val().devise
      }
      (this.isBlur === true) ?  document.querySelector('h1').classList.add("blur") : document.querySelector('h1').classList.remove("blur");
    });
  }

  setSolde(amount:number){
    // console.log(amount)
    this.solde = amount
    if (parseInt(this.solde.toString()) === this.solde)  {
      this.isFloat = false;
    }
  }

  private hideLoading(){
    this.loader.dismiss();
  }
}
