import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { FirebaseService } from '../../providers/firebase-service';


/*
  Generated class for the History page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {

  uid: number;
  solde: number;
  devise: string;
  wallet: any;
  userWallet:any;
  nbr:number = 10
  loader:any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public loadCtrl:LoadingController,
    public fb: FirebaseService
  ) {
    if (this.params.get('userID') && this.params.get('userSolde')){
      //console.log('params-> userID:',this.params.get('userID'))
      //console.log('params-> devise:',this.params.get('devise'))
      this.uid = this.params.get('userID')
      this.solde = this.params.get('userSolde')
      this.devise = this.params.get('devise')
      this.loadHistoryWallet(this.uid);
    }
    else {
      this.navCtrl.setRoot(LoginPage);
    }
  }

  /* Core Methode */
  loadHistoryWallet(uid:number){
    this.loader = this.loadCtrl.create({
      content: "Chargement..."
    });
    this.loader.present();

    this.userWallet = this.fb.userWallet.child(uid).limitToLast(this.nbr);
    this.userWallet.on('value', (snapshot)=> {
      if(snapshot.val() != null){
        let arrayVal = [];
        snapshot.forEach((childSnapshot)=>{
          let dataReady = childSnapshot.val();
          dataReady.id = childSnapshot.key
          arrayVal.push(dataReady)
        })
        let arrayValSortedBy:any[] = this.sortObj(arrayVal, 'timestamp');
        this.wallet = arrayValSortedBy.reverse();
        this.hideLoading()
      }
    });
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

  /* Events Methode */
  ionViewDidLoad() {
  }

  dellEntry(event,itemID,status, amount){
    //console.log(itemID,status, amount)
    this.loader = this.loadCtrl.create({
      dismissOnPageChange: true,
    });
    this.loader.present();
    let newSolde:number;
    switch (status) {
      case true:
        newSolde = +(Math.round(this.solde*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) - (+(Math.round(amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2))
        break;
      case false:
        newSolde = +(Math.round(this.solde*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) + (+(Math.round(amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2))
        break;
    }
    this.fb.userWallet.child(this.uid + '/' + itemID).remove()
    .then(()=>{
      this.fb.userSolde.child(this.uid).update({
        solde: newSolde
      })
    })
    .then(()=>{
      this.loader.dismiss();
    })
  }

  /* View Methode */
  setSolde(amount:number):string{
    let amountRef = amount
    if (parseInt(amount.toString()) === amountRef)  {
      return amountRef.toString() + '.-'
    }
    else {
      return amountRef.toString()
    }
  }

  cvtTimestamp(timestamp){
    let date = new Date(timestamp );
    //let formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + '<br/> ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    let formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
      return formattedDate;
  }

  loadMore(event){
    this.nbr = this.nbr + 10
    this.loadHistoryWallet(this.uid)
  }

  private hideLoading(){
    this.loader.dismiss();
  }
}
