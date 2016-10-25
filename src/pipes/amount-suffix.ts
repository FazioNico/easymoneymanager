import { PipeTransform, Pipe } from '@angular/core';

/*
  Generated class for the AmountSuffix pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/

@Pipe({name: 'amountsuffix'})
export class AmountSuffix implements PipeTransform {
  transform(value): string {
    let amountRef = value
    if (parseInt(value.toString()) === amountRef)  {
      return value + '.-';
    }
    else {
      return value
    }
  }
}
