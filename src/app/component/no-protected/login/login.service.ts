import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/http-service/http-service';
import { apiConfig } from 'src/app/config/main-config';
import { appConfig } from 'src/app/config/component-config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpService) { }

  generateOtp(data) {
    return this.http.postEncoded(apiConfig.USER + appConfig.GENERATE_OTP, data);
  }
}
