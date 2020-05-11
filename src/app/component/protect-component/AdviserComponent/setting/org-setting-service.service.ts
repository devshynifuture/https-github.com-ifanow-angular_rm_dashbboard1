import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OrgSettingServiceService {

  constructor(private http: HttpService) {
  }

  editPersonalProfile(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PERSONAL_PROFILE, data);
  }

  editOrgProfile(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE, data);
  }

  getPortfolio(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PORTFOLIO, data);
  }

  getPlans(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PLANS, data);
  }

  updatePortFolio(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.PROTFOLIO_UPDATE, data);
  }

  updatePlanSection(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.PLAN_SECTION_UPDATE, data);
  }

  getDomainSetting(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.DOMAIN_GET, data);
  }

  updateDomainSetting(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_DOMAIN, data);
  }

  getEmailVerification(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EMAIL_VERIFICATION, data);
  }

  getEmailTempalate(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EMAIL_TEMPLATES, data);
  }

  editPreEmailTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PREF_EMAIL_TEMPLATE, data);
  }

  addEmailVerfify(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_EMAIL_VERIFY, data);
  }

  getAssetAllocation(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ASSET_ALLOCATION, data);
  }

  updateAssetAllocation(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.UPDATE_ASSET_ALLOCATION, data);
  }

  getRetuns(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_RETURNS, data);
  }

  updateReturns(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_RETURNS_AND_INFLATIONS, data);
  }

  getKeyAndParameters(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_KEY_PARAMETERS, data);
  }

  uploadPlanPhoto(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.UPLOAD_PLAN_GALLERY, data);
  }

  updateKeyParameter(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.UPLOAD_KEY_PARAMETER, data);
  }

  addTaskTemplate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_TAK_TEMPLATE, data);
  }

  editTaskTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_TASK_TEMPLATE, data);
  }

  addSubtaskTemplate(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_SUB_TASKTEMPLATE, data);
  }

  editSubTaskTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_TASK_TEMPLATE, data);
  }

  deleteTaskTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_TASK_TEMPLATE, data);
  }

  deleteSubTaskTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_SUBTASK_TEMPLATE, data);
  }

  updateOwnerTaskTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.OWNER_TASK_UPDATE, data);
  }

  updateOwnerSubtaskTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.OWNER_SUBTASK_UPDATE, data);
  }

  getGlobalDataTask() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.TASK_GLOBAL, '');
  }

  getTaskTemplate(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_TASK_TEMPLATE, data);
  }

  deleteEmailVerify(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_EMAIL_VERIFY, data);
  }

  deletePrefEmailTemplate(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_PREF_EMAIL_TEMPLATE, data);
  }

  getTeamMember(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_TEAM_MEMBER, data);
  }

  updateAccessControl(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_ACCESS_CONTROL, data);
  }

  resetGallery(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RESET_GALLARY, data);
  }

  getAppearancePreference(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_APPEARANCE_SETTING, data);
  }

  updateAppearancePreferance(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_APPEARANCE_SETTING, data);
  }
  getUserRoles(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLES, httpParams);
  }
  getClientUserRoles(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLES, httpParams);
  }
}
