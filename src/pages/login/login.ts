import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

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
    // set the form with Angular FormBuilder
    this.user = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
    });
  }

  /* Events Methode */
  ionViewDidLoad() {
    //console.log('Hello Login Page');
  }

  logForm(){
    //console.log('login user ->', this.user.value)
    this.fb.loginUser(this.user.value.email, this.user.value.password)
    .then( authData => {
      /*
      *  user is loged and rootpage is set by
      *  Firebase isAuth provider on app.component.ts
      */
    }, error => {
      this.showError( error.message ,false)
    })
    .catch(error => this.showError( error.message ,false))

  }

  goToSignup(){
    console.log('Signup user ->', this.user.value)
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
      console.log('user signed')
      this.loader.dismiss();
      // save user info in firebase.database
      this.saveUserInfo(data)
    })
    .catch((error) =>{
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      this.showError(errorMessage ,true)
      return;
    });
  }

  resetPassword(){
    if(!this.user.value.email){
      this.showError("Pour obtenire un nouveau mot de passe, tu dois remplire le champ email",false)
      return;
    }
    // reset user password
    this.fb.resetPassword(this.user.value.email)
    // show result in alert box
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: `Un nouveau mot de pass à été envoyé à l'adresse mail: ${this.user.value.email}`,
      buttons: ['OK']
    });
    alert.present();
    // reset form value
    this.user.reset()
  }

  /* Core Methode */

  saveUserInfo(authenticatedUser:any){
    console.log('save user info ->', authenticatedUser)
    this.fb.userProfile.child(authenticatedUser.uid).set({
      email: authenticatedUser.email,
      devise: 'CHF',
      blur: false
    }).then(() => {
      //console.log('user Creat & loged')
    })
    .catch(error=>{
      console.log('Error Create & loged -> ', error)
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      this.showError(errorMessage ,true)
      return;
    });

    //console.log('create user wallet')
    this.fb.userWallet.child(authenticatedUser.uid).push({
      price: 0,
      status: true,
      timestamp: Date.now()
    })
    .catch(error=>{
      console.log('Error user wallet -> ', error)
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      this.showError(errorMessage ,true)
      return;
    });

    //console.log('create walletSolde')
    this.fb.userSolde.child(authenticatedUser.uid).set({
      solde: 0
    }).then(()=>{
      //this.fb.setUserSolde(authenticatedUser.uid);
    })
    .catch(error=>{
      console.log('Error user Solde -> ', error)
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      this.showError(errorMessage ,true)
      return;
    });

    console.log('create user categories')
    this.cats.map((cat)=>{
      this.fb.userCat.child(authenticatedUser.uid).push({
        name: cat
      })
      .then((result)=>{
        //console.log('add cat-> ', result)
      })
      .catch(error=>{
        console.log('Error add cat -> ', error)
        // Handle Errors here.
        //var errorCode = error.code;
        var errorMessage = error.message;
        this.showError(errorMessage ,true)
        return;
      });
    })
  }

  /* Errors Handler Methodes */
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
