import {appConfig} from './../../config/component-config';
import {apiConfig} from './../../config/main-config';
import {AuthService} from './../../auth-service/authService';
import {SubscriptionInject} from './../protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import {HttpService} from '../../http-service/http-service';
import {HttpHeaders} from '@angular/common/http';

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
  REDIRECT_URI = 'http://localhost:8080/redirect';
  advisorId;
  emailId;

  constructor(private route: ActivatedRoute,
              private httpService: HttpService,
              private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.emailId = AuthService.getUserInfo().emailId;
    this.route.queryParams
      .subscribe(params => {
        console.log('GmailRedirectComponent ngOnInit ', params); // {order: "popular"}
        const bodyData = 'code=' + params.code + '&client_id=' + this.CLIENT_ID
          + '&client_secret=' + this.CLIENT_SECRET + '&grant_type=' + this.GRANT_TYPE
          + '&redirect_uri=' + this.REDIRECT_URI;
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
        console.log('GmailRedirectComponent ngOnInit bodyData: ', bodyData);

        this.httpService.postExternal(this.URL, bodyData, httpOptions).subscribe((responseData) => {
          console.log('GmailRedirectComponent ngOnInit bodyData: ', bodyData);

          const serverRequestData = {...responseData, userId: this.advisorId, emailId: this.emailId};
          this.sendDataToServer(serverRequestData);
          console.log('GmailRedirectComponent ngOnInit postExternal responseData: ', responseData);
        }, (errorResponse) => {
          console.log('GmailRedirectComponent ngOnInit postExternal errorResponse: ', errorResponse);
        });
        // this.order = params.order;
        // console.log(this.order); // popular
      });
  }

  sendDataToServer(data) {
    console.log(data);

    this.httpService.post(apiConfig.GMAIL_URL + appConfig.ACCESS_TOKEN_SAVE, data).subscribe(
      response => console.log('this is gmail succeed response', response)
    );
  }
}
