import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../tabs/tabs';

import { FirebaseService } from '../../providers/firebase-service';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user:any;
  login:number = 0;
  loader:any;
  cats:Array<string> = [
    'Alimentation',
    'Divers',
    'Assurence',
    'Téléphone',
    'Internet',
    'Cigarette',
    'Salaire'
  ];

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public fb: FirebaseService,
    public alertCtrl: AlertController,
    public loadCtrl:LoadingController
  ) {
    this.fb.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.setRoot(TabsPage);
      }
      else {
        this.login = 1;
      }
    });
  }

  /* Events Methode */

  ionViewDidLoad() {
    //console.log('Hello Login Page');
    this.user = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  logForm(){
    //console.log('login user ->', this.user.value)
    this.fb.loginUser(this.user.value.email, this.user.value.password)
    .then( authData => {
      this.navCtrl.setRoot(TabsPage);
    }, error => {
      this.showError( error.message ,false)
    });
  }

  goToSignup(){
    //console.log('Signup user ->', this.user.value)
    if(!this.user.value.email && !this.user.value.password){
      this.showError("Tous les champs sont obligatoires",false)
      return;
    }
    this.loader = this.loadCtrl.create({
      dismissOnPageChange: true,
    });
    this.loader.present();
    this.fb.fireAuth.createUserWithEmailAndPassword(this.user.value.email, this.user.value.password)
    .then((data) => {
      //console.log('user signed')
      this.loader.dismiss();
      // save user info in firebase.database
      this.saveUserInfo(data)
    })
    .catch((error) =>{
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      this.showError(errorMessage ,true)
      return;
    });
  }

  /* Core Methode */

  saveUserInfo(authenticatedUser:any){
    //console.log('save user info ->', authenticatedUser)
    this.fb.userProfile.child(authenticatedUser.uid).set({
      email: authenticatedUser.email,
      devise: 'CHF',
      blur: false
    }).then(() => {
      //console.log('user Creat & loged')
    });
    //console.log('create user wallet')
    this.fb.userWallet.child(authenticatedUser.uid).push({
      price: 0,
      status: true,
      timestamp: Date.now()
    })
    //console.log('create walletSolde')
    this.fb.userSolde.child(authenticatedUser.uid).set({
      solde: 0
    }).then(()=>{
      //this.fb.setUserSolde(authenticatedUser.uid);
    })
    //console.log('create user categories')
    this.cats.map((cat)=>{
      this.fb.userCat.child(authenticatedUser.uid).push({
        name: cat
      })
    })
  }

  showError(text:string,hideLoading:boolean=true) {
    if (hideLoading === true){
      setTimeout(() => {
        this.loader.dismiss();
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Erreur',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
