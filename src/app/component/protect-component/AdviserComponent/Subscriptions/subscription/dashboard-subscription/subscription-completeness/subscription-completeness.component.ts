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
  constructor(public dialog: MatDialog, private subscription: SubscriptionService, public sub: SubscriptionComponent,
    public eventService: EventService, private router: Router) {
  }
  @Input() dataObj;
  // advisorId = 2727;
  advisorId;
  //   dataObj=[{'completed':'false','data':'Create Plans, Services & Documents','innerData':'Adding these will set up the foundation for your RIA practice','tab':6}
  // ,{'completed':'false','data':'Set up your Biller profile','innerData':'These details show up in the invoices your clients will receive.','tab':6},
  // {'completed':'false','data':'Add Plan to a client','innerData':'Kickstart your core workflow with a client and unfold the magic. Add a Plan to take things forward.','tab':1},
  // {'completed':'false','data':'Send Quotation to a client','innerData':'Once you’ve added a Plan, you can send out a Quotation to the client, get their approval before the actual billing starts.','tab':3},
  // {'completed':'false','data':'Send Document for eSign','innerData':'Email documents to client with one click. Client can review them and proceed for e-singing using Aadhaar based eSign.','tab':5},
  // {'completed':'false','data':'Record Payment','innerData':'Email documents to client with one click. Client can review them and proceed for e-singing using Aadhaar based eSign.','tab':4}]
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    // this.getSubscriptionStagesRecord();
    this.getDashboardResponse();
    // this.getDashboardData(this.dataObj);
    this.showLoader = true;
    console.log(this.router.url);
  }

  /*getSubscriptionStagesRecord() {
    const obj = {
      // advisorId: 2735,
      advisorId: this.advisorId,
      amountReceived: 1000,
      changesIfAny: 'nothing',
      paymentDate: '2001-01-01',
      paymentMode: 1,
      notes: 'notes',
      invoiceId: 1
    };
    this.subscription.getSubscriptionCompleteStages(obj).subscribe(
      data => this.getSubStagesRecordResponse(data)
    );
  }
*/
  // getDashboardResponse() {

  //   this.subscription.getDashboardSubscriptionResponse(this.advisorId).subscribe(
  //     data => this.getDashboardData(data)
  //   );
  // }
  getDashboardResponse() {

    this.subscription.getDashboardSubscriptionResponse(this.advisorId).subscribe(
      data => this.getDashboardData(data.advisorAccomplishedSubscriptionFinalList)
    );
  }
  getDashboardData(data) {
    if (data && data.length > 0) {
      data.forEach((singleData) => {
      });
      if (data.length >= 6) {
        data[0].selectedTab = 6;
        data[1].selectedTab = 6;
        data[1].selectedSettingTab = 3
        data[2].selectedTab = 1;
        data[3].selectedTab = 3;
        data[4].selectedTab = 5;
        data[5].selectedTab = 4;
      }
    }
    this.dataObj = data;
    this.showLoader = false;

  }

  getSubStagesRecordResponse(data) {
    this.showLoader = false;
    console.log(data);
  }

  goToSelectivePage() {
    this.sub.subscriptionTab = 'SETTINGS';
  }

  currentTabs(value) {
    // this.eventService.tabData(value.selectedTab)
    switch (value.selectedTab) {
      case (1):
        this.router.navigate(['admin', 'subscription', 'clients']);
        break;
      case (3):
        this.router.navigate(['admin', 'subscription', 'quotations']);
        break;
      case (4):
        this.router.navigate(['admin', 'subscription', 'invoices']);
        break;
      case (5):
        this.router.navigate(['admin', 'subscription', 'documents']);
        break;
      case (6):
        this.router.navigate(['admin', 'subscription', 'settings']);
        break;
      default:
        console.log("default selection")
    }


  }

  openPopup(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(SubscriptionPopupComponent, {
      width: '70%',
      height: '100%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


}
