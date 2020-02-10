import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CashflowAddService {

  constructor() { }

  formValidations(whichTable) {
    console.log("this is formGroup::::::::::", whichTable)
    for (let key in whichTable.controls) {
      if (whichTable.get(key).invalid) {
        whichTable.get(key).markAsTouched();
        return false;
      }
    }
    return (whichTable.valid) ? true : false;
  }
}
