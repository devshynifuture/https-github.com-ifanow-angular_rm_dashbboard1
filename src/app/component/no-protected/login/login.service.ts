import {Injectable} from '@angular/core';
import {HttpService} from 'src/app/http-service/http-service';
import {apiConfig} from 'src/app/config/main-config';
import {appConfig} from 'src/app/config/component-config';

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

  register(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.REGISTER, data);
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
}
