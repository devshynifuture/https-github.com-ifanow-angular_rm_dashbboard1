import { Injectable } from '@angular/core';

// import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  constructor(/*private myRoute: Router*/) {
  }

  static getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  static getAdvisorId() {
    return this.getUserInfo().advisorId;
  }
  static getUserId() {
    return this.getUserInfo().userId;
  }
  static getClientData() {
    let clientDataString = sessionStorage.getItem('clientData');
    return clientDataString ? JSON.parse(clientDataString) : undefined;
  }

  static getClientId() {
    const clientData = this.getClientData();
    return clientData ? clientData.id : undefined;
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('clientData');
    sessionStorage.removeItem('clientData');

    // this.myRoute.navigate(['login']);
  }

  static setUserInfo(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
  }

  static setClientData(clientData) {
    sessionStorage.setItem('clientData', JSON.stringify(clientData));
    localStorage.setItem('clientData', JSON.stringify(clientData));

    console.log('setClientData : ', clientData);
  }
  static setSubscriptionUpperSliderData(data) {
    sessionStorage.setItem("subUpperData", JSON.stringify(data))
  }
  static getSubscriptionUpperSliderData() {
    return JSON.parse(sessionStorage.getItem('subUpperData'))
  }
  // static get
}
