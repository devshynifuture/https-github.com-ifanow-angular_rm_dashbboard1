import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { appConfig } from 'src/app/config/component-config';
import { apiConfig } from 'src/app/config/main-config';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpService, private httpClient: HttpClient) { }

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
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE, data);
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
  getUserRolesGlobalData(data){
    let httpParams = new HttpParams().set('advisorId', data.advisorId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLES_GLOBAL_DATA, httpParams)
  }
  sendInvitationToMember(data){
    return this.http.post(apiConfig.MAIN_URL, data);
  }
  getTeamMembers(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLE_ROLE_LIST, httpParams)
  }
  
  getAllRoles(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLE_ROLE_LIST, httpParams)
  }
  getDetailedRole(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DETIALED_USER_ROLE, httpParams)
  }
  addRole(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_USER_ROLE, data);
  }
  deleteRole(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_USER_ROLE, data);
  }

  getAccessRightsList(data) {
    let httpParams = new HttpParams().set('id', data.id)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams)
  }
  editAccessRightOfUser(data) {
    return this.http.put(apiConfig.MAIN_URL, data);
  }


  // backoffice
  getArnGlobalData() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_GLOBAL_LIST, {})
  }
  getArnlist(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, httpParams)
  }
  addArn(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_ARN_RIA, data);
  }
  editArn(data) {
    return this.httpClient.put(apiConfig.MAIN_URL + appConfig.EDIT_ARN_RIA, data);
  }

  getMFRTAList(data) {
    let httpParams = new HttpParams().set('advisorId', data.advisorId)
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MF_RTA_LIST, httpParams)
  }
  addMFRTA(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_MF_RTA, data);
  }
  editMFRTA(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_MF_RTA, data);
  }
  deleteMFRTA(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_MF_RTA, data);
  }
  updateAnswer(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_MF_RTA_QUESTION, data);
  }
  deleteQuestion(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_MF_RTA_QUESTION, data);
  }
  addQuestion(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_MF_RTA_QUESTION, data);
  }
}
