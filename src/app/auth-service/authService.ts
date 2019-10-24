import {Injectable} from '@angular/core';

// import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  constructor(/*private myRoute: Router*/) {
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

  static getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  static getAdvisorId() {
    return this.getUserInfo().advisorId;
  }

  logout() {
    localStorage.removeItem('token');
    // this.myRoute.navigate(['login']);
  }

  setUserInfo(info) {
    localStorage.setItem('userInfo', JSON.stringify(info));
  }

  // static get
}
