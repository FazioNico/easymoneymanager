import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  category: string;
  catData:string[] = []

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    private formBuilder: FormBuilder,
    public fb: FirebaseService
  ) {
    console.log(this.params.get('solde'))
    let user = this.fb.fireAuth.currentUser
    if(user){
      this.user = user;
      this.loadData()
    }
  }

  loadData(){
    console.log('load user categories');
    this.fb.userCat.child(this.user.uid)
    .on('value', (snapshot)=> {
      if(snapshot.val() != null){
        snapshot.forEach((childSnapshot)=>{
          if(childSnapshot.val().name){
            this.catData.push(childSnapshot.val().name)
          }
        })
        this.category = "Divers";
        this.amountForm = this.formBuilder.group({
          amount: ['', Validators.required],
          category: ['Divers', Validators.required]
        });
      }
    });
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
      let total:number = +(Math.round(this.params.get('solde')*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) + (+(Math.round(this.amountForm.value.amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2))
      this.fb.saveUserWallet(+(Math.round(total*Math.pow(10,2))/Math.pow(10,2)).toFixed(2), +(Math.round(this.amountForm.value.amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2), categorie.toString(), true, this.user.uid)
      .then(()=>{
        this.navCtrl.pop();
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
      let total:number = +(Math.round(this.params.get('solde')*Math.pow(10,2))/Math.pow(10,2)).toFixed(2) - (+(Math.round(this.amountForm.value.amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2))
      this.fb.saveUserWallet(+(Math.round(total*Math.pow(10,2))/Math.pow(10,2)).toFixed(2), +(Math.round(this.amountForm.value.amount*Math.pow(10,2))/Math.pow(10,2)).toFixed(2), categorie.toString(), false, this.user.uid)
      .then(()=>{
        this.navCtrl.pop();
      })
    }
  }

  ionViewDidLoad() {
    console.log('Hello add Page');
    this.amountForm = this.formBuilder.group({
      amount: ['', Validators.required],
      category: ['Divers', Validators.required]
    });
  }
}
