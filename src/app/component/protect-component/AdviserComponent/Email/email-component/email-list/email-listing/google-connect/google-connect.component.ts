import { EventService } from './../../../../../../../../Data-service/event.service';
import { AuthService } from './../../../../../../../../auth-service/authService';
import { EmailServiceService } from './../../../../email-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { GoogleConnectDialogComponent } from '../../../google-connect-dialog/google-connect-dialog.component';
import { UtilService } from '../../../../../../../../services/util.service';
import { SubscriptionInject } from '../../../../../Subscriptions/subscription-inject.service';
import { EmailFaqAndSecurityComponent } from '../../../email-faq-and-security/email-faq-and-security.component';

@Component({
  selector: 'app-google-connect',
  templateUrl: './google-connect.component.html',
  styleUrls: ['./google-connect.component.scss']
})
export class GoogleConnectComponent implements OnInit {
  @Output() googleConnected = new EventEmitter();

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private emailService: EmailServiceService,
    private eventService: EventService,
    public dialog: MatDialog,
    private subInjectService: SubscriptionInject) {
  }


  //  URLv2 = 'https://accounts.google.com/o/oauth2/v2/auth';
  //  SCOPE2 = 'https://mail.google.com+https://www.googleapis.com/auth/calendar';

  advisorId;
  emailId;
  showEmailInput: boolean = false;
  redirectForm;
  connect: any

  ngOnInit() {
    this.redirectForm = this.fb.group({
      googleConnectEmail: ['', Validators.required]
    });

    if (this.doesTokenStoredInLocalStorage()) {
      this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute });
    } else {
      // call for getProfile api for having connected mail
      this.emailService.getProfile().subscribe(res => {
        if (res) {
          localStorage.setItem('googleOAuthToken', 'oauthtoken');
          localStorage.setItem('successStoringToken', 'true');
          localStorage.setItem('associatedGoogleEmailId', AuthService.getUserInfo().userName);
          if (this.connect == "dash") {
            this.router.navigate(['/admin/dashboard'], { relativeTo: this.activatedRoute });
          }
          else if (this.connect = "calendar") {
            this.router.navigate(['/admin/activies/month'], { relativeTo: this.activatedRoute });
          }
          else {
            this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute });
          }
        } else {
          this.eventService.openSnackBarNoDuration('Please Connect Your Gmail Account!!', "DISMISS");
        }
      }, err => {

        console.log(err);
      });
    }
    if (this.router.url.split('/').includes('google-connect')) {
      this.connect = "email";
    } else if (this.router.url == '/admin/dashboard') {
      this.connect = "dash";
    } else if (this.router.url.split('/').includes('customer')) {
      this.connect = 'email';
    } else {
      this.connect = "calendar";
    }

  }

  toggleShowEmailInput() {
    this.showEmailInput = !this.showEmailInput;
  }

  doesTokenStoredInLocalStorage(): boolean {
    let returnVar;
    if (localStorage.getItem('googleOAuthToken')) {
      if (localStorage.getItem('successStoringToken')) {
        if (localStorage.getItem('associatedGoogleEmailId')) {
          returnVar = true;
        } else {
          returnVar = false;
        }
      } else {
        returnVar = false;
      }
    } else {
      returnVar = false;
    }
    return returnVar;
  }

  openImportantNoticeEmail() {
    console.log('clicked');
    const fragmentData = {
      id: 1,
      state: 'open35',
      componentName: EmailFaqAndSecurityComponent
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // refresh required.

            rightSideDataSub.unsubscribe();
          }
        }
      });

  }

  // gmailRedirectUrlCreation() {
  //   const hitGmailUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=579886643607-h1m21go2dct12nva48pi5mr7meejv7nh.apps.googleusercontent.com&response_type=code&scope=https://mail.google.com+https://www.googleapis.com/auth/calendar&redirect_uri=http://localhost:4200/redirect&access_type=offline';

  //   localStorage.removeItem('associatedGoogleEmailId');
  //   // compare it with authEmail id
  //   if (AuthService.getUserInfo().userName == this.redirectForm.get('googleConnectEmail').value) {
  //     localStorage.setItem('associatedGoogleEmailId', this.redirectForm.get('googleConnectEmail').value)
  //     const redirectWindow = window.open(hitGmailUrl);
  //     const lookForSuccessToken = setInterval(() => {
  //       if (localStorage.getItem('successStoringToken') === 'true') {
  //         clearInterval(lookForSuccessToken);
  //         redirectWindow.close();
  //         this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  //       }
  //     }, 1000);
  //   } else {
  //     this.eventService.openSnackBar("Your email id is not same as your login credentials", "Dismiss")
  //   }
  // }

  openGoogleConnectDialog() {

    const dialogRef = this.dialog.open(GoogleConnectDialogComponent, {
      width: '390px',
      data: this.connect
    });

    dialogRef.afterClosed().subscribe(result => {
      this.googleConnected.emit(true);
    });

  }

}


