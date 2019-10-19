import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';
// import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';

class CacheItem<T> {
  url: string;
  // timestampCached: number;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(public https: HttpClient, public http: HttpService) {
  }

  cache: CacheItem<any>[] = [];
  MAX_CACHE_AGE = 200000;

  getInvoiceData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_INVOICE, httpParams);
  }

  // getSingleInvoiceData(data) {
  //   let httpParams = new HttpParams().set('invoiceId', data)
  //   return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SINGLE_INVOICE, httpParams);
  // }
  getPreferenceBillerProfile(data) {
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PREFERENCE_BILLER_PROFILE, httpParams);
  }

  getPreferenceInvoiceQuotations(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('type', data.type);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION, httpParams);
  }

  updatePreferenceInvoiceQuotationsSubscription(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION, data);
  }

  savePreferenceInvoiceQuotationsSubscription(data) {
    // TODO hardcoded right now for compilation.
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('id', data.id).set('nextNumber', data.nextNumber)
      .set('prefix', data.prefix).set('type', data.type);
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_PREFERENCE_INVOICE_QUOTATIONS_SUBSCRIPTION, {});

  }

  getSubscriptionCompleteStages(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('type', data.type);
    return this.http.post(apiConfig.MAIN_URL + appConfig.DASHBOARD_LETS_BEGIN_SUBSCRIPTION, data);
  }

  getDashboardSubscriptionResponse(data) {
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.DASHBOARD_SUBSCRIPTION_LETS_BEGIN, httpParams);
  }

  getSubscriptionClientsList(data) {
    const httpParams = new HttpParams().set('id', data.id);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_SUBSCRIPTION_LIST, httpParams);
  }

  getSubscriptionClientsQuotations(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_SUBSCRIPTION_QUOTATIONS_LIST, httpParams);
  }

  getSubscriptionClientsInvoices(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_SUBSCRIPTION_INVOICES_LIST, httpParams);
  }

  getSubscriptionClientsSettingProfile(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_SUBSCRIPTION_SETTING_PROFILE, httpParams);
  }

  getSubscriptionQuotationData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_QUOTATIONS, httpParams);
  }

  getSubscriptionSubscriptionData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('dateType', data.dateType).set('order', data.order);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_SUBSCRIPTION, httpParams);
  }

  getSettingPlanServiceData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('planId', data.planId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_PLAN_SERVICE, httpParams);
  }

  addSettingPlanOverviewData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SETTING_PLAN_OVERVIEW, data);
  }

  mapServiceToPlanData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MAP_SERVICE_TO_PLAN, data);
  }

  mapDocumentsToPlanData(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MAP_DOCUMENTS_TO_PLAN, data);
  }

  getPlanDocumentsData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('planId', data.planId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PLAN_DOCUMENTS_DATA, httpParams);
  }

  cancelSubscriptionData(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.CANCEL_SUBSCRIPTION, data);
  }

  deleteSubscriptionData(data) {
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SUBSCRIPTION, httpParams);
  }

  saveBillerProfileSettings(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.SAVE_BILLER_PROFILE_SETTING, data);
  }

  updateBillerProfileSettings(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_BILLER_PROFILE_SETTING, data);
  }

  getSubscriptionPlanSettingsData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_PLAN_SETTING, httpParams);
  }

  getSubscriptionServiceSettingsData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_SERVICE_SETTING, httpParams);
  }

  createSettingService(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.CREATE_SERVICE_SETTING, data);
  }

  docSentSignedCount(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DOCUMENT_COUNT_SIGNED, httpParams);
  }

  clientWithSubcribe(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_WITH_SCRIPTION, httpParams);
  }

  invoiceReviewed(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('limit', data.limit).set('offset', data.offset);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_INVOICE_TO_BE_REVIEWED, httpParams);
  }

  deleteSubscriptionPlan(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SUBSCRIPTION_PLAN, data);
  }

  getPlansMappedToAdvisor(data) {
    const httpParams = new HttpParams().set('advisorid', data.advisorid).set('serviceId', data.serviceId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PLAN_MAPPED_TO_ADVISOR, httpParams);
  }

  getSubscriptionDocumentSetting(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_DOCUMENTS_SETTING, httpParams);
  }

  getMapDocumentToService(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('serviceId', data.serviceId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MAP_DOCUMENT_To_SERVICE, httpParams);
  }

  addClientBillerProfile(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CLIENT_BILLER_PROFILE, data);
  }

  addSettingDocument(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SETTING_DOCUMENT, data);
  }

  getPlanOfAdvisorClients(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PLAN_OF_ADVISOR_CLIENT, httpParams);
  }

  createSubscription(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.CREATE_SUBSCRIPTION, data);
  }

  editPayeeSettings(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PAYEE_SETTINGS, data);
  }

  mapPlanToServiceSettings(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MAP_PLAN_TO_SERVICE_SETTING, data);
  }

  changePayeeSetting(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.CHANGE_PAYEE_SETTING, data);
  }

  changeBillerSetting(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.CHANGE_BILLER_SETTING, data);
  }

  getSubSummary(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('order', data.order).set('flag', data.flag).set('dateType', data.dateType).set('clientId', data.clientId).set('limit', data.limit).set('offset', data.offset);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUB_SUMMARY, httpParams);
  }

  getInvoices(data) {
    const httpParams = new HttpParams().set('id', data.id).set('module', data.module);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PLAN_INVOICE, httpParams);
  }
  editPlanSettings(data)
  {
    return this.http.put(apiConfig.MAIN_URL+appConfig.EDIT_PLAN_SETTING,data)
  }
  getModuleServiceData(data)
  {
    const httpParams=new HttpParams().set('serviceId',data.serviceId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SERVICE_MODULE,httpParams)
  }
  mapModuleToplanData(data)
  {
    return this.http.put(apiConfig.MAIN_URL + appConfig.MAP_MODULE_TO_PLANS,data)
  }
  getBillerProfile(data){
    const httpParams=new HttpParams().set('advisorId',data.advisorId).set('subId', data.subId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_BILLER_PROFILE,httpParams)
  }
  getPayeerProfile(data){
    const httpParams=new HttpParams().set('clientId', data.clientId).set('subId', data.subId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PAYEE_PROFILE,httpParams)
  }
  mapDocumentToService(data)
  {
    return this.http.post(apiConfig.MAIN_URL + appConfig.MAP_DOCUMENTS_TO_SERVICE,data)
  }
  getDataForCreateService(data)
  {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DATA_FOR_CREATE_SERVICE,data);
  }
  editModifyFeeStructure(data)
  {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_FEE_MODIFY_STRUCTURE,data)
  }
  getSubscriptionStartData(data)
  {
    let httpParams=new HttpParams().set('advisorId',data.advisorId).set('clientId',data.clientId).set('subId',data.subId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_START_DATA,httpParams)
  }
  base_64Data(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data, 10000);
  }
}
