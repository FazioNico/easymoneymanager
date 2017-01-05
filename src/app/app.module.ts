import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AddPage } from '../pages/add/add';
import { StatsPage } from '../pages/stats/stats';
import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';
import { CategoriesPage } from '../pages/categories/categories';
import { TabsPage } from '../pages/tabs/tabs';
import { NumberIncrement } from '../components/number-increment/number-increment';
import { ModalCurrencyPage } from '../components/modal-currency-page/modal-currency-page';

import * as firebase from "firebase";
import { FirebaseService } from '../providers/firebase-service';
import { FB_CONFIG } from '../providers/fb-config';
const firebaseconfig:Object = FB_CONFIG;

const app:Array<any> = [MyApp];
const pages:Array<any> = [
  HomePage,
  LoginPage,
  AddPage,
  StatsPage,
  HistoryPage,
  SettingsPage,
  CategoriesPage,
  TabsPage,
  ModalCurrencyPage,
];
const components:Array<any> = [
  NumberIncrement
];
const appConfig:Object = {
  tabsPlacement: 'bottom',
  mode: 'md'
};
const providers:Array<any> =  [
  //{provide: ErrorHandler, useClass: IonicErrorHandler},
  FirebaseService
]

@NgModule({
  declarations: [...app,...pages,...components],
  imports: [
    IonicModule.forRoot(MyApp, appConfig, firebase.initializeApp(firebaseconfig))
  ],
  bootstrap: [IonicApp],
  entryComponents: [...app,...pages],
  providers: [...providers]
})
export class AppModule {}
