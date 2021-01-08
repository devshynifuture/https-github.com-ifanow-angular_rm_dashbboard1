import { Injectable } from '@angular/core';
// import {Router} from '@angular/router';
import { Router } from '@angular/router';
import { DashboardService } from '../component/protect-component/AdviserComponent/dashboard/dashboard.service';

@Injectable()
export class AuthService {
  familyMemberId: any;

  constructor(
    private router: Router
  ) {
  }

  static getAdminStatus() {
    if (this.getUserInfo().hasOwnProperty('isAdmin')) {
      return this.getUserInfo().isAdmin;
    } else {
      return false;
    }
  }

  static getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  static getAdvisorId() {
    return this.getUserInfo().advisorId;
  }

  static getAdminAdvisorId() {
    let adminid = this.getUserInfo().adminAdvisorId;
    if (adminid > 0) {
      return adminid;
    } else {
      return this.getUserInfo().advisorId;
    }
  }

  static getParentId() {
    return this.getUserInfo().parentId;
  }

  static getAdminId() {
    let adminAdvisorId = this.getUserInfo().adminAdvisorId;
    if (!adminAdvisorId || adminAdvisorId == 0) {
      adminAdvisorId = this.getAdvisorId();
    }
    return adminAdvisorId;
  }

  static getRmId() {
    if (this.getUserInfo().hasOwnProperty('rmId')) {
      return this.getUserInfo().rmId;
    } else {
      return null;
    }
  }

  static setClientList(data) {
    sessionStorage.setItem('clientList', JSON.stringify(data));
  }

  static setInvalidCredsTimeZone(data) {
    sessionStorage.setItem('invalidPopup', JSON.stringify(data));
  }

  static setToDoList(data) {
    sessionStorage.setItem('ToDo', JSON.stringify(data));
  }

  static setClientRolesSettings(data) {
    sessionStorage.setItem('clientRoles', JSON.stringify(data));
  }

  static setAdvisorRolesSettings(data) {
    localStorage.setItem('advisorRoles', JSON.stringify(data));
  }

  static setTeamMemberRolesSettings(data) {
    localStorage.setItem('teamMemberRoles', JSON.stringify(data));
  }

  static setUserRoleType(roleObj) {
    localStorage.setItem('roleObj', JSON.stringify(roleObj));
  }

  static getClientList() {
    return JSON.parse(sessionStorage.getItem('clientList'));
  }

  static getInvalidCredsTimeZone() {
    return JSON.parse(sessionStorage.getItem('invalidPopup'));
  }

  static getToDo() {
    return JSON.parse(sessionStorage.getItem('ToDo'));
  }

  static getUserRoleType() {
    const roleObj = localStorage.getItem('roleObj');
    return roleObj ? JSON.parse(roleObj) : {};
  }

  static getUserId() {
    return this.getUserInfo().userId;
  }

  static getClientData() {
    let clientDataString = localStorage.getItem('clientData');
    return clientDataString ? JSON.parse(clientDataString) : undefined;
  }

  static getProfileDetails() {
    let clientDataString = localStorage.getItem('profileData');
    return clientDataString ? JSON.parse(clientDataString) : undefined;
  }

  static getOrgDetails() {
    let orgData = localStorage.getItem('orgData');
    return orgData ? JSON.parse(orgData) : undefined;
  }


  static getClientId() {
    const clientData = this.getClientData();
    return clientData ? clientData.clientId ? clientData.clientId : clientData.id : undefined;
  }

  static setProfilePic(pic) {
    localStorage.setItem('profilePic', pic);
  }

  static setClientProfilePic(pic) {
    sessionStorage.setItem('clientProfilePic', pic);
  }

  static setOrgDetails(data) {
    localStorage.setItem('orgData', JSON.stringify(data));
  }

  static setAdvisorDetails(data) {
    localStorage.setItem('advisorDetail', JSON.stringify(data));
  }

  static setDomainDetails(data) {
    localStorage.setItem('domainDetails', JSON.stringify(data));
  }

  static getAdvisorDetails() {
    const advisorDetail = localStorage.getItem('advisorDetail');
    return advisorDetail ? JSON.parse(advisorDetail) : '';
  }

  get orgData() {
    return JSON.parse(localStorage.getItem('orgData')) || {};
  }

  get profilePic() {
    return localStorage.getItem('profilePic');
  }

  get clientProfilePic() {
    return sessionStorage.getItem('clientProfilePic');
  }

  get appPic() {
    const orgData = JSON.parse(localStorage.getItem('orgData'));
    return orgData ? orgData.logoUrl : '';
  }

  static getClientRoles(data) {
    return sessionStorage.getItem('clientRoles');
  }

  static getAdvisorRoles() {
    const clientDataString = localStorage.getItem('advisorRoles');
    return clientDataString ? JSON.parse(clientDataString) : undefined;
  }

  static getTeamMemberRoles(data) {
    return localStorage.getItem('teamMemberRoles');

  }

  static getDomainDetails() {
    return JSON.parse(localStorage.getItem('domainDetails'));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  isAdvisor() {
    if (AuthService.getUserInfo()) {
      return AuthService.getUserInfo().userType ? AuthService.getUserInfo().userType === 1 || AuthService.getUserInfo().userType === 8 : false;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('clientData');
    sessionStorage.removeItem('clientData');
    localStorage.removeItem('profilePic');
    localStorage.removeItem('orgData');
    localStorage.removeItem('advisorDetail');
    localStorage.removeItem('roleObj');
    localStorage.removeItem('successStoringToken');
    localStorage.removeItem('googleOAuthToken');
    localStorage.removeItem('advisorRoles');
    window.name = undefined;
    localStorage.clear();
    sessionStorage.removeItem('clientList');
    sessionStorage.removeItem('ToDo');
    sessionStorage.clear();
    sessionStorage.removeItem('taskMatrix');
    sessionStorage.removeItem('todaysTaskList')
    sessionStorage.removeItem('invalidPopup')
    DashboardService.clearDashData()
    // this.myRoute.navigate(['login']);
  }

  setUserInfo(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
  }

  selectedClient: any;

  static setSubscriptionUpperSliderData(data) {
    sessionStorage.setItem('subUpperData', JSON.stringify(data));
  }

  setProfileDetails(profileData) {
    sessionStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('profileData', JSON.stringify(profileData));

  }

  // getSelectedClient(){
  //   return this.selectedClient;
  // }

  static getSubscriptionUpperSliderData() {
    return JSON.parse(sessionStorage.getItem('subUpperData'));
  }

  static goHome(router: Router) {
    const userInfo = AuthService.getUserInfo();
    if (userInfo.userType == 1 || userInfo.userType == 8) {
      router.navigate(['admin', 'dashboard']);
    } else if (userInfo.isRmLogin) {
      router.navigate(['support', 'dashboard']);
    } else {
      router.navigate(['customer', 'detail', 'overview', 'myfeed']);
    }
  }

  setClientData(clientData) {
    sessionStorage.setItem('clientData', JSON.stringify(clientData));
    if (clientData.familyMemberId) {
      this.familyMemberId = clientData.familyMemberId;
    }
    clientData.familyMemberId = this.familyMemberId;
    localStorage.setItem('clientData', JSON.stringify(clientData));

    // if(clientData){
    //   this.selectedClient = clientData;
    // }
  }
}
