import { Subscription } from 'rxjs';
import { EmailDataStorageService } from '../../email-data-storage.service';
import { ComposeEmailComponent } from "../compose-email/compose-email.component";
import { ActivatedRoute, Router } from "@angular/router";
import { EmailServiceService } from "../../email-service.service";
import { Component, OnInit } from "@angular/core";
import { EventService } from "../../../../../../Data-service/event.service";
import { AuthService } from "../../../../../../auth-service/authService";

@Component({
  selector: "app-email-left-sidebar",
  templateUrl: "./email-left-sidebar.component.html",
  styleUrls: ["./email-left-sidebar.component.scss"],
})
export class EmailLeftSidebarComponent implements OnInit {
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
  location: any;
  unreadCount: number;
  unReadCountSubs: Subscription;

  constructor(
    private emailService: EmailServiceService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private emailDataStorageService: EmailDataStorageService
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
  }

  isUserAuthenticated() {
    if (localStorage.getItem("associatedGoogleEmailId")) {
      const userInfo = AuthService.getUserInfo();
      userInfo["email"] = localStorage.getItem("associatedGoogleEmailId");
      this.authService.setUserInfo(userInfo);
    }
    let location;
    location = this.router.url.split("/")[
      this.router.url.split("/").length - 1
    ];
    this.location = location;
    if (this.router.url.split("/").includes("customer")) {
      this.isCustomerEmail = true;
    } else {
      this.isCustomerEmail = false;
    }
    this.paginatorSubscription = this.emailService.getProfile().subscribe(
      (response) => {
        if (!response) {
          this.eventService.openSnackBar(
            "You must connect your gmail account",
            "Dismiss"
          );
          if (localStorage.getItem("successStoringToken")) {
            localStorage.removeItem("successStoringToken");
          }
          this.isAllowedToCompose = false;
        } else {
          this.getRightSideNavListCount();
          this.isAllowedToCompose = true;
        }
      },
      (err) => {
        this.eventService.openSnackBar(
          "You must connect your gmail account",
          "Dismiss"
        );
        if (localStorage.getItem("successStoringToken")) {
          localStorage.removeItem("successStoringToken");
        }
        this.isAllowedToCompose = false;
      }
    );
  }
  openCompose() {
    if (this.isAllowedToCompose) {
      this.emailService.openComposeEmail(null, ComposeEmailComponent, "email");
    } else {
      this.eventService.openSnackBar(
        "You must connect your gmail account",
        "Dismiss"
      );
    }
  }

  getRightSideNavListCount() {
    this.isLoading = true;

    this.unReadCountSubs = this.emailDataStorageService.getUnReadCountThroughObs()
      .subscribe(res => {
        if (res) {
          this.unreadCount = +res;
        }
      });

    this.emailService.getRightSideNavList().subscribe((responseData) => {
      this.navList = responseData;
      console.log("check navlist :::", this.navList);
      if (this.navList.length !== 0) {
        let obj = {
          inboxCount: null,
          sentCount: null,
          starredCount: null,
          draftCount: null,
          trashCount: null,
          unreadCount: null
        };
        this.navList.forEach((element) => {
          switch (element.labelId) {
            case "INBOX":
              this.importantCount = element.threadsTotal;
              obj.inboxCount = this.importantCount;
              break;
            case "SENT":
              this.sentCount = element.threadsTotal;
              obj.sentCount = this.sentCount;
              break;
            case "DRAFT":
              this.draftCount = element.threadsTotal;
              obj.draftCount = this.draftCount;
              break;
            case "TRASH":
              this.trashCount = element.threadsTotal;
              obj.trashCount = this.trashCount;
              break;
            case "STARRED":
              this.starredCount = element.threadsTotal;
              obj.starredCount = this.starredCount;
              break;
          }
          this.emailDataStorageService.storeNavCount(obj);
          if (
            (this.location.toUpperCase() === "INBOX" ? "IMPORTANT" : "") ===
            element.labelId
          ) { }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unReadCountSubs) {
      this.unReadCountSubs.unsubscribe();
    }
  }
}
