import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDataService {

  constructor() { }
  static subscriptionStepData
  static setLoderFlag(data) {
    this.subscriptionStepData = data;
  }
  static getLoderFlag(stepNo) {
    let tempData;
    tempData = Object.assign([], this.subscriptionStepData);
    tempData = tempData.filter(element => element.stepTypeId == stepNo);
    if (tempData.length == 0) {
      tempData =
        [{
          completed: true
        }]
    }
    return tempData[0].completed;
  }
}
