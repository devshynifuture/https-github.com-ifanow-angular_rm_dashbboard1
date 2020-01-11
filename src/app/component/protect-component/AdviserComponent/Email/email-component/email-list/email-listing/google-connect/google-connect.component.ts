import { HttpService } from 'src/app/http-service/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-google-connect',
  templateUrl: './google-connect.component.html',
  styleUrls: ['./google-connect.component.scss']
})
export class GoogleConnectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private httpService: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  //  URLv2 = 'https://accounts.google.com/o/oauth2/v2/auth';
  //  SCOPE2 = 'https://mail.google.com+https://www.googleapis.com/auth/calendar';

   URL = 'https://www.googleapis.com/oauth2/v4/token';
   CLIENT_ID = '579886643607-h1m21go2dct12nva48pi5mr7meejv7nh.apps.googleusercontent.com';
   CLIENT_SECRET = 'Zpw9vHRljgbRbgAOe4UQArld';
   RESPONSE_TYPE = 'code';
   SCOPE = 'htpps://mail.google.com';
   GRANT_TYPE = 'authorization_code';
   REDIRECT_URI = 'http://localhost:4200/admin/emails/inbox';
   advisorId;
   emailId;
   showEmailInput: boolean = false;
   redirectForm;

  ngOnInit() {
    this.redirectForm = this.fb.group({
      googleConnectEmail: ['', Validators.required]
    });
    localStorage.removeItem('googleOAuthToken');
    localStorage.removeItem('successStoringToken');
    localStorage.removeItem('associatedGoogleEmailId');
  }

  toggleShowEmailInput(){
    this.showEmailInput = !this.showEmailInput;
  }

  gmailRedirectUrlCreation(){
    const hitGmailUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=579886643607-h1m21go2dct12nva48pi5mr7meejv7nh.apps.googleusercontent.com&response_type=code&scope=https://mail.google.com+https://www.googleapis.com/auth/calendar&redirect_uri=http://localhost:4200/redirect&access_type=offline';
  
    localStorage.removeItem('associatedGoogleEmailId');
    localStorage.setItem('associatedGoogleEmailId' ,this.redirectForm.get('googleConnectEmail').value)
    const redirectWindow = window.open(hitGmailUrl);

    setTimeout(() => {
      redirectWindow.close();

      if(localStorage.getItem('successStoringToken') === 'true'){
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      }
    } , 15000);
  }

}


