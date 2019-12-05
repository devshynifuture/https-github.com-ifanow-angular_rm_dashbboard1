import { BehaviorSubject, throwError } from 'rxjs';
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

  refreshList(data) {
    switch (data) {
      case 'archive': this.getEmailArchiveList(data);
        break;
      case 'draft': this.getEmailDraftList(data);
        break;
      case 'inbox': this.getEmailList(data);
        break;
      case 'trash': this.getEmailTrashList(data);
        break;
      case 'sent': this.getEmailSentList(data);
        break;

      default: throwError('Cannot Refresh');
    }
  }

  constructor(public https: HttpClient, public http: HttpService) { }

  getEmailList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailDraftList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailTrashList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailSentList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailArchiveList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
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
