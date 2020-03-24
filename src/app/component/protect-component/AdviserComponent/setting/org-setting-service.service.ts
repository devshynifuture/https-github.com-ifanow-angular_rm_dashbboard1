import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class OrgSettingServiceService {

  constructor(private http: HttpService) { }
  getPersonalProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE, data);
  }
  getOrgProfile(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.GET_ORG_PROFILE, data);
  }
  editPersonalProfile(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_PERSONAL_PROFILE, data);
  }
  editOrgProfile(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE, data);
  }

}
