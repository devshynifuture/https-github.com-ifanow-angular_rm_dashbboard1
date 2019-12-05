import { BehaviorSubject } from 'rxjs';
import { apiConfig } from './../../../../config/main-config';
import { appConfig } from './../../../../config/component-config';
import { HttpService } from './../../../../http-service/http-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private dataSourceOneMailView = new BehaviorSubject<Object>('');
  data = this.dataSourceOneMailView.asObservable();


  constructor(public https: HttpClient, public http: HttpService) { }

  getEmailList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailDraftList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailTrashList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailSentList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailArchiveList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  // getLabelList(){
  //   return this.http.get(apiConfig.MAIN_URL + appConfig);
  // }

  // getUserList(){
  //   return this.http.get(apiConfig.MAIN_URL + appConfig);
  // }

  // saveUser(data){
  //   return this.http.post(apiConfig.MAIN_URL + appConfig, data);
  // }

  sendNextData(data: Object) {
    this.dataSourceOneMailView.next(data);
  }
}
