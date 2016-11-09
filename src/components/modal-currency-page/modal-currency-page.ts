import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { FirebaseService } from '../../providers/firebase-service';

/*
  Generated class for the ModalCurrencyPage component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'modal-currency-page',
  templateUrl: 'modal-currency-page.html'
})
export class ModalCurrencyPage {

  user: any;
  devise: string;

  constructor(
    public viewCtrl: ViewController,
    public fb: FirebaseService
  ) {
    this.fb.fireAuth.onAuthStateChanged((user)=> {
        if (user) {
          // User is signed in.
          this.user = user
          this.loadData(this.user.uid)
        } else {
          // No user is signed in.
        }
    });
  }

  loadData(uid){
    this.fb.userProfile.child(uid)
    .on('value', (snapshot)=> {
      if(snapshot.val().devise){
        this.devise = snapshot.val().devise
      }
      else {
        this.devise = 'CHF+';
      }
    });
  }

  saveData(){
    if(this.devise.length >= 1){
      this.fb.userProfile.child(this.user.uid).update({
        devise: this.devise.toUpperCase()
      })
    }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}