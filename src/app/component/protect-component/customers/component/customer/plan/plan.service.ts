import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpService) { }

  getIncomeData(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INCOME_LIST, httpParams)
  }
  addIncomeData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_INCOME_LIST, data)
  }
  editIncomeData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_INCOME_LIST, data)
  }
  getGlobalGrowthRateData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GLOBAL_GROWTH_RATE, data)
  }
  deleteIncome(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_INCOME, data)
  }
  getRiskProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_RISK_PROFILE, data)
  }
  submitRisk(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SUBMIT_RISK, data)
  }
  getGoalGlobalData(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GLOBAL_GOAL_DATA, httpParams);
  }
  addRetirementGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_RETIREMENT_GOAL, data)
  }
  addHouseGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_HOUSE_GOAL, data)
  }
  addCarGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CAR_GOAL, data)
  }
  addMarriageGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_MARRIAGE_GOAL, data)
  }
  addVacationGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_VACATION_GOAL, data)
  }
  addEducationGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EDUCATION_GOAL, data)
  }
  addEmergencyGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EMERGENCY_GOAL, data)
  }
  addWealthCreationGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_WEALTH_CREATION_GOAL, data)
  }
  addBigSpendsGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BIGSPEND_GOAL, data)
  }
  addOthersGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_OTHERS_GOAL, data)
  }
  getListOfFamilyByClient(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIST_FAMILY_MEMBER, httpParams)
  }
  addExpense(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EXPENSE, data)
  }
  editExpense(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_EXPENSE, data)
  }
  getRiskHistory(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.RISK_HISTORY, data)
  }
  getResultRisk(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.RESULT_VIEW, data)
  }
  getTransactionExpense(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_TRANSACTION_EXPENSE, data);
  }
  getRecuringExpense(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.RECURING_EXPENSE_GET, data);
  }
  addRecuringExpense(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.RECURING_EXPENSE_ADD, data);
  }
  editRecuringExpense(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RECURING_EXPENSE_EDIT, data);
  }
  getBudget(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BUDGETS, data);
  }
  addBudget(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_BUDGET, data);
  }
  editBudget(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_BUDGET, data);
  }
  otherCommitmentsGet(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.OTHERCOMMITMENTS_GET, data);
  }
  otherCommitmentsAdd(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.OTHERCOMMITMENTS_ADD, data);
  }
  otherCommitmentsEdit(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.OTHERCOMMITMENTS_EDIT, data);
  }
  deleteExpenseTransaction(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_TRANSACTION_EXPENSE, data)
  }
  deleteExpenseRecurring(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_RECURRING_EXPENSE, data)
  }
  deletBudget(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_BUDGET, data)
  }
  deleteRecuringBudget(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_RECURING_BUDGET, data)
  }
  addManageExclusive(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_MANAGE_EXCLUSIVE, data)
  }
}
