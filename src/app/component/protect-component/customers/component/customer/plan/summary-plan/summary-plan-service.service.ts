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
}
