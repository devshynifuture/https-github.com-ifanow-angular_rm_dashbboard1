import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsurancePlanningServiceService {
  private insPlanningData = new BehaviorSubject('')

  constructor() { }
  setIpData(value) {
    this.insPlanningData.next(value);
  }
  getIpData() {
    return this.insPlanningData.asObservable();
  }
}
