import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class calendarService {

  constructor(public https: HttpClient, public http: HttpService) { }

  getInvoiceData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_SUBSCRIPTION_INVOICE, httpParams);
  }
}
