import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpService) { }

  addNotes(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_NOTES, data);
  }

  updateNotes(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_NOTES, data);
  }

  deleteNotes(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_NOTES, data);
  }

  getNotes(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_NOTES, httpParams);
  }

  getBirthdayOrAnniversary(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId).set('fromDate', data.fromDate).set('toDate', data.toDate);
    return this.http.get(apiConfig.USER + appConfig.GET_BIRTHDAY_OR_ANNIVERSARY, httpParams);
  }

}
