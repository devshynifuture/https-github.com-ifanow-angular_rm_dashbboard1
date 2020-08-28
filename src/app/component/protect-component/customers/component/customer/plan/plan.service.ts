import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(private http: HttpService) { }
  public assetSubject = new Subject();

  getIncomeData(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('addMonthlyDistribution', data.addMonthlyDistribution);
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
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_INCOME + 'id=' + data, '')
  }
  deleteBonusInflow(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_INFLOW_BONUS + 'id=' + data, '')
  }
  deleteOtherIncome(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.INCOME_OTHER_DELETE + 'id=' + data, '')
  }
  deleteAllowanceIncome(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.INCOME_ALLOWANCE_DELETE + 'id=' + data, '')
  }
  deletePerquisitesIncome(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.INCOME_PERQUISITES_DELETE + 'id=' + data, '')
  }
  deleteReimbursementIncome(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.INCOME_REIMBURSEMENT_DELETE + 'id=' + data, '')
  }
  deleteRetiralIncome(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.INCOME_RETIRAL_DELETE + 'id=' + data, '')
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
  addMultiYearGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_MULTI_YEAR_GOAL, data)
  }
  addSingleYearGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SINGLE_YEAR_GOAL, data)
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
  editManageExclusive(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_MANAGE_EXCLUSIVE, data)
  }
  deleteDeployment(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_DEPLOYMENT, data);
  }
  getFilterGoalScheme(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set("clientId", data.clientId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.ADD_FILTER_SCHEME_LIST, httpParams);
  }
  getDeploymentDetailsdata(data) {
    let httpParams = new HttpParams().set('deploymentIds', data.deploymentIds);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DEPLOYMENT_DETAILS, httpParams)
  }
  getMututalFundSchemeData() {
    let httpParams = new HttpParams();
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MUTUAL_FUND_SCHEME, httpParams)
  }
  addPurchaseScheme(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_PURCHASE_SCHEME, data)
  }
  getAssetsForAllocation(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ALL_ASSETS, data);
  }
  getAllGoals(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set("clientId", data.clientId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ALL_GOALS, httpParams);
  }
  deleteGoal(data) {
    let httpParams = new HttpParams().set('goalId', data.goalId).set("goalType", data.goalType).set('id',data.id)
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_GOAL + '?' + httpParams, '');
  }

  calculateEMI(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.CALCULATE_GOAL_EMI, data);
  }

  saveEMIToGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SAVE_GOAL_EMI, data);
  }

  calculateCostToDelay(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.CALCULATE_GOAL_DELAY, data);
  }

  saveCostToDelay(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SAVE_COST_DELAY_TO_GOAL, data);
  }

  saveMultiGoalPreference(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_MULTI_YEAR_GOAL_PREFERENCE, data);
  }

  saveSingleGoalPreference(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_SINGLE_YEAR_GOAL_PREFERENCE, data);
  }

  saveAssetPreference(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SAVE_ASSET_ALLOCATION_PREFERENCE, data);
  }
  // updatePrefrencesStaticAllocation(data) {
  //   return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_PREF_STATIC_ALLOCATION, data)
  // }
  // updateInflamationReturns(data) {
  //   return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_INFLAMATION_RETURNS, data)
  // }
  getMFList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MF_DATA, data);
  }

  allocateOtherAssetToGoal(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SAVE_ASSET_TO_GOAL, data);
  }

  removeAllocation(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.REMOVE_ALLOCATION, data);
  }
  getInsurancePlaningList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INSURANCE_LIST, data);
  }
  getBudgetGraph(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BUDGET_GRAPH, data);
  }
  getExpenseGraph(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.EXPENSE_GRAPH, data);
  }
  addInsurance(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_INSURANCE, data);
  }
  getFamilyDetailsInsurance(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FAMILYMEMBER_DETAILS, data);
  }
  getLifeInuranceNeedAnalysis(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_LIFE_NEED_ANALYSIS, data);
  }
  addLifeInsuranceAnalysisMapToPlan(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ADD_LIFE_NEED_ANALYSIS_MAP, data);
  }
  saveLifeInsuranceAnalysis(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.LIFE_ANALYSIS_ADD, data);
  }
  removeLifeInsuranceAnalysisMapToPlan(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.REMOVE_LIFE_NEED_ANALYSIS_MAP, data);
  }
  getDetailsInsurance(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DETAILED_INSURANCE, data);
  }
  getAssetsOfExpense(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.ASSTES_OF_EXPENSE, data)
  }
  getAllExpense(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.EXPENSE_ALL_GET, data)
  }
  deleteInsurancePlanning(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_INSURANCE_INPLANNING+ 'id=' + data, '')
  }
  getInsuranceRecommendation(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.RECOMMENDATION_LIST_GET+ 'id=' + data, '')
  }
  getInsuranceAdvice(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.INSURANCE_ADVICE_GET, data)
  }
  getSuggestPolicy(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.SUGGEST_POLICY_GET, data)
  }
}
