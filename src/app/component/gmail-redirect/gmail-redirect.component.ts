import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import 'rxjs-compat/add/operator/filter';
import {HttpService} from "../../http-service/http-service";
import {HttpHeaders} from "@angular/common/http";

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
  GRANT_TYPE = 'authorization_code';
  REDIRECT_URI = 'http://localhost:8080/redirect';

  constructor(private route: ActivatedRoute, private httpService: HttpService) {
  }

  ngOnInit() {

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
          console.log('GmailRedirectComponent ngOnInit postExternal responseData: ', responseData);
        }, (errorResponse) => {
          console.log('GmailRedirectComponent ngOnInit postExternal errorResponse: ', errorResponse);
        });
        // this.order = params.order;
        // console.log(this.order); // popular
      });
  }

}
