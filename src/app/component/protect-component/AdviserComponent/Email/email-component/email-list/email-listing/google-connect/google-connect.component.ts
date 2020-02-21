import { EventService } from './../../../../../../../../Data-service/event.service';
import { AuthService } from './../../../../../../../../auth-service/authService';
import { EmailServiceService } from './../../../../email-service.service';
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
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private emailService: EmailServiceService,
    private eventService: EventService) { }


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

    if (!(localStorage.getItem('googleOAuthToken') && localStorage.getItem('successStoringToken') && localStorage.getItem('associatedGoogleEmailId'))) {
      localStorage.removeItem('googleOAuthToken');
      localStorage.removeItem('successStoringToken');
      localStorage.removeItem('associatedGoogleEmailId');
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute })
    }

  }

  toggleShowEmailInput() {
    this.showEmailInput = !this.showEmailInput;
  }

  gmailRedirectUrlCreation() {
    const hitGmailUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=579886643607-h1m21go2dct12nva48pi5mr7meejv7nh.apps.googleusercontent.com&response_type=code&scope=https://mail.google.com+https://www.googleapis.com/auth/calendar&redirect_uri=http://localhost:4200/redirect&access_type=offline';

    localStorage.removeItem('associatedGoogleEmailId');
    // compare it with authEmail id
    if (AuthService.getUserInfo().emailId == this.redirectForm.get('googleConnectEmail').value) {
      localStorage.setItem('associatedGoogleEmailId', this.redirectForm.get('googleConnectEmail').value)
      const redirectWindow = window.open(hitGmailUrl);
      const lookForSuccessToken = setInterval(() => {
        if (localStorage.getItem('successStoringToken') === 'true') {
          clearInterval(lookForSuccessToken);
          redirectWindow.close();
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
      }, 1000);
    } else {
      this.eventService.openSnackBar("Your email id is not same as your login credentials", "DISMISS")
    }


    // setTimeout(() => {
    //   redirectWindow.close();
    //   console.log("tis is something to work with");
    //   if (localStorage.getItem('successStoringToken') === 'true') {
    //     this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    //   }
    // }, 25000);

  }

}


