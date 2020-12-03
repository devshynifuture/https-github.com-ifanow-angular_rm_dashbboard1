import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdviceUtilsService {
  private allAdviceData = new BehaviorSubject('');
  private clientId = new BehaviorSubject('')

  constructor() { }

  static selectAll(flag, dataList, selectedIdList) {
    console.log(dataList)
    let count = 0;
    dataList.forEach(element => {
      element.selected = false;
    });
    dataList.forEach(element => {
      // (element.selected) ? count++ : '';
      element.selected = flag.checked;
      if (flag.checked) {
        count++;
        selectedIdList.push(element.id);
      }
      else {
        count--;
        selectedIdList.forEach(singleId => {
          (singleId == element.id) ? selectedIdList.splice(selectedIdList.indexOf(singleId), 1) : ''
        });
      }
    });
    console.log(count)
    return { selectedIdList, count };

  }
  setStoredAdviceData(value) {
    this.allAdviceData.next(value);

  }
  getStoredAdviceData() {
    return this.allAdviceData.asObservable();
  }
  setClientId(value) {
    this.clientId.next(value);
  }
  getClientId() {
    return this.clientId.asObservable();
  }
  clearStorage() {
    this.setStoredAdviceData({});
  }
  static selectAllIns(flag, dataList, selectedIdList) {
    console.log(dataList)
    let count = 0;
    dataList.forEach(element => {
      element.selected = false;
    });
    dataList.forEach(element => {
      // (element.selected) ? count++ : '';
      element.selected = element.adviceDetails.id ? flag.checked : false;
      if (flag.checked) {
        count++;
        selectedIdList.push(element.adviceDetails);
      }
      else {
        count--;
        selectedIdList.forEach(singleId => {
          (singleId == element.adviceDetails) ? selectedIdList.splice(selectedIdList.indexOf(singleId), 1) : ''
        });
      }
    });
    console.log(count)
    return { selectedIdList, count };

  }
  static selectSingleCheckbox(tableDataSource) {
    let count = 0;
    tableDataSource.filteredData.forEach(element => {
      (element.selected) ? count++ : '';
    });
    return count;
  }
  getForm(data){
  let form;
   if(data.hasOwnProperty('healthInsuranceForm')){
    form = 'healthInsuranceForm';
   }else if(data.hasOwnProperty('personalAccidentForm')){
    form = 'personalAccidentForm';
   }else if(data.hasOwnProperty('critialIllnessForm')){
    form = 'critialIllnessForm';
   }else if(data.hasOwnProperty('motorInsuranceForm')){
    form = 'motorInsuranceForm';
   }else if(data.hasOwnProperty('travelInsuranceForm')){
    form = 'travelInsuranceForm';
   }else if(data.hasOwnProperty('homeInsuranceForm')){
    form = 'homeInsuranceForm';
   }else if(data.hasOwnProperty('fireInsuranceForm')){
    form = 'fireInsuranceForm';
   }
   return form;
  }
}
