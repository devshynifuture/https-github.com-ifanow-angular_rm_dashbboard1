import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
class CacheItem<T> {
  url: string;
  timestampCached: number;
  data: T;
}
@Injectable({
  providedIn: 'root'
})
export class BackOfficeService {
  constructor(public http: HttpService, private https: HttpClient, public snackBar: MatSnackBar) { }
  cache: CacheItem<any>[] = [];
  MAX_CACHE_AGE = 200000;
  getFile(FileData) {

    let httpParams = new HttpParams().set('teamMemberId', FileData.teamMemberId).set('fileId', FileData.fileId).set('fileType', FileData.fileType).set('fileType', FileData.fileType).set('limit', FileData.limit).set('rtType', FileData.rtType);
    return this.http.get(apiConfig.MAIN_URL + appConfig.FILE_GET, httpParams);
  }

  getClientTotalAUM(data) {
    console.log(data)
    let httpParams = new HttpParams().set('teamMemberId', data)
    return this.http.get(apiConfig.MAIN_URL + appConfig.TOTAL_GET_AUM, httpParams)
  }
  getMisData(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MIS_DATA + '?teamMemberId=' + data, null)
  }
  getSubCatAum(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_AUM + '?teamMemberId=' + data, null)
  }
  getSubCatScheme(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEME + '?teamMemberId=' + data, null)
  }
  getSubCatSchemeName(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEMENAME + '?teamMemberId=' + data, null)
  }
  getTotalByAumScheme(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBCAT_SCHEMENAME + '?teamMemberId=' + data, null)
  }
  getClientWiseTotalAum(data) {
    let httpParams = new HttpParams().set('from', data.from).set('limit', data.limit).set('teamMemberId', data.teamMemberId);

    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_CLIENT_WISE_TOTALAUM, httpParams)
  }
  base_64Data(data) {
    return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data,10000)
  }
  normalApi(data)
  {
     data ={
       name:'gayatri',
       email:'gayatri@gmail.com'
     }
    return this.http.get("http://dummy.restapiexample.com/api/v1/employees",data);
  }



  

  ///-------------------------------------//------------------------------------------------------
  URL = 'https://api.punkapi.com/v2/beers';

  public responseCache = new Map();

  public getBeerList(): Observable<any> {
    const beersFromCache = this.responseCache.get(this.URL);
    if (beersFromCache) {
      return of(beersFromCache);
    }


    const response = this.https.get<any>(this.URL);
    response.subscribe(beers => this.responseCache.set(this.URL, beers));
    return response;
  }

  getClientFolioWise(data){
return this.http.getEncoded(apiConfig.MAIN_URL + appConfig.GET_BASE_64, data,10000)
  }


}