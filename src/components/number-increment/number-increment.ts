import { Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
//import { IONIC_DIRECTIVES } from 'ionic-angular';

/*
  Generated class for the NumberIncrement component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'nbrInc',
  templateUrl: 'number-increment.html'
})
export class NumberIncrement implements OnChanges{

  @Input() inputData: any;
  solde:number = 0;

  constructor(
    private cdRef:ChangeDetectorRef
  ) {
    //this.increment();
  }

  ngOnChanges(changes: SimpleChanges){
    //console.log('simple change')
    this.solde = -0; // reset solde if input data === 0
    this.increment();
  }

  increment(){
    if(this.inputData){
      let fps = 1000 / 60,
          increment = (this.inputData / 1000) * fps;
      let timer = setInterval(() => {
        if(this.solde < this.inputData) {
          this.solde += Math.round(increment);
        } else {

          this.solde = +parseFloat(this.inputData.toString()).toFixed(2)
          clearInterval(timer);
        }
        /* Fix bug detect propreties Changes with setInterval */
        this.cdRef.detectChanges()
      }, 1);
    }
  }

}
