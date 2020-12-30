import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { from, Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AssetValidationService {
  advisorId: any;
  clientId: any;
  counts: any;
  updateCounts = new Subject();
  fixDataList: any;
  recDataList: any;
  bondDataList: any;
  realEstateList: any;
  npsDatalist: any;
  gratuityDatalist: any;
  epfDatalist: any;
  ppflist: any;
  nsclist: any;
  ssylist: any;
  kvplist: any;
  scsslist: any;
  poSavingslist: any;
  pordlist: any;
  potdlist: any;
  pomislist: any;
  cashDataList: any;
  bankDataList: any;
  goldDataList: any;
  otherDataList: any;
  otherAssetsList: any
  private assetCount = new BehaviorSubject<any>({});
  assetCountObserver = this.assetCount.asObservable();

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
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1
    };
    this.cusService.getAssetCountGlobalData(obj).subscribe(
      (data) => {
        this.counts = data;
        this.updateCounts.next(this.counts);
      }
    );
  }

  passCounts() {
    return this.updateCounts.asObservable();
  }

  addAssetCount(obj: object) {
    this.assetCount.next(obj);
  }
  assetCountUnsubscribe() {
    this.assetCount.unsubscribe();
  }
}
