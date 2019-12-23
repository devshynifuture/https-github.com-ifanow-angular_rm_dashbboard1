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

  static getClientData() {
    let clientDataString = sessionStorage.getItem('clientData');
    if (clientDataString) {
      localStorage.setItem('clientData', clientDataString);
    } else {
      clientDataString = localStorage.getItem('clientData');
    }
    console.log('getClientData : ', clientDataString);

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

  // static get
}
