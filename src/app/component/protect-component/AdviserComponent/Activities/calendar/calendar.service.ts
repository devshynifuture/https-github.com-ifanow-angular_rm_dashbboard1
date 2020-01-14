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

  getEvent(data) {
    const httpParams = new HttpParams().set('calendarId', data.calendarId).set('userId', data.userId);
    return this.http.get(apiConfig.CALENDAR_URL + appConfig.GET_EVENT, httpParams);
  }
}
