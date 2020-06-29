import { ComposeEmailComponent } from './../compose-email/compose-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailServiceService } from './../../email-service.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../../../Data-service/event.service';
import { AuthService } from '../../../../../../auth-service/authService';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  paginatorSubscription: any;
  isAllowedToCompose: boolean;
  isLoading: boolean;

  constructor(
    private emailService: EmailServiceService,
    private eventService: EventService,
    private authService: AuthService
  ) { }


  ngOnInit() {
    this.isUserAuthenticated();
  }

  isUserAuthenticated() {
    if (localStorage.getItem('associatedGoogleEmailId')) {
      const userInfo = AuthService.getUserInfo();
      userInfo['email'] = localStorage.getItem('associatedGoogleEmailId');
      this.authService.setUserInfo(userInfo);
    }

    this.paginatorSubscription = this.emailService.getProfile()
      .subscribe(response => {
        if (!response) {
          this.eventService.openSnackBar("You must connect your gmail account", "Dismiss");
          if (localStorage.getItem('successStoringToken')) {
            localStorage.removeItem('successStoringToken');
          }
          this.isAllowedToCompose = false;
        } else {
          this.isAllowedToCompose = true;
        }
      }, err => {
        this.eventService.openSnackBar("You must connect your gmail account", "Dismiss");
        if (localStorage.getItem('successStoringToken')) {
          localStorage.removeItem('successStoringToken');
        }
        this.isAllowedToCompose = false;
      });
  }
  openCompose() {
    if (this.isAllowedToCompose) {
      this.emailService.openComposeEmail(null, ComposeEmailComponent, 'email');
    } else {
      this.eventService.openSnackBar("You must connect your gmail account", "Dismiss");
    }
  }

}
