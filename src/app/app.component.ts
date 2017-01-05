import { Component, NgZone} from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { FirebaseService } from '../providers/firebase-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform,public fb: FirebaseService, private _ngZone: NgZone) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    /*
    *   Use firebase.onAuthStateChanged() to watch current user auth status
    *   and set or redirect on change, the correct application rootPage 
    */
    this.fb.fireAuth.onAuthStateChanged((user) => {
      /* Use NgZone to fix bug with firebase async load data */
      this._ngZone.run(() => {
        if (user) {
          //console.log('loged')
          this.rootPage = TabsPage;
        }
        else {
          //console.log('not loged')
          this.rootPage = LoginPage;
        }
      });
    });
  }

}
