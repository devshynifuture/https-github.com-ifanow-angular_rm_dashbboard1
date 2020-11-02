import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private insuranceData = new BehaviorSubject('')

  constructor() { }

  setInsData(value) {
    this.insuranceData.next(value);
  }
  getInsData() {
    return this.insuranceData.asObservable();
  }
}
