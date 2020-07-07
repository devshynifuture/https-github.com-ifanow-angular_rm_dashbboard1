import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class calendarService {
dayArrey:any;
  constructor(public https: HttpClient, public http: HttpService) { }

  getEvent(data) {
    const httpParams = new HttpParams().set('calendarId', data.calendarId).set('userId', data.userId);
    return this.http.get(apiConfig.GMAIL_URL + appConfig.GET_EVENT, httpParams);
  }

  getAttendyList(data) {
    // const httpParams = new HttpParams().set('userId', data.userId);
    return this.http.get(apiConfig.USER + appConfig.GET_ATTENDY, data);
  }

  addToAttendyList(data) {
    // const httpParams = new HttpParams().set('userId', data.userId);
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_ATTENDY, data);
  }
  updateEvent(data) {
    // const httpParams = new HttpParams().set('calendarId', setData.calendarId).set('userId', setData.userId).set('eventId', setData.eventId);
    return this.http.put(apiConfig.GMAIL_URL + appConfig.GET_UPDATE, data);
  }

  addEvent(data) {
    let calData= {
      "userId":2727,
      "calendarId":"gaurav@futurewise.co.in",
      "summary": "test ani",
      "location": "800 Howard St., San Francisco, CA 94103",
      "description": "uniiiii",
      "start": {
      "dateTime": "2020-01-21T05:00:00-07:00",
      "timeZone": "America/Los_Angeles"
      },
      "end": {
      "dateTime": "2020-01-21T07:00:00-07:00",
      "timeZone": "America/Los_Angeles"
      },
      "recurrence": [
      "RRULE:FREQ=DAILY;COUNT=2"
      ],
      "attendees":[
      {
      "email":"chetan@futurewise.co.in"
      },
      {
      "email":"ajay@futurewise.co.in"
      }
      ]
      }
    // const httpParams = new HttpParams().set('calendarId', setData.calendarId).set('userId', setData.userId).set('eventId', setData.eventId);
    return this.http.post(apiConfig.GMAIL_URL + appConfig.GET_ADD, data);
  }

  deleteEvent(data) {
    const httpParams = new HttpParams().set('calendarId', data.calendarId).set('userId', data.userId).set('eventId', data.eventId);
    return this.http.delete(apiConfig.GMAIL_URL + appConfig.GET_DELETE, data, httpParams);
  }



  // =======================
  updateData = new Subject();

  updateDayArr(){
    return this.updateData.asObservable();
  }

  getDayArr(calData){
    this.dayArrey = calData
    this.updateData.next([...this.dayArrey]);
  }
}
