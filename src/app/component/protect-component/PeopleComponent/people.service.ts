import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { HttpParams } from '@angular/common/http';

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

  getEmailList(data) {
    return this.http.get(apiConfig.MAIN_URL + appConfig.GET_EMAIL_LIST, data);
  }

  mergeClient(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.MERGE_CLIENT, data);
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
    // requestDataForOwnerList = {age: 18, greaterOrLesser: 1, clientId: 0};
    let httpParams = new HttpParams().set('clientId', data.clientId);
    if (data.age) {
      httpParams = httpParams.set('age', data.age).set('greaterOrLesser', data.greaterOrLesser);
    }
    return this.http.get(apiConfig.USER + appConfig.GET_CLIENT_FAMILY_MEMBER_LIST_ASSET, httpParams);
  }

  getClientFamilyMemberList(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_CLIENT_FAMILY_MEMBER_LIST, data, 1);
  }

  getClientSearch(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.CLIENT_SEARCH, data, 1);
  }

  editBirthDate(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.EDIT_BITHDATE, data);
  }

  deleteAddress(data) {
    return this.http.put(apiConfig.USER + appConfig.DELETE_ADDDRESS, data);
  }

  deleteBank(data) {
    return this.http.put(apiConfig.USER + appConfig.DELETE_BANK, data);
  }

  deleteDemat(data) {
    return this.http.put(apiConfig.USER + appConfig.DELETE_DEMAT, data);
  }

  getClientBasedOnMobile(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.SEARCH_CLIENT_BASED_ON_MOBILE, data, 1);
  }

  getClientBasedOnEmail(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.SEARCH_CLIENT_BASED_ON_EMAIL, data, 1);
  }

  getbankAccountTypes(data) {
    return this.http.get(apiConfig.USER + appConfig.GET_BANK_ACCOUNT_TYPE, data);
  }

  getRelationShipStatusList(data) {
    return this.http.get(apiConfig.USER + appConfig.GET_RELATIONSHIP_STATUS, data);
  }

  resetClientPassword(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.RESET_CLIENT_PASSWORD, data);
  }
}
