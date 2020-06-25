import { Component, OnInit, Input, Output } from '@angular/core';
import { SubscriptionService } from '../../../subscription.service';
import { SubscriptionComponent } from '../../subscription.component';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { SubscriptionPopupComponent } from '../../common-subscription-component/subscription-popup/subscription-popup.component';
import { AuthService } from "../../../../../../../auth-service/authService";
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-completeness',
  templateUrl: './subscription-completeness.component.html',
  styleUrls: ['./subscription-completeness.component.scss']
})
export class SubscriptionCompletenessComponent implements OnInit {
  button: any;
  completed: string;
  showLoader: boolean;
  @Output() subscriptionIndex = new EventEmitter();
  @Output() dashboard = new EventEmitter<Object>();
  constructor(public dialog: MatDialog, private subscription: SubscriptionService, public sub: SubscriptionComponent,
    public eventService: EventService, private router: Router) {
  }
  @Input() dataObj;
  // advisorId = 2727;
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    // this.getSubscriptionStagesRecord();
    this.getDashboardResponse();
    // this.getDashboardData(this.dataObj);
    this.showLoader = true;
  }
  getDashboardResponse() {

    this.subscription.getDashboardSubscriptionResponse(this.advisorId).subscribe(
      data => this.getDashboardData(data.advisorAccomplishedSubscriptionFinalList)
    );
  }
  getDashboardData(data) {
    if (data && data.length > 0) {
      data.forEach((singleData) => {
        if (singleData.stepTypeId == 1 || singleData.stepTypeId == 2) {
          singleData['selectedTab'] = 7;
        }
        if (singleData.stepTypeId == 3) {
          singleData['selectedTab'] = 2;
        }
        if (singleData.stepTypeId == 5) {
          singleData['selectedTab'] = 6;
        }
        if (singleData.stepTypeId == 4) {
          singleData['selectedTab'] = 4;
        }
        if (singleData.stepTypeId == 6) {
          singleData['selectedTab'] = 5;
        }
      });
      // if (data.length>) {
      // data[0].selectedTab = 7;
      // data[1].selectedTab = 7;
      // data[1].selectedSettingTab = 3
      // data[2].selectedTab = 2;
      // data[3].selectedTab = 4;
      // data[4].selectedTab = 6;
      // data[5].selectedTab = 4;
      // }
    }
    this.dataObj = data;

    this.showLoader = false;

  }

  getSubStagesRecordResponse(data) {
    this.showLoader = false;
  }

  goToSelectivePage() {
    this.sub.subscriptionTab = 'SETTINGS';
  }

  currentTabs(value, ind) {
    this.eventService.tabData(value.selectedTab)
    if (value.selectedTab == 7 && ind == 0) {
      this.router.navigate(['/admin/subscription/settings', 'plans']);
    } else {
      this.router.navigate(['/admin/subscription/settings', 'preferences']);
    }
    switch (value.selectedTab) {
      case (2):
        this.router.navigate(['admin', 'subscription', 'clients']);
        break;
      case (4):
        this.router.navigate(['admin', 'subscription', 'quotations']);
        break;
      case (5):
        this.router.navigate(['admin', 'subscription', 'invoices']);
        break;
      case (6):
        this.router.navigate(['admin', 'subscription', 'documents']);
        break;
      default:
    }
  }
  close() {
    var showSubStep = false
    this.dashboard.emit(showSubStep);
  }

  openPopup(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      width: '70%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }




}
