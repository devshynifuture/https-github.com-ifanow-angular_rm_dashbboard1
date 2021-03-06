
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { EmailServiceService } from '../../email-service.service';
import { EventService } from '../../../../../../Data-service/event.service';

import { MatDialog } from '@angular/material';
import { GoogleConnectDialogComponent } from '../google-connect-dialog/google-connect-dialog.component';
import { UtilService } from '../../../../../../services/util.service';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { EmailFaqAndSecurityComponent } from '../email-faq-and-security/email-faq-and-security.component';
import { AuthService } from '../../../../../../auth-service/authService';


@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss']
})
export class EmailSettingsComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private emailService: EmailServiceService,
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    public dialog: MatDialog) { }


  //  URLv2 = 'https://accounts.google.com/o/oauth2/v2/auth';
  //  SCOPE2 = 'https://mail.google.com+https://www.googleapis.com/auth/calendar';

  advisorId;
  emailId;
  showEmailInput: boolean = false;
  redirectForm;
  isEmail: boolean = true;


  ngOnInit() {
    this.redirectForm = this.fb.group({
      googleConnectEmail: ['', Validators.required]
    });

    if (this.doesTokenStoredInLocalStorage()) {
      this.isLoggedIn = true;
    } else {
      this.emailService.getProfile().subscribe(res => {
        if (res) {
          localStorage.setItem('googleOAuthToken', 'oauthtoken');
          localStorage.setItem('successStoringToken', 'true');
          localStorage.setItem('associatedGoogleEmailId', AuthService.getUserInfo().userName);
          this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute });
          this.isLoggedIn = true;
        } else {
          this.eventService.openSnackBarNoDuration("Please connect your Gmail account!!", 'DISMISS');
          this.isLoggedIn = false;
        }
      }, err => {
        this.isLoggedIn = false;
      });
    }

    if (this.router.url == "/admin/activies/month") {
      this.isEmail = false;

    }
    else {
      this.isEmail = true;
    }

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


  // setTimeout(() => {
  //   redirectWindow.close();
  //   console.log("tis is something to work with");
  //   if (localStorage.getItem('successStoringToken') === 'true') {
  //     this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  //   }
  // }, 25000);

  // }

  openGoogleConnectDialog() {

    const dialogRef = this.dialog.open(GoogleConnectDialogComponent, {
      width: '390px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  openImportantNoticeEmail() {
    console.log("clicked");
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

}


