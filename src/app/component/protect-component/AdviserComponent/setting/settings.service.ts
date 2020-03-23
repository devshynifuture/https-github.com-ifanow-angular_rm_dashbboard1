import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpService) { }

  getProfilePhoto(data){
    return this.http.get(apiConfig.MAIN_URL + appConfig.ADD_HOUSE_GOAL, data)
  }

  uploadProfilePhoto(data){
    // let httpParams = new HttpParams().set('advisorId', data.advisorId)
    return this.http.put(apiConfig.MAIN_URL + appConfig.ADD_HOUSE_GOAL, data)
  }
}
