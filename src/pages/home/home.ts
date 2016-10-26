import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  solde: number = 0;
  devise: string;
  isFloat: boolean = true;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public fb: FirebaseService
  ) {

    this.title = 'Welcome to Ionic 2 RC.1 updated';
    this.devise = 'CHF';
    this.uid = this.fb.fireAuth.currentUser.uid
    if (this.params.get('solde')){
      console.log('params-> ',this.params.get('solde'))
      this.setSolde(this.params.get('solde'))
    }
    else {
      this.loadUserWallet(this.uid);
    }

  }

  loadUserWallet(uid){
    let userSoldeRef = this.fb.userSolde.child(uid);
    userSoldeRef.on('value', (snapshot)=> {
      if(snapshot.val() != null){
        this.setSolde(snapshot.val().solde)
      }
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
    document.querySelector('h1').classList.toggle("blur")
  }
}
