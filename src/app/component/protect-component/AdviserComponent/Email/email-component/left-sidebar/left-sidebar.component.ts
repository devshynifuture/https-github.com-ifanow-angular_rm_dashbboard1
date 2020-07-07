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
  navList: any = [];
  importantCount: any;
  sentCount: any;
  draftCount: any;
  trashCount: any;
  starredCount: any;
  isCustomerEmail: boolean;

  constructor(
    private emailService: EmailServiceService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
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
    let location;
    location = this.router.url.split('/')[this.router.url.split('/').length - 1];
    if (this.router.url.split('/').includes('customer')) {
      this.isCustomerEmail = true;
    } else {
      this.isCustomerEmail = false;
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
          this.getRightSideNavListCount();
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

  getRightSideNavListCount() {
    this.isLoading = true;
    this.emailService.getRightSideNavList().subscribe(responseData => {
      this.navList = responseData;
      console.log("check navlist :::", this.navList);
      if (this.navList.length !== 0) {
        this.navList.forEach(element => {
          switch (element.labelId) {
            case 'IMPORTANT': this.importantCount = element.threadsTotal;
              break;
            case 'SENT': this.sentCount = element.threadsTotal;
              break;
            case 'DRAFT': this.draftCount = element.threadsTotal;
              break;
            case 'TRASH': this.trashCount = element.threadsTotal;
              break;
          }
        });
      }
    });
  }

}
