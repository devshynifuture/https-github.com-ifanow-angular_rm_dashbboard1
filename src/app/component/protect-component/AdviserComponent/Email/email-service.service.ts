import { appConfig } from 'src/app/config/component-config';
import { AuthService } from './../../../../auth-service/authService';
import { BehaviorSubject, throwError } from 'rxjs';
import { apiConfig } from './../../../../config/main-config';
import { HttpService } from './../../../../http-service/http-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private dataSourceOneMailView = new BehaviorSubject<Object>('');
  data = this.dataSourceOneMailView.asObservable();
  paginatorLength;
  constructor(public https: HttpClient, public http: HttpService, private authService: AuthService) { }

  getPaginatorLength() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_PROFILE, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  getRightSideNavList() {
    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_RIGHT_SIDE_NAV, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
  }

  refreshList(data) {
    switch (data) {
      case 'archive': this.getEmailArchiveList(data);
        break;
      case 'draft': this.getEmailDraftList();
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



  getEmailList(data) {

    alert('refreshed ' + data);
    // const httpParams = new HttpParams().set('advisorId', data.advisorId);
    // return this.http.get(apiConfig.MAIN_URL + appConfig, httpParams);
  }

  getEmailDraftList() {

    const userInfo = AuthService.getUserInfo();
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_DRAFT_LIST, {
      email: userInfo.emailId,
      userId: userInfo.advisorId
    });
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
