import {Injectable} from '@angular/core';

// import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  constructor(
    /*private myRoute: Router*/
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
    return this.getUserInfo().adminId;
  }

  static getRmId() {
    if (this.getUserInfo().hasOwnProperty('rmId')) {
      return this.getUserInfo().rmId;
    } else {
      return null;
    }
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
    console.log(' authservuce , isloggedin : ', this.getToken());
    console.log(' authservuce , isloggedin : ', AuthService.getUserInfo());
    return this.getToken() !== null && AuthService.getUserInfo() && AuthService.getUserInfo().userType;
  }

  isAdvisor() {
    if (AuthService.getUserInfo()) {
      // console.log('Authservice isAdvisor userType: ', AuthService.getUserInfo().userType);
      return AuthService.getUserInfo().userType ? AuthService.getUserInfo().userType === 1 : false;
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

    // this.myRoute.navigate(['login']);
  }

  setUserInfo(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
  }

  setClientData(clientData) {
    sessionStorage.setItem('clientData', JSON.stringify(clientData));
    localStorage.setItem('clientData', JSON.stringify(clientData));

    console.log('setClientData : ', clientData);
  }

  setProfileDetails(profileData) {
    sessionStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('profileData', JSON.stringify(profileData));

    console.log('setClientData : ', profileData);
  }

  static setSubscriptionUpperSliderData(data) {
    sessionStorage.setItem("subUpperData", JSON.stringify(data))
  }

  static getSubscriptionUpperSliderData() {
    return JSON.parse(sessionStorage.getItem('subUpperData'))
  }

  // static get
}
