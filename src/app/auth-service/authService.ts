import {Injectable} from '@angular/core';
// import {Router} from '@angular/router';
import {Router} from '@angular/router';

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

  static getParentId() {
    return this.getUserInfo().parentId;
  }

  static getAdminId() {
    return this.getUserInfo().adminAdvisorId;
  }

  static getRmId() {
    if (this.getUserInfo().hasOwnProperty('rmId')) {
      return this.getUserInfo().rmId;
    } else {
      return null;
    }
  }

  static setUserRoleType(roleObj) {
    localStorage.setItem('roleObj', JSON.stringify(roleObj));
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


  static getClientId() {
    const clientData = this.getClientData();
    return clientData ? clientData.clientId ? clientData.clientId : clientData.id : undefined;
  }

  static setProfilePic(pic) {
    localStorage.setItem('profilePic', pic);
  }

  static setOrgDetails(data) {
    localStorage.setItem('orgData', JSON.stringify(data));
  }

  static setAdvisorDetails(data) {
    localStorage.setItem('advisorDetail', JSON.stringify(data));
  }

  static getAdvisorDetails() {
    const advisorDetail = localStorage.getItem('advisorDetail');
    return advisorDetail ? JSON.parse(advisorDetail) : '';
  }

  get orgData() {
    return JSON.parse(localStorage.getItem('orgData'));
  }

  get profilePic() {
    return localStorage.getItem('profilePic');
  }

  get appPic() {
    const orgData = JSON.parse(localStorage.getItem('orgData'));
    return orgData ? orgData.logoUrl : '';
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
      router.navigate(['admin', 'subscription', 'dashboard']);
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
