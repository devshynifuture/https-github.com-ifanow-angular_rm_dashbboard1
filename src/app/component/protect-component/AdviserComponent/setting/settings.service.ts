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

  // user and org profile
  getProfileDetails(data){
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }

  uploadProfilePhoto(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPLOAD_PERSONAL_PROFILE_PHOTO, data)
  }
  getPersonalProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE, data);
  }
  getOrgProfile(data){
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ORG_PROFILE, httpParams);
  }
  editPersonalProfile(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_PERSONAL_PROFILE, data);
  }
  editOrgProfile(data){
    return this.http.post(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE, data);
  }
  editOrgProfileLogo(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE_LOGO, data)
  }
  editOrgProfileReportLogo(data){
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE_REPORT_LOGO, data)
  }


  // users and roles
  sendInvitationToMember(data){
    return this.http.post(apiConfig.MAIN_URL, data);
  }
  getTeamMembers(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }
  getRoles(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }
  addRole(data) {
    return this.http.post(apiConfig.MAIN_URL, data);
  }
  deleteRole(data) {
    return this.http.put(apiConfig.MAIN_URL, data);
  }
  getDetailedRole(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }
  getAccessRightsList(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }
  editAccessRightOfUser(data) {
    return this.http.put(apiConfig.MAIN_URL, data);
  }


  // backoffice
  getArnGlobalData(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_GLOBAL_LIST, httpParams)
  }
  getArnlist(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, httpParams)
  }
  addArn(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, data);
  }
  editArn(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, data);
  }

  getMFRTAList(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }
  addMFRTA(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, data);
  }
  editMFRTA(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, data);
  }
  deleteMFRTA(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, data);
  }
}
