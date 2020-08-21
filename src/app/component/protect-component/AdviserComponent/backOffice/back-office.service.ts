import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config'
import { UtilService } from "../../../../services/util.service";

class CacheItem<T> {
  url: string;
  timestampCached: number;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BackOfficeService {
  constructor(public http: HttpService, private https: HttpClient, public snackBar: MatSnackBar) {
  }

  cache: CacheItem<any>[] = [];
  MAX_CACHE_AGE = 200000;


  /// -------------------------------------//------------------------------------------------------
  URL = 'https://api.punkapi.com/v2/beers';

  public responseCache = new Map();

  getFile(data) {
    //
    // const httpParams = new HttpParams().set('teamMemberId', FileData.teamMemberId)
    //   .set('fileId', FileData.fileId).set('fileType', FileData.fileType)
    //   .set('fileType', FileData.fileType).set('limit', FileData.limit).set('rtType', FileData.rtType);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FILE_GET, UtilService.getHttpParam(data));
  }

  loginApi(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.RM_LOGIN, data);
  }

  getClientTotalAUM(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.TOTAL_GET_AUM, UtilService.getHttpParam(data));
  }

  addCeasedDate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_CEASED_DATE, data);
  }

  getMisData(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MIS_DATA, UtilService.getHttpParam(data));
  }

  getSubCatAum(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailId', data.arnRiaDetailId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_AUM, UtilService.getHttpParam(data));
  }

  getTotalByAumScheme(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEMENAME, UtilService.getHttpParam(data));
  }

  //
  // getClientFolioWiseInCategory(data) {
  //   return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_FOLIO_WISE, UtilService.getHttpParam(data));
  // }

  amcWiseGet(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AMC_WISE, UtilService.getHttpParam(data));
  }

  amcWiseApplicantGet(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('schemeMasterId', data.schemeMasterId).set('totalAum', data.totalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_APPLICANT_NAME, UtilService.getHttpParam(data));
  }

  getSipcountGet(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_COUNT_GET, UtilService.getHttpParam(data));
  }

  getAumApplicantWiseTotalaumApplicantName(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT, UtilService.getHttpParam(data));
  }

  getAumApplicantCategory(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMembertId', data.familyMembertId).set('clientTotalAum', data.clientTotalAum).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_CATEGORY, UtilService.getHttpParam(data));
  }

  getAumApplicantSubCategory(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMembertId', data.familyMembertId).set('categoryId', data.categoryId).set('categoryTotalAum', data.categoryTotalAum).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_SUB_CATEGORY, UtilService.getHttpParam(data));
  }

  getAumApplicantScheme(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMembertId', data.familyMembertId).set('subCategoryId', data.subCategoryId).set('subCategoryTotalAum', data.subCategoryTotalAum).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_SCHEME, UtilService.getHttpParam(data));
  }

  // /Aum-clientWise
  getAumClientTotalAum(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_CLIENT_TOTALAUM, UtilService.getHttpParam(data));
  }

  getAumFamilyMember(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('totalAum', data.totalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_FAMILY_MEMBER, UtilService.getHttpParam(data));
  }

  getAumFamilyMemberScheme(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('familyMemberId', data.familyMemberId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('totalAum', data.totalAum).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_FAMILY_SCHEME, UtilService.getHttpParam(data));
  }

  getAumFamilyMemberSchemeFolio(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('familyMemberId', data.familyMemberId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('totalAum', data.totalAum).set('schemeId', data.schemeId).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_FAMILY_SCHEME_FOLIO, UtilService.getHttpParam(data));
  }

  getAumClientScheme(data) {
    // const httpParams = new HttpParams().set('clientId', data.clientId).set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_CLIENT_SCHEME, UtilService.getHttpParam(data));
  }

  base_64Data(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data, 10000);
  }


  // ---------------------------------------- sip data call--------------------------------------

  // Date - 10 dec 2019

  GET_EXPIRING(data) {
    // const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EXPIRING, UtilService.getHttpParam(data));
  }

  GET_expired(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_expired, httpParams);
  }

  GET_SIP_REJECTION(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_REJECTION, httpParams);
  }

  //
  // GET_SIP_SCHEME_SEARCH(data) {
  //   return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_SCHEME_SEARCH, data);
  // }
  //
  // GET_SIP_CLIENT_SEARCH(data) {
  //   return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_client_SEARCH, data);
  // }

  GET_SIP_AMC(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_AMC, httpParams);
  }

  GET_SIP_AMC_SCHEME(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('amcId', data.amcId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('sipAmount', data.sipAmount);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_AMC_SCHEME, httpParams);
  }

  allSipGet(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.ALL_SIP_GET, httpParams);
  }

  GET_SIP_INVERSTORS(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('schemeId', data.schemeId).set('sipAmount', data.sipAmount);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_INVERSTORS, httpParams);
  }

  Sip_Schemewise_Get(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.Sip_Schemewise_Get, httpParams);
  }

  Sip_Investors_Applicant_Get(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('clientId', data.clientId).set('parentId', data.parentId).set('schemeId', data.schemeId).set('sipAmount', data.sipAmount);
    return this.http.get(apiConfig.MAIN_URL + appConfig.Scheme_Investors_Applicants, httpParams);
  }

  sipClientWiseApplicant(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('clientId', data.clientId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.CLIENT_WISE_APPLICANT_GET, httpParams);
  }

  sipClientWiseClientName(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.CLIENT_WISE_CLIENTNAME_GET, httpParams);
  }

  Scheme_Wise_Investor_Get(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('schemeId', data.schemeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.Scheme_Wise_Investor_Get, httpParams);
  }

  scheme_wise_Applicants_Get(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('clientId', data.clientId).set('parentId', data.parentId).set('schemeId', data.schemeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.scheme_wise_Applicants_Get, httpParams);
  }

  sipSchemePanCount(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.SIP_PAN_COUNT, httpParams);
  }

  Wbr9anCount(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.WBR_FOLIO_PAN_COUNT, httpParams);
  }

  sipApplicantList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.SIP_APPLICANT_LIST, httpParams);
  }

  sipApplicantFolioList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMemberId', data.familyMemberId).set('totalAum', data.totalAum).set('clientId', data.clientId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.SIP_FOLIO_LIST, httpParams);
  }

  folioSearchByGroupHead(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('clientName', data.clientName);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_GROUP_HEAD_SEARCH, httpParams);
  }

  folioSearchByInvestor(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMemberName', data.familyMemberName);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_INVESTOR_SEARCH, httpParams);
  }

  folioSearchByPan(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('pan', data.pan);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_PAN_SEARCH, httpParams);
  }

  folioSearchByfolio(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('folioNumber', data.folioNumber);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_FOLIO_NO__SEARCH, httpParams);
  }

  folioGroupHeadList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailId', data.arnRiaDetailId).set('parentId', data.parentId).set('clientName', data.clientName);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_GROUP_HEAD_LIST, httpParams);
  }

  folioApplicantList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailId', data.arnRiaDetailId).set('parentId', data.parentId).set('familyMemberName', data.familyMemberName);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FOLIO_APPLICANT_NAME_LIST, httpParams);
  }

  newSipGet(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NEW_SIP, httpParams);
  }

  getclientWithoutMf(data) {
    const httpParams = new HttpParams().set('advisorIds', data.advisorIds).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.CLIENT_WITHOUT_MF, httpParams);
  }

  ceaseSipGet(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CEASE_SIP, httpParams);
  }

  aumGraphGet(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.AUM_GRAPH_GET, httpParams);
  }

  getArnRiaList(data) {
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.ARN_RIA_LIST, httpParams);
  }

  // ---------------------------------------- sip data call--------------------------------------


  // ------------------------------------back office api call ------------------------------------
  AllClient_get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.AllClient_get, null);
  }

  AllClient_ByName_get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.AllClient_ByName_get, null);
  }

  AllClient_ByTags_get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.AllClient_ByTags_get, null);
  }

  Update_expiryDate() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.Update_expiryDate, null);
  }

  Update_Password() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.Update_Password, null);
  }

  Fileorder_Status_Report_Get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.Fileorder_Status_Report_Get, null);
  }

  public getBeerList(): Observable<any> {
    const beersFromCache = this.responseCache.get(this.URL);
    if (beersFromCache) {
      return of(beersFromCache);
    }
    const response = this.https.get<any>(this.URL);
    response.subscribe(beers => this.responseCache.set(this.URL, beers));
    return response;
  }

  //bulk email
  getDetailsClientAdvisor(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_ADVISOR_DEATILS, data);
  }
  clientCount(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_COUNT, data);
  }
  rederToHtmlToPdf(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.HTML_TO_PDF, data);
  }

  getClientFolioWise(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data, 10000);
  }

  getClientIdByLoop(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GET_CLIENT_IN_LOOP, data);
  }

  getOrderList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ORDER_LIST, data);
  }
  refreshCount(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.REFRESH_COUNT, data);
  }
  getMutualFundClientList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MF_CLIENTS, data);
  }

  saveSetting(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.SAVE_SETTING, data);
  }

  getSipCleanUpListData(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MUTUAL_FUND_SIP_CLEANUP_LIST, data);
  }

  putSipCleanUpUpdateStatus(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.PUT_MUTUAL_FUND_SIP_CLEANUP_REMOVE_STATUS_UPDATE, data)
  }
}
