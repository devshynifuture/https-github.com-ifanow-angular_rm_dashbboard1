import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrgSettingServiceService {

  constructor(private http: HttpService) { }
  getPersonalProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE, data);
  }
  getOrgProfile(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ORG_PROFILE, httpParams);
  }
  editPersonalProfile(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_PERSONAL_PROFILE, data);
  }
  editOrgProfile(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE, data);
  }
  getPortfolio(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PORTFOLIO, data);
  }
  getPlans(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PLANS, data);
  }
  updatePortFolio(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.PROTFOLIO_UPDATE, data);
  }
  updatePlanSection(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.PLAN_SECTION_UPDATE, data);
  }

}
