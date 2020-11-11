import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private insuranceData = new BehaviorSubject('')
  private loadedData = new BehaviorSubject('')
  private allInsData = new BehaviorSubject('')

  constructor() { }

  setInsData(value) {
    this.insuranceData.next(value);
  }
  getInsData() {
    return this.insuranceData.asObservable();
  }
  setdataLoaded(value) {
    this.loadedData.next(value);
  }
  getdataLoaded() {
    return this.loadedData.asObservable();
  }
  setAllInsuranceList(value) {
    this.allInsData.next(value);
  }
  geetAllInsuranceList() {
    return this.allInsData.asObservable();
  }
}
