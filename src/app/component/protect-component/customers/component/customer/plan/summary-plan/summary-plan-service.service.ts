import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryPlanServiceService {
  private incomeData = new BehaviorSubject('')
  private expenseData = new BehaviorSubject('')
  private budgetData = new BehaviorSubject('')
  private dob = new BehaviorSubject('')
  private familyList = new BehaviorSubject('')
  private incomeCount = new BehaviorSubject('')
  private clientId = new BehaviorSubject('')
  private finplanId = new BehaviorSubject('')

  constructor() { }

  setIncomeData(value) {
    this.incomeData.next(value);

  }
  getIncomeData() {
    return this.incomeData.asObservable();
  }
  setIncomeCount(value) {
    this.incomeCount.next(value);

  }
  getIncomeCount() {
    return this.incomeCount.asObservable();
  }
  setExpenseData(value) {
    this.expenseData.next(value);
  }
  getExpenseData() {
    return this.expenseData.asObservable();
  }
  setBudgetData(value) {
    this.budgetData.next(value);
  }
  getBudgetData() {
    return this.budgetData.asObservable();
  }
  setclientDob(value) {
    this.dob.next(value);
  }
  getclientDob() {
    return this.dob.asObservable();
  }
  setFamilyList(value) {
    this.familyList.next(value);
  }
  getFamilyList() {
    return this.familyList.asObservable();
  }
  setClientId(value) {
    this.clientId.next(value);
  }
  getClientId() {
    return this.clientId.asObservable();
  }
  clearStorage() {
    this.setIncomeData('');
    this.setIncomeCount('');
    this.setExpenseData('');
    this.setBudgetData('');
    this.setclientDob('');
    this.setFamilyList('');

    this.setFinPlanId('');
  }
  setFinPlanId(value) {
    this.finplanId.next(value);
  }
  getFinPlanId() {
    return this.finplanId.asObservable();
  }
  getCategoryId(type) {
    let obj={
      insuranceCategoryTypeId:0,
      adviseCategoryTypeMasterId:0
    }
    
    switch (type) {
      case 4:
        obj.insuranceCategoryTypeId = 37
        obj.adviseCategoryTypeMasterId = 4
        break;
      case 5:
        obj.insuranceCategoryTypeId = 34
        obj.adviseCategoryTypeMasterId = 4
        break;
      case 6:
        obj.insuranceCategoryTypeId = 36
        obj.adviseCategoryTypeMasterId = 4
        break;
      case 7:
        obj.insuranceCategoryTypeId = 35
        obj.adviseCategoryTypeMasterId = 4
        break;
      case 8:
        obj.insuranceCategoryTypeId = 38
        obj.adviseCategoryTypeMasterId = 4
        break;
      case 9: 
        obj.insuranceCategoryTypeId = 39
        obj.adviseCategoryTypeMasterId = 4
        break;
      case 10:
        obj.insuranceCategoryTypeId = 40
        obj.adviseCategoryTypeMasterId = 4
        break;
      default:
        break;
    }
    return obj;
  }
}
