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

  getProfileDetails(data){
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }

  uploadProfilePhoto(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPLOAD_PERSONAL_PROFILE_PHOTO, data)
  }
}
