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
          this.devise = user.uid
        } else {
          // No user is signed in.
        }
    });
  }

  saveData(){
    if(this.devise.length >= 2){
      console.log('save data-> ',this.devise)
    }
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
