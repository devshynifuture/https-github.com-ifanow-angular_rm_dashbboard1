import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';
import { UpperTableBox, Group } from '../../customers/component/customer/plan/cashflows-plan/cashflow.interface';


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
  getKeyAndParameters(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_KEY_PARAMETERS, data);
  }
  uploadPlanPhoto(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.UPLOAD_PLAN_GALLERY, data);
  }
  updateKeyParameter(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.UPDATE_DOMAIN, data);
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
  getTeamMemberList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_TEAM_MEMBER_LIST, data, 1);
  }
  alterTable(table: (UpperTableBox | Group)[], field: string, value: string, index: number): (UpperTableBox | Group)[] {
    table[index][field]['value'] = value;

    console.log('value field index', value, field, index);
    console.log('table :', table);
    console.log('table index: ', table[index]);
    console.log('table index field', table[index][field])
    console.log('table index field value', table[index][field]['value']);

    table[index][field]['isAdHocChangesDone'] = true;
    this.updateTotal(table[index]);
    return table;
  }

  updateTotal(object: UpperTableBox | Group) {
    // let sum = 0;
    // for (let i = 1; i <= 12; i++) {
    //     if (object[`month${i}`].value !== '') {
    //         sum = sum + parseInt(object[`month${i}`].value);
    //     }
    // }
    // object['total'] = String(sum);
  }
}
