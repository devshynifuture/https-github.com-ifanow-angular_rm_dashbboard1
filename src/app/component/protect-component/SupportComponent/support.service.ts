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

  getBackofficeAdvisorSearchByName(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BACKOFFICE_ADVISOR_SEARCH_NAME, data);
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

  getFolioCountValues(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.BACKOFFICE_FOLIO_COUNTS, data);
  }

  putAumTransactionKeepOrRemove(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_PUT_AUM_TRANSACTION_KEEP_OR_REMOVE, data);
  }

  recalculateBalanceUnitData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_RM_RECALCULATE_BALANCE_UNITS, data);
  }

  putMergeSchemeCode(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.BACKOFFICE_MERGE_SCHEME_CODE, data);
  }

  postMergeSchemeCodeBulk(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.BACKOFFICE_MERGE_SCHEME_CODE_BULK, data);
  }

  getBackofficeReports(data) {
    return null;
  }
  getMappedUnmappedCount(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.RM_MAPPED_UNMAPPED_SCHEME_COUNT_NJ_PRUDENT, data);
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

  postFileOrderingData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.POST_HISTORICAL_FILE_ORDER, data);
  }

  getStageComments(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_STAGE_COMMENT, data);
  }
  deleteCommentStage(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_STAGE_COMMENT, data);
  }
  editStageComment(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_STAGE_COMMENT, data);
  }
  addStageComment(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_STAGE_COMMENT, data);
  }
  getMyIFAReconSummary(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MY_IFA_REC_SUMMARY, data);
  }

  getCommentCount(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_COMMENT_COUNT_RM_ADMIN, data);
  }
  // observable data sending

  sendDataThroughObs(value) {
    this.subject.next(value)
  }

  // get Observable Data
  getDataThroughObs(): Observable<any> {
    return this.subject.asObservable();
  }

  getBulkFilesData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BULK_FILE_ORDER_LIST, data);
  }

  getUnmappedAdvisors() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.UNMAPPED_ADVISOR_LIST, {});
  }

  mapAdvisors(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MAP_ADVISOR_TO_RM, data);
  }

  getRMList() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_RM_LIST, {});
  }

  addRm(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_RM, data);
  }
  getTickets(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_TICKET, data);
  }
  getReportFilterData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GET_REPORT_FILTER_DATA, data);
  }

  getArnRiaOfAdvisors(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_FILE_ORDER_ARN_RIA_LIST, data);
  }

  deleteSip(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SIP, data);
  }

  refreshDashboard(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.REFRESH_DASHBOARD, data);
  }

  deactivateAccount(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DEACTIVATE_ACCOUNT, data);
  }

  refreshMutualFundList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.REFRESH_MF_LIST, data);
  }

  convertToPaidDate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.CONVERT_TO_PAID_DATE, data);
  }

}