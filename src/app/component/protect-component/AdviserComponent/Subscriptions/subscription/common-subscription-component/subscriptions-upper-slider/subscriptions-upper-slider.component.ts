import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { DeleteSubscriptionComponent } from '../delete-subscription/delete-subscription.component';
import { SubscriptionService } from '../../../subscription.service';
import { AuthService } from "../../../../../../../auth-service/authService";
import { UtilService } from 'src/app/services/util.service';

export interface PeriodicElement {
  service: string;
  amt: string;
  type: string;
  subs: string;
  status: string;
  date: string;
  bdate: string;
  ndate: string;
  mode: string;
}


@Component({

  selector: 'app-subscriptions-upper-slider',
  templateUrl: './subscriptions-upper-slider.component.html',
  styleUrls: ['./subscriptions-upper-slider.component.scss']
})
export class SubscriptionsUpperSliderComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, private eventService: EventService, public dialog: MatDialog, public subscription: SubscriptionService) {
  }

  ELEMENT_DATA;
  dataSource;

  displayedColumns: string[] = ['service', 'amt', 'type', 'subs', 'status', 'date', 'bdate', 'ndate', 'mode', 'icons'];

  @Input() upperData;
  advisorId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getSummaryDataClient();
    console.log(this.upperData);
  }

  openPlanSlider(value, state, data) {
    // console.log("upperdata create sub")
    (value=="billerSettings"|| value=='changePayee')?value:(data.subscriptionPricing.feeTypeId == 1) ? value = 'createSubFixed' : value = 'createSubVariable'
    // this.eventService.sliderData(value);
    // this.eventService.sidebarData(value)
    // this.subInjectService.rightSliderData(state);
    data.clientId = this.upperData.id
    data.isCreateSub = true;
    const fragmentData = {
      Flag: value,
      data:data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.subInjectService.pushUpperData(data)
  }

  getSummaryDataClient() {
    const obj = {
      // 'id':2735, //pass here advisor id for Invoice advisor
      // 'module':1,
      // advisorId: 12345,
      advisorId: this.advisorId,
      clientId: this.upperData.id,
      flag: 4,
      dateType: 0,
      limit: 10,
      offset: 0,
      order: 0,
    };

    this.subscription.getSubSummary(obj).subscribe(
      data => this.getSubSummaryRes(data)
    );
  }
  Open(state, data) {
    let feeMode;
    (data.subscriptionPricing.feeTypeId == 1)?feeMode = 'fixedModifyFees':feeMode = 'variableModifyFees';
    const fragmentData = {
      Flag: feeMode,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getSubSummaryRes(data) {
    console.log(data);
    this.dataSource = data;
  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      dataToShow: data,
      header: 'DELETE',
      body: 'Are you sure you want to delete the suscription?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,

      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  delete(data, value) {
    const Fragmentdata = {
      Flag: data,
      subData: value
    };
    if (data == 'cancelSubscription') {
      const dialogRef = this.dialog.open(DeleteSubscriptionComponent, {
        width: '50%',
        // height:'40%',
        data: Fragmentdata,
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

}
