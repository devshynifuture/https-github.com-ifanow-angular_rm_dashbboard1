import { Injectable } from '@angular/core';

import { appConfig } from './../../../config/component-config';
import { apiConfig } from './../../../config/main-config';
import { HttpService } from './../../../http-service/http-service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HttpService) { }

  private subject = new BehaviorSubject<any>('');

  getOnboardingTaskGlobal(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ONBOARDING_TASK_GLOBAL, data);
  }

  getFileTypeOrder(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FILE_TYPE_ORDER, data);
  }

  getMyIFAValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MY_IFA_DETAILS, data);
  }

  getBackofficeAumOrderListValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_ORDER_LIST, data);
  }

  getAumReconListGetValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_GET_AUM_RECON_LIST, data)
  }

  putAumTransactionKeepOrRemove(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_TRANSACTION_KEEP_OR_REMOVE, data);
  }

  getBackofficeReports(data) {
    return null;
  }

  getDailyServicesStatusReport(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DAILY_SERVICES_STATUS_REPORT, data);
  }

  getDailyFiles(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DAILY_FILES, data);
  }

  getHistoricFilesReport(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.FILTER_HISTORICAL_REPORT, data);
  }
  getOverviewIFAOnboarding(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_IFA_ONBOARDING_OVERVIEW, data);
  }
  updateOverviewIFAOnboarding(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_IFA_ONBOARDING_OVERVIEW, data);
  }
  getOnboardingActivity(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_IFA_ONBOARDING_ACTIVITY, data);
  }
  editActivity(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ACTIVITY, data);
  }
  activityCommentUpdate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_UPDATE_COMMENT, data);
  }
  activityAddComment(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ACTIVITY_ADD_COMMENT, data);
  }
  activityDeleteComment(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.ACTIVITY_DELETECOMMENT, data);
  }
  getIfaMatricData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_IFA_MATRIC_DATA, data);
  }
  getStageComments(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_STAGE_COMMENT, data);
  }
  deleteCommentStage(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_STAGE_COMMENT , data);
  }
  editStageComment(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_STAGE_COMMENT , data);
  }
  addStageComment(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_STAGE_COMMENT , data);
  }
  // observable data sending

  sendDataThroughObs(value) {
    this.subject.next(value)
  }

  // get Observable Data
  getDataThroughObs(): Observable<any> {
    return this.subject.asObservable();
  }

}