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
  otherAssetsList: any;
  stockDataList: any;
  private assetCount = new BehaviorSubject<any>({});
  assetCountObserver = this.assetCount.asObservable();

  constructor(private cusService: CustomerService) {
    if (AuthService.getUserInfo()) {
      this.advisorId = AuthService.getAdvisorId();
      this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    }
  }

  clearAssetData() {
    this.fixDataList = null;
    this.recDataList = null;
    this.bondDataList = null;
    this.realEstateList = null;
    this.npsDatalist = null;
    this.gratuityDatalist = null;
    this.epfDatalist = null;
    this.ppflist = null;
    this.nsclist = null;
    this.ssylist = null;
    this.kvplist = null;
    this.scsslist = null;
    this.poSavingslist = null;
    this.pordlist = null;
    this.potdlist = null;
    this.pomislist = null;
    this.cashDataList = null;
    this.bankDataList = null;
    this.goldDataList = null;
    this.otherDataList = null;
    this.otherAssetsList = null;
    this.stockDataList = null;
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
