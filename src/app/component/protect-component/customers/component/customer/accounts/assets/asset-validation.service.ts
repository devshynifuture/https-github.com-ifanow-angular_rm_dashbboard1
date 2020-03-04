import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AssetValidationService {

  constructor() { }
  static ageValidators(age: Number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return;
      }
      if (control.value.age < age) {
        return { isaAgeInvalid: true }
      }
      return null;
    }
  }
}
