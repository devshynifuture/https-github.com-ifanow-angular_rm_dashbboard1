import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { from, Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AssetValidationService {
  advisorId: any;
  clientId: any;
  counts:any;
  updateCounts = new Subject();
  constructor(private cusService: CustomerService) { 
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
  }
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

  getAssetCountGLobalData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getAssetCountGlobalData(obj).subscribe(
      (data) => {
        this.counts = data;
        this.updateCounts.next(this.counts);
      }
    );
  }

  passCounts(){
    return this.updateCounts.asObservable();
  }
}
