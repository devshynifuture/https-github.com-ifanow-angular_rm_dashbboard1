import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsurancePlanningServiceService {
  private insPlanningData = new BehaviorSubject('')
  private allInsData = new BehaviorSubject('')

  constructor() { }
  setIpData(value) {
    this.insPlanningData.next(value);
  }
  getIpData() {
    return this.insPlanningData.asObservable();
  }
  setAllInsuranceData(value) {
    this.allInsData.next(value);
  }
  getAllInsuranceData() {
    return this.allInsData.asObservable();
  }
  pushId(array){
    if(array){
      array.forEach(element => {
        element.id = element.insurance ? element.insurance.id : element.insuranceDetails.id
      });
    }else{
      array = [];
    }

    return array;
  }
}
