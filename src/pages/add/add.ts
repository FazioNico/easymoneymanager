import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';

import { FirebaseService } from '../../providers/firebase-service';

/*
  Generated class for the Add page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {

  amountForm:any;
  user:any;
  devise:string;
  category: string = "Divers";
  catData:Array<string> = [];
  loader:any;
  date:Date = new Date()
  dateNow:string = this.date.toISOString()
  thisYear:number = this.date.getFullYear()

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public params: NavParams,
    private formBuilder: FormBuilder,
    public fb: FirebaseService
  ) {
    this.amountForm = this.formBuilder.group({
      amount: ['', Validators.required],
      category: ['Divers', Validators.required]
    });

    let user = this.fb.fireAuth.currentUser
    if(user){
      this.user = user;
      this.loader = this.loadingCtrl.create({
        content: "Chargement..."
      });
      this.loader.present();
      this.loadData()
    }
    this.devise = this.params.get('devise')
  }

  /* Events Methode */
  ionViewDidLoad() {

  }

  addAmount(remove,add){
    if(this.amountForm.value.amount){
      // disable form button after click
      remove._elementRef.nativeElement.disabled = true
      add._elementRef.nativeElement.disabled = true
      this.calculat(true)
    }

  }

  removeAmount(remove,add){
    if(this.amountForm.value.amount){
      // disable form button after click
      remove._elementRef.nativeElement.disabled = true
      add._elementRef.nativeElement.disabled = true
      this.calculat(false)
    }
  }

  /* Core Methode */

  loadData(){
    //console.log('load user categories');
    this.fb.userCat.child(this.user.uid)
    .on('value', (snapshot)=> {
      if(snapshot.val() != null){
        this.catData = [];
        snapshot.forEach((childSnapshot)=>{
          if(childSnapshot.val().name){
            this.catData.push(childSnapshot.val().name)
          }
        })
        this.amountForm = this.formBuilder.group({
          amount: ['', Validators.required],
          category: ['Divers', Validators.required]
        });
        this.hideLoading()
      }
    });
  }

  calculat(dataType:boolean){
    let categorie:any;
    let total:number;
    let amount:number = +(Math.round((this.amountForm.value.amount) * 100) / 100).toFixed(2);
    if(typeof this.amountForm.value.category === 'string'){
      categorie = [this.amountForm.value.category]
    }
    else {
      categorie = this.amountForm.value.category
    }
    switch (dataType) {
      case true:
        total = +(Math.round((this.params.get('solde') + (+amount)) * 100) / 100).toFixed(2)
        break;
      case false:
        total= +(Math.round((this.params.get('solde') - (+amount)) * 100) / 100).toFixed(2)
        break;
    }
    // Convert Date.toISOString() to DateTime
    let dateTime = Date.parse(this.dateNow)
    //console.log('date-> ', dateTime)
    this.save(+total,+amount,categorie,dataType, dateTime)
  }

  save(total:number, amount:number, categorie:any, dataType:boolean, dateTime:number){
    this.fb.saveUserWallet(total, +amount.toFixed(2), categorie.toString(), dataType, dateTime, this.user.uid)
    .then(()=>{
      this.navCtrl.pop();
    })
  }

  private hideLoading(){
    this.loader.dismiss();
  }
}
