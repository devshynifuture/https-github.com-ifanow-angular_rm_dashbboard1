import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse, HttpRequest} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';

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

  getFile(FileData) {

    const httpParams = new HttpParams().set('teamMemberId', FileData.teamMemberId)
      .set('fileId', FileData.fileId).set('fileType', FileData.fileType)
      .set('fileType', FileData.fileType).set('limit', FileData.limit).set('rtType', FileData.rtType);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FILE_GET, httpParams);
  }

  loginApi(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.LOGIN, data);
  }


  getClientTotalAUM(data) {
    console.log(data);
    const httpParams = new HttpParams().set('teamMemberId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.TOTAL_GET_AUM, httpParams);
  }

  getMisData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MIS_DATA + '?teamMemberId=' + data, null);
  }

  getSubCatAum(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_AUM + '?teamMemberId=' + data, null);
  }

  getSubCatScheme(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEME + '?teamMemberId=' + data, null);
  }

  getSubCatSchemeName(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEMENAME + '?teamMemberId=' + data, null);
  }

  getTotalByAumScheme(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEMENAME + '?teamMemberId=' + data, null);
  }

  getClientWiseTotalAum(data) {
    const httpParams = new HttpParams().set('from', data.from).set('limit', data.limit).set('teamMemberId', data.teamMemberId);

    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_WISE_TOTALAUM, httpParams);
  }

  getSipcountGet(data) {
    const httpParams = new HttpParams().set('teamMemberId', data);

    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_COUNT_GET, httpParams);
  }

  getAumApplicantWiseTotalaumApplicantName(data) {
    const httpParams = new HttpParams().set('teamMemberId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT, httpParams);
  }

  getAumApplicantCategory(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId).set('clientTotalAum', data.clientTotalAum)
      .set('teamMemberId', data.teamMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_CATEGORY, httpParams);
  }

  getAumApplicantSubCategory(data) {
    const httpParams = new HttpParams().set('categoryId', data.categoryId).set('categoryTotalAum', data.categoryTotalAum)
      .set('clientId', data.clientId).set('teamMemberId', data.teamMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_SUB_CATEGORY, httpParams);
  }

  getAumApplicantScheme(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId).set('subCategoryId', data.subCategoryId)
      .set('subCategoryTotalAum', data.subCategoryTotalAum).set('teamMemberId', data.teamMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_SCHEME, data);
  }

  // /Aum-clientWise
  getAumClientTotalAum(data) {
    const httpParams = new HttpParams().set('limit', data.limit).set('offset', data.offset).set('teamMemberId', data.teamMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_CLIENT_TOTALAUM, httpParams);
  }

  getAumClientScheme(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId).set('teamMemberId', data.teamMemberId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_CLIENT_SCHEME, httpParams);
  }

  base_64Data(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data, 10000);
  }


// ---------------------------------------- sip data call--------------------------------------

// Date - 10 dec 2019

  GET_EXPIRING() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EXPIRING, null);
  }

  GET_expired() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_expired, null);
  }

  GET_SIP_REJECTION() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_REJECTION, null);
  }

  GET_SIP_SCHEME_SEARCH() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_SCHEME_SEARCH, null);
  }

  GET_SIP_AMC() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_AMC, null);
  }

  GET_SIP_AMC_SCHEME() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_AMC_SCHEME, null);
  }

  GET_SIP_INVERSTORS() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_INVERSTORS, null);
  }

  Scheme_Investors_Applicants() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.Scheme_Investors_Applicants, null);
  }

  Sip_Schemewise_Get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.Sip_Schemewise_Get, null);
  }

  Scheme_Wise_Investor_Get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.Scheme_Wise_Investor_Get, null);
  }

  scheme_wise_Applicants_Get() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.scheme_wise_Applicants_Get, null);
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

  getClientFolioWise(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data, 10000);
  }


}
