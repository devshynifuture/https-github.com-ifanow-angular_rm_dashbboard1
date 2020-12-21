import {Injectable} from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';
import {AuthService} from '../../../auth-service/authService';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {RoleService} from "../../../auth-service/role.service";
import {ReferAndEarnPopupsComponent} from './refer-and-earn-popups/refer-and-earn-popups.component';
import {MatDialog} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpService, private roleService: RoleService, public dialog: MatDialog,) {
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

  resetPasswordPostLoggedIn(data) {
    return this.http.post(apiConfig.MAIN_URL + appConfig.RESET_PASSWORD, data);
  }

  loginWithPassword(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.LOGIN_WITH_PASSWORD, data, 1);
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
    if (!userData) {
      return;
    }


    if (userData.userType == 1 || userData.userType == 8) {
      this.roleService.getRoleDetails(userData.roleId, (rolesData) => {
        authService.setToken('authTokenInLoginComponent');
        authService.setUserInfo(userData);
        router.navigate(['admin', 'dashboard']);
        if (userData.showReferPopup) {
          this.openDialog();
        }
      });

    } else if (userData.isRmLogin) {
      authService.setToken('authTokenInLoginComponent');
      authService.setUserInfo(userData);
      router.navigate(['support', 'dashboard']);
    } else {
      this.roleService.getRoleDetails(userData.roleId, (rolesData) => {
        authService.setToken('authTokenInLoginComponent');
        authService.setUserInfo(userData);
        userData.id = userData.clientId;
        authService.setClientData(userData);
        router.navigate(['customer', 'detail', 'overview', 'myfeed']);
      });
    }
    // when changing routers, make changes to authservice gohome() method
  }

  getCLientDetails(data) {
    return this.http.getEncoded(apiConfig.USER + appConfig.GET_CLIENT_INFO_BASED_ON_USERNAME, data, 1);
  }

  updateResetLinkExpire(data) {
    return this.http.putEncoded(apiConfig.USER + appConfig.RESET_LINK_EXPIRE, data);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ReferAndEarnPopupsComponent, {
        width: '40%',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

    });
  }
}

