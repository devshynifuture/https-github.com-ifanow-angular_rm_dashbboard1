import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';
import { AuthService } from '../../../auth-service/authService';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpService) {
  }

  generateOtp(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.GENERATE_OTP, data);
  }

  saveAfterVerification(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.SAVE_AFTER_VERIFICATION, data);
  }

  register(data, isClient) {
    if (isClient) {
      return this.http.postEncoded(apiConfig.USER + appConfig.ADD_CLIENT, data);
    } else {
      return this.http.postEncoded(apiConfig.USER + appConfig.REGISTER, data);
    }
  }

  getUsernameData(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.SEARCH_USERNAME, data, 1);
  }

  savePassword(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.SAVE_PASSWORD, data);
  }

  loginWithPassword(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.LOGIN_WITH_PASSWORD, data, 1);
  }

  supportLogin(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.LOGIN_WITH_PASSWORD, data, 1);
  }

  sendWelcomeEmail(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.SEND_WELCOME_EMAIL, data);
  }

  createTeamMember(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.CREATE_TEAM_MEMBER, data);
  }

  getTeamMemberInfo(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_TEAM_MEMBER_INFO, data, 1);
  }

  verifyOtp(data) {
    const url = 'https://api.msg91.com/api/v5/otp/verify?mobile=' + data.mobileNo +
      '&otp=' + data.otp + '&authkey=' + '299688ARWCWf9dMo5daa04d8';
    return this.http.getExternal(url);
  }

  handleUserData(authService: AuthService, router: Router, userData) {
    authService.setToken('authTokenInLoginComponnennt');
    if (userData.userType == 1 || userData.userType == 8) {
      authService.setUserInfo(userData);
      router.navigate(['admin', 'subscription', 'dashboard']);
    } else if (userData.isRmLogin) {
      authService.setToken('authTokenInLoginComponent');
      authService.setUserInfo(userData);
      router.navigate(['support', 'dashboard']);
    } else {
      authService.setToken('authTokenInLoginComponent');
      userData.id = userData.clientId;
      authService.setClientData(userData);
      authService.setUserInfo(userData);
      router.navigate(['customer', 'detail', 'overview', 'myfeed']);
    }
  }
}

