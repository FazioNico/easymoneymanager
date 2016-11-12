import { Component } from '@angular/core';
import { App, NavController, ModalController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { CategoriesPage } from '../categories/categories';
import { ModalCurrencyPage } from '../../components/modal-currency-page/modal-currency-page';

import { FirebaseService } from '../../providers/firebase-service';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  userName:string;
  email:string;
  devise:string;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public fb: FirebaseService,
    private app: App
  ) {
    this.fb.fireAuth.onAuthStateChanged((user)=> {
        if (user) {
          // User is signed in.
          this.loadData(user)
        } else {
          // No user is signed in.
        }
    });
  }

  loadData(user:any){
    this.fb.userProfile.child(user.uid)
    .on('value', (snapshot)=> {
      this.email = snapshot.val().email
      if(snapshot.val().devise){
        this.devise = snapshot.val().devise
      }
      else {
        this.devise = 'CHF';
      }
    });
  }

  goCategorie(){
    this.navCtrl.push(CategoriesPage);
  }

  logout(){
    const root = this.app.getRootNav()
    //this.navCtrl.setRoot(LoginPage);
    this.fb.fireAuth.signOut().then(() =>{
      // Sign-out successful.
      //console.log('user logout')
      root.setRoot(LoginPage);
    }, (error) => {
      // An error happened.
      //console.log('Error with user logout')
    });
  }

  changeDevise(){
    //console.log('changeDevise')
    let modal = this.modalCtrl.create(ModalCurrencyPage);
    modal.present();
  }

}
