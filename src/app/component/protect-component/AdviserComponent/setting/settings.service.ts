import {Injectable} from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import {appConfig} from 'src/app/config/component-config';
import {apiConfig} from 'src/app/config/main-config';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpService, private httpClient: HttpClient) {
  }

  // user and org profile
  getProfileDetails(data) {
    const httpParams = new HttpParams().set('id', data.id);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE_DETAILS, httpParams);
  }

  uploadProfilePhoto(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPLOAD_PERSONAL_PROFILE_PHOTO, data);
  }

  getPersonalProfile(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_PERSONAL_PROFILE, data);
  }

  getOrgProfile(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ORG_PROFILE, httpParams);
  }

  editPersonalProfile(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_PERSONAL_PROFILE, data);
  }

  editOrgProfile(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE, data);
  }

  editOrgProfileLogo(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE_LOGO, data);
  }

  editOrgProfileReportLogo(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_ORG_PROFILE_REPORT_LOGO, data);
  }

  resetWebImage(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RESET_ORG_PROFILE_LOGO, data);
  }

  resetReportLogoImage(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.RESET_ORG_REPORT_LOGO, data);
  }


  // users and roles
  getUserRolesGlobalData(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLES_GLOBAL_DATA, httpParams);
  }

  getTeamMembers(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ALL_TEAM_MEMBERS, httpParams);
  }

  addTeamMember(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_TEAM_MEMBER, data);
  }

  editTeamMember(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_TEAM_MEMBER, data);
  }

  deleteTeamMember(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_TEAM_MEMBER, data);
  }

  suspendMember(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.SUSPEND_TEAM_MEMBER, data);
  }

  reactivateMember(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.REACTIVATE_TEAM_MEMBER, data);
  }

  getAllRoles(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ROLE_ROLE_LIST, httpParams);
  }

  getAdvisorRoles(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ADVISOR_ROLE_ROLE_LIST, data);
  }

  getDetailedRole(data) {
    const httpParams = new HttpParams().set('id', data.id);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_DETIALED_USER_ROLE, httpParams);
  }

  getTemplateRole(data) {
    const httpParams = new HttpParams().set('optionId', data.optionId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_TEMPLATE_ROLE, httpParams);
  }

  addRole(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_USER_ROLE, data);
  }

  cloneRole(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.CLONE_USER_ROLE, data);
  }

  deleteRole(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.DELETE_USER_ROLE, data);
  }

  editRole(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.EDIT_USER_ROLE, data);
  }

  getAccessRightsList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_USER_ACCESS_RIGHTS_LIST, httpParams);
  }

  editAccessRightOfUser(data) {
    return this.http.put(apiConfig.MAIN_URL + appConfig.UPDATE_USER_ACCESS_RIGHTS, data);
  }


  // backoffice
  getArnGlobalData() {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_GLOBAL_LIST, {});
  }

  getArnlist(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ARN_RIA_LIST, httpParams);
  }

  addArn(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.ADD_ARN_RIA, data);
  }

  editArn(data) {
    return this.httpClient.put(apiConfig.MAIN_URL + appConfig.EDIT_ARN_RIA, data);
  }

  getMFRTAList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_MF_RTA_LIST, httpParams);
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
}
