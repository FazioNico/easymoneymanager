import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';

import { HomePage } from '../home/home';
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
  uid:string;
  category: string = "divers";

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    private formBuilder: FormBuilder,
    public fb: FirebaseService
  ) {
    console.log(this.params.get('solde'))
    this.uid = this.fb.fireAuth.currentUser.uid
  }

  addAmount(){
    if(this.amountForm.value.amount){
      let categorie;
      if(typeof this.amountForm.value.category === 'string'){
        categorie = [this.amountForm.value.category]
      }
      else {
        categorie = this.amountForm.value.category
      }
      let total:number = Number(this.params.get('solde')) + Number(this.amountForm.value.amount)
      this.fb.saveUserWallet(total, this.amountForm.value.amount, categorie.toString(), true, this.uid)
      .then(()=>{
        this.navCtrl.setRoot(HomePage, {solde: total});
      })

    }
  }

  removeAmount(){
    if(this.amountForm.value.amount){
      let categorie;
      if(typeof this.amountForm.value.category === 'string'){
        categorie = [this.amountForm.value.category]
      }
      else {
        categorie = this.amountForm.value.category
      }
      let total:number = Number(this.params.get('solde')) - Number(this.amountForm.value.amount)
      this.fb.saveUserWallet(total, this.amountForm.value.amount, categorie.toString(), false, this.uid)
      .then(()=>{
        this.navCtrl.setRoot(HomePage, {solde: total});
      })
    }
  }

  ionViewDidLoad() {
    console.log('Hello add Page');
    this.amountForm = this.formBuilder.group({
      amount: ['', Validators.required],
      category: ['divers', Validators.required]
    });
  }
}
