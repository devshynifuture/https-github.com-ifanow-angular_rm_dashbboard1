import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse, HttpRequest} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config'
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
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.TOTAL_GET_AUM, httpParams);
  }

  getMisData(data) {
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MIS_DATA,httpParams);
  }

  getSubCatAum(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailId', data.arnRiaDetailId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_AUM, httpParams);
  }

  getTotalByAumScheme(data) {
    const httpParams = new HttpParams().set('advisorId', data);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEMENAME,httpParams);
  }

  getClientWiseTotalAum(data) {
    const httpParams = new HttpParams().set('from', data.from).set('limit', data.limit).set('teamMemberId', data.teamMemberId);

    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_WISE_TOTALAUM, httpParams);
  }

  getClientFolioWiseInCategory(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_FOLIO_WISE, data);
  }

  amcWiseGet(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AMC_WISE, httpParams);
  }
  amcWiseApplicantGet(data) {
    const httpParams = new HttpParams().set('advisorId', data).set('arnRiaDetailId', data.arnRiaDetailId).set('parentId', data.parentId).set('schemeMasterId', data.schemeMasterId).set('totalAum', data.totalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_APPLICANT_NAME, httpParams);
  }
  getSipcountGet(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_COUNT_GET, httpParams);
  }

  getAumApplicantWiseTotalaumApplicantName(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT, httpParams);
  }

  getAumApplicantCategory(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMembertId', data.familyMembertId).set('clientTotalAum', data.clientTotalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_CATEGORY, httpParams);
  }

  getAumApplicantSubCategory(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMembertId', data.familyMembertId).set('categoryId', data.categoryId).set('categoryTotalAum', data.categoryTotalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_SUB_CATEGORY, httpParams);
  }

  getAumApplicantScheme(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('familyMembertId', data.familyMembertId).set('subCategoryId', data.subCategoryId).set('subCategoryTotalAum', data.subCategoryTotalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_APPLICANT_SCHEME, httpParams);
  }

  // /Aum-clientWise
  getAumClientTotalAum(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_CLIENT_TOTALAUM, httpParams);
  }
  getAumFamilyMember(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('clientId', data.clientId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('totalAum', data.totalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_FAMILY_MEMBER, httpParams);
  }
  getAumFamilyMemberScheme(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('familyMemberId', data.familyMemberId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('totalAum', data.totalAum);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_FAMILY_SCHEME, httpParams);
  }
  getAumFamilyMemberSchemeFolio(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('familyMemberId', data.familyMemberId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId).set('totalAum', data.totalAum).set('schemeId', data.schemeId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_FAMILY_SCHEME_FOLIO, httpParams);
  }
  getAumClientScheme(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId).set('advisorId', data.advisorId).set('arnRiaDetailsId',data.arnRiaDetailsId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_AUM_CLIENT_SCHEME, httpParams);
  }

  base_64Data(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data, 10000);
  }


// ---------------------------------------- sip data call--------------------------------------

// Date - 10 dec 2019

  GET_EXPIRING(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EXPIRING, httpParams);
  }

  GET_expired(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_expired, httpParams);
  }

  GET_SIP_REJECTION(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('limit', data.limit).set('offset', data.offset).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_REJECTION, httpParams);
  }

  GET_SIP_SCHEME_SEARCH(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_SCHEME_SEARCH, data);
  }

  GET_SIP_CLIENT_SEARCH(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_client_SEARCH, data);
  }

  GET_SIP_AMC(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId).set('arnRiaDetailsId', data.arnRiaDetailsId).set('parentId', data.parentId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SIP_AMC, httpParams);
  }

  GET_SIP_AMC_SCHEME(data){
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
