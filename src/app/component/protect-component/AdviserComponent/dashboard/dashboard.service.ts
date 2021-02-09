import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  static dashChartData: any;
  static dashMisData: any;
  static dashPointForTask: any;
  static dashGoalSummaryData: any;
  static dashLastSevenDaysInvestmentAccounts: any;
  static dashLatesAumReconciliationData: any;
  static dashSevenDaysTransactions: any;
  static dashLastSevenDaysTransactions: any;
  static dashLastSevenDaysTransactionsNew: any;
  static dashLatesAumReconciliationDataRes: any;
  static staticdashInitPointForTask: any
  static dashDocumentTotalSize: any;
  static dashLast7DaysTransactionStatus: any;
  static dashBirthdayOrAnniversary: any;
  static dashInitializePieChart: any;
  static dashRecentTransactionData: any;
  static dashKeyMetrics: any;
  static dashSummaryDataDashboard: any;
  static dashClientWithSubscription: any;
  static dashTotalRecivedByDash: any;
  static dashAnswerData: any;
  static dashTaskDashboardCount: any;
  static dashTodaysTaskList: any;
  static dashTodoListData: any;
  static allTransactions: any;
  constructor(private http: HttpService) {
  }

  static clearDashData() {
    DashboardService.dashChartData = null;
    DashboardService.dashMisData = null;
    DashboardService.dashPointForTask = null;
    DashboardService.dashGoalSummaryData = null;
    DashboardService.dashLastSevenDaysInvestmentAccounts = null;
    DashboardService.dashLatesAumReconciliationData = null;
    DashboardService.dashSevenDaysTransactions = null;
    DashboardService.dashLastSevenDaysTransactions = null;
    DashboardService.dashLastSevenDaysTransactionsNew = null;
    DashboardService.dashLatesAumReconciliationDataRes = null;
    DashboardService.staticdashInitPointForTask = null;
    DashboardService.dashDocumentTotalSize = null;
    DashboardService.dashLast7DaysTransactionStatus = null;
    DashboardService.dashBirthdayOrAnniversary = null;
    DashboardService.dashInitializePieChart = null;
    DashboardService.dashRecentTransactionData = null;
    DashboardService.dashKeyMetrics = null;
    DashboardService.dashSummaryDataDashboard = null;
    DashboardService.dashClientWithSubscription = null;
    DashboardService.dashTotalRecivedByDash = null;
    DashboardService.dashAnswerData = null;
    DashboardService.dashTaskDashboardCount = null;
    DashboardService.dashTodaysTaskList = null;
    DashboardService.dashTodoListData = null;
    DashboardService.allTransactions = null;
  }

  addNotes(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NOTES, data);
  }

  updateNotes(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_NOTES, data);
  }

  deleteNotes(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_NOTES, data);
  }

  getNotes(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NOTES, httpParams);
  }

  getLastSevenDaysTransactions(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.LAST_7_DAYS_TRANSACTION, data, 1);
  }
  getLastSevenDaysTransactionsNew(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.LAST_7_DAYS_TRANSACTION_NEW, data);
  }
  getLastSevenDaysInvestmentAccounts(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.LAST_7_DAYS_INVESTMENT_ACCOUNTS, data, 1);
  }

  getBirthdayOrAnniversary(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('fromDate', data.fromDate).set('toDate', data.toDate);
    return this.http.get(apiConfig.USER + appConfig.GET_BIRTHDAY_OR_ANNIVERSARY, httpParams);
  }

  getKeyMetrics(data) {
    let httpParams = new HttpParams();
    for (const key of Object.keys(data)) {
      httpParams = httpParams.set(key, data[key]);
    }
    return this.http.get(apiConfig.MAIN_URL + appConfig.KEY_METRICS_ADVISOR_DASHBOARD, httpParams);
  }



  last7DaysTransactionStatus(data) {
    return this.http.getEncoded(apiConfig.TRANSACT + appConfig.LAST_7_DAYS_TRANSACTION_STATUS, data, 1);
  }

  getDocumentTotalSize(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.DOCUMENT_TOTAL_COUNT_SIZE, httpParams);
  }

  getLatestAumReconciliation(data) {
    let httpParams = new HttpParams().set('id', data.id);
    return this.http.get(apiConfig.MAIN_URL + appConfig.LATEST_AUM_RECON, httpParams);
  }

  getGoalSummarydata(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_GOAL_SUMMARY, httpParams);
  }

  getTaskDashboardCountValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_TASK_DASHBOARD_COUNT, data);
  }

  getChartData(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('targetDate', data.targetDate);
    return this.http.get(apiConfig.MAIN_URL + appConfig.DASHBOARD_CHART, httpParams);
  }

  onBoardingQuestionMaster(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.QUESTION_MASTER, data);
  }

  onBoardingQuestionAnswer(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.QUESTION_ANSWER_ADD, data);
  }

  getOnBoardingQuestionAnswer(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.QUESTION_ANSWER_GET, httpParams);
  }

  static setTaskMatrix(data) {
    sessionStorage.setItem('taskMatrix', JSON.stringify(data));
  }

  static getTaskMatrix() {
    return JSON.parse(sessionStorage.getItem('taskMatrix'));
  }

  static setTodaysTaskList(data) {
    sessionStorage.setItem('todaysTaskList', JSON.stringify(data));
  }

  static getTodaysTaskList() {
    return JSON.parse(sessionStorage.getItem('todaysTaskList'));
  }

}
