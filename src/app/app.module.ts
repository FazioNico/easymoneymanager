import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
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

import { FirebaseService } from '../providers/firebase-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AddPage,
    StatsPage,
    HistoryPage,
    SettingsPage,
    CategoriesPage,
    TabsPage,
    NumberIncrement,
    ModalCurrencyPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      mode: 'md'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AddPage,
    StatsPage,
    HistoryPage,
    SettingsPage,
    CategoriesPage,
    TabsPage,
    ModalCurrencyPage
  ],
  providers: [
    FirebaseService
  ]
})
export class AppModule {}
