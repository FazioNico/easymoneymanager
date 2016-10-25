import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public fb: FirebaseService
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
    });
  }

  logout(){
    this.fb.fireAuth.signOut().then(function() {
      // Sign-out successful.
      console.log('user logout')
    }, function(error) {
      // An error happened.
      console.log('Error with user logout')
    });
  }

}
