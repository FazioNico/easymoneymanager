import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

//import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import firebase from 'firebase';

const firebaseconfig = { // setup your Firebase config
  apiKey: "AIzaSyCgSn3sOEVI4loe5DqQbq1BRuof9PCuhXE",
  authDomain: "easymoneymanager-9d32e.firebaseapp.com",
  databaseURL: "https://easymoneymanager-9d32e.firebaseio.com",
  storageBucket: "easymoneymanager-9d32e.appspot.com",
  messagingSenderId: "501530632587"
};

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {

  rootPage:any;
  constructor(platform: Platform) {

    // init Firebase
    firebase.initializeApp(firebaseconfig);
    // let page = firebase.auth().currentUser ? TabsPage : LoginPage;
    // this.setRoot(page);
    this.rootPage = LoginPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      StatusBar.show();
      StatusBar.overlaysWebView(false);
      StatusBar.styleLightContent();
      StatusBar.backgroundColorByHexString("#d76548");
    });
  }
  private setRoot(newRootPage: any){
    this.rootPage = newRootPage;
  }

}
