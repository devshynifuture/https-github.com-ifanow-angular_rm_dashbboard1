import { EmailServiceService } from './../protect-component/AdviserComponent/Email/email-service.service';
import { appConfig } from './../../config/component-config';
import { apiConfig } from './../../config/main-config';
import { AuthService } from './../../auth-service/authService';
import { SubscriptionInject } from './../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import { HttpService } from '../../http-service/http-service';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gmail-redirect',
  templateUrl: './gmail-redirect.component.html',
  styleUrls: ['./gmail-redirect.component.scss']
})
export class GmailRedirectComponent implements OnInit {

  // URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  URL = 'https://www.googleapis.com/oauth2/v4/token';
  CLIENT_ID = '579886643607-h1m21go2dct12nva48pi5mr7meejv7nh.apps.googleusercontent.com';
  CLIENT_SECRET = 'Zpw9vHRljgbRbgAOe4UQArld';
  RESPONSE_TYPE = 'code';
  SCOPE = 'htpps://mail.google.com';
  GRANT_TYPE = 'authorization_code';
  REDIRECT_URI = '';
  advisorId;
  emailId;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private httpService: HttpService,
    private location: Location) {
  }

  ngOnInit() {
    this.REDIRECT_URI = window.location.origin + '/redirect';
    console.log(this.REDIRECT_URI);

    this.advisorId = AuthService.getAdvisorId();
    this.emailId = AuthService.getUserInfo().userName;
    this.route.queryParams
      .subscribe(params => {


        localStorage.removeItem('googleOAuthToken');

        localStorage.setItem('googleOAuthToken', String(JSON.stringify(params)));
        // {order: "popular"}


        const bodyData = 'code=' + params.code + '&client_id=' + this.CLIENT_ID
          + '&client_secret=' + this.CLIENT_SECRET + '&grant_type=' + this.GRANT_TYPE
          + '&redirect_uri=' + this.REDIRECT_URI;

        console.log("this is something i need to see", bodyData);

        const httpOptions = {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        };
        /* const bodyData = {
           code: params.code,
           client_id: this.CLIENT_ID,
           client_secret: this.CLIENT_SECRET,
           grant_type: this.GRANT_TYPE,
           redirect_uri: this.REDIRECT_URI,

         };*/

        this.httpService.postExternal(this.URL, bodyData, httpOptions).subscribe((responseData) => {

          const serverRequestData = { ...responseData, userId: this.advisorId, emailId: localStorage.getItem('associatedGoogleEmailId') };
          this.sendDataToServer(serverRequestData);
        }, (errorResponse) => {
        });
        // this.order = params.order;
      });
  }

  closeTab() {
    window.close();
  }

  sendDataToServer(data) {

    this.httpService.post(apiConfig.GMAIL_URL + appConfig.ACCESS_TOKEN_SAVE, data).subscribe(
      response => {
        console.log("successStoringToken");

        localStorage.setItem("successStoringToken", "true");
        this.isSuccess = true;
        window.close();
      },
      error => {
        this.isSuccess = false;
        console.error(error);
      }
    );
  }
}
