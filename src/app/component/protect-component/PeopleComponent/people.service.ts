import {Injectable} from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpService) {
  }


  // commmented code which are giving error =>>>>>>>>>>>


  getClientList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_PEOPLE_CLIENT_LIST, data, 1);
  }

  addClient(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_CLIENT, data);
  }

  editClient(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.EDIT_CLIENT, data);
  }

  addEditClientAddress(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.ADD_EDIT_CLIENT_ADDRESS, data);
  }

  addEditClientBankDetails(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.ADD_EDIT_CLIENT_BANK, data);
  }

  addEditClientDemat(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.ADD_EDIT_CLIENT_DEMAT, data);
  }

  addFamilyMember(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_FAMILY_MEMBER, data);
  }

  addMultipleFamilyMembers(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.ADD_MULTIPLE_FAMILY_MEMBERS, data);
  }

  getCompanyPersonDetail(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_COMPANY_PERSON_DETAILS, data, 1);
  }

  saveCompanyPersonDetail(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.SAVE_COMPANY_PERSON_DEATILS, data);
  }

  updateCompanyPersonDetail(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.UPDATE_COMPANY_PERSON_DETAILS, data);

  }

  editFamilyMemberDetails(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.EDIT_FAMILY_MEMBER_BASIC_DETAILS_MORE_INFO, data);
  }

  getTeamMemberWiseCount(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.TEAM_MEMBER_WISE_CLIENT_COUNT, data, 1);
  }

  getTeamMemberList(data) {
    const httpParams = new HttpParams().set('advisorId', data.advisorId);
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_ALL_TEAM_MEMBERS, httpParams);
  }

  deleteClient(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.DELETE_CLIENT, data);
  }

  getClientOrLeadData(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_CLIENT_OR_lEAD_DATA, data, 1);
  }

  loginWithPassword(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.LOGIN_WITH_PASSWORD, data);
  }

  getAllClients(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_ALL_CLIENTS, data, 1);
  }

  updateClientStatus(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.UPDATE_CLIENT_STATUS, data);
  }

  getAdvisorFromEmailAndMobileData(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_ADVISOR_FROM_EMAIL_MOBILE, data, 1);
  }

  getIsdCode(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_ISD_CODES, data, 1);
  }

  getClientFamilyMembers(data) {
    const httpParams = new HttpParams().set('userId', data.userId).set('userType', data.userType);
    return this.http.get(apiConfig.USER + appConfig.GET_CLIENT_FAMILY_MEMBERS, httpParams);
  }

  getClientFamilyMemberListAsset(data) {
    const httpParams = new HttpParams().set('clientId', data.clientId);
    return this.http.get(apiConfig.USER + appConfig.GET_CLIENT_FAMILY_MEMBER_LIST_ASSET, httpParams);
  }

  getClientFamilyMemberList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_CLIENT_FAMILY_MEMBER_LIST, data, 1);
  }
}
