import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController } from 'ionic-angular';

import firebase from 'firebase';
//import * as firebase from 'firebase';
/*
  Generated class for the Firebase provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseService {

  fireAuth: any;
  userWallet:any;
  wallet: any;
  userSolde: any;

  userProfile: any;
  walletSolde:any;
  userCat:any;
  currentUserWallet: any;

  constructor(public http: Http, public alertCtrl: AlertController) {
    //console.log('Hello Firebase Provider');
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('/userProfile');
    this.userWallet = firebase.database().ref('/userWallet');
    this.userSolde = firebase.database().ref('/userSolde');
    this.userCat = firebase.database().ref('/userCat');
  }

  loginUser(email: string, password: string): any {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  setCurrentUserWallet(uid, userWallet){
    this.wallet = firebase.database().ref('/wallet/'+ uid)
    this.currentUserWallet = userWallet;
  }

  setUserSolde(uid){
    let userSoleRef = this.userSolde.child(uid)
    userSoleRef.once('value', (snapshot)=> {
      if(snapshot.val() != null){
        this.walletSolde = snapshot.val().solde
        //console.log('userSole ->', this.walletSolde)
      }
    });
  }

  saveUserWallet(totalWallet, amountItem, categorie, status, dateTime, uid){
    return this.userSolde.child(uid).set({
      solde: totalWallet
    })
    .then(()=>{
      this.userWallet.child(uid).push({
            price: amountItem,
            category: categorie,
            status: status,
            timestamp:dateTime
          })
    })
  }

  resetPassword(email: string): any {
    return this.fireAuth.sendPasswordResetEmail(email);
  }
}
