import {Component, OnInit, Input} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../subscription-inject.service';
import {MatDialog} from '@angular/material';
import {DeleteSubscriptionComponent} from '../common-subscription-component/delete-subscription/delete-subscription.component';
import {SubscriptionService} from '../../subscription.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

export interface PeriodicElement {
  client: string;
  service: string;
  amt: string;
  sub: string;
  status: string;
  activation: string;
  lastbilling: string;
  nextbilling: string;
  feemode: string;
}

@Component({
  selector: 'app-subscriptions-subscription',
  templateUrl: './subscriptions-subscription.component.html',
  styleUrls: ['./subscriptions-subscription.component.scss']
})
export class SubscriptionsSubscriptionComponent implements OnInit {

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject, private eventService: EventService, private subService: SubscriptionService) {
  }

  subscriptionValue: any;
  @Input() upperData;

  displayedColumns: string[] = ['client', 'service', 'amt', 'sub', 'status', 'activation', 'lastbilling', 'nextbilling', 'feemode', 'icons'];
  dataSource;
  DataToSend;

  ngOnInit() {
    this.getSummaryDataAdvisor();
    console.log('upperData', this.upperData);
  }

  getSummaryDataAdvisor() {
    const obj = {
      // 'id':2735, //pass here advisor id for Invoice advisor
      // 'module':1,
      advisorId: 12345,
      clientId: 0,
      flag: 2,
      dateType: 0,
      limit: 10,
      offset: 0,
      order: 0,
    };
    this.subService.getSubSummary(obj).subscribe(
      data => this.getSubSummaryRes(data)
    );
  }

  getSubSummaryRes(data) {
    console.log(data);
    data.forEach(element => {
      element.feeMode = (element.feeMode === 1) ? 'FIXED' : 'VARIABLE';
      element.startsOn = (element.status === 1) ? 'START' : element.startsOn;
      element.status = (element.status === 1) ? 'NOT STARTED' : (element.status === 2) ?
        'LIVE' : (element.status === 3) ? 'FUTURE' : 'CANCELLED';
    });
    this.dataSource = data;
    this.DataToSend = data;
  }

  openPlanSlider(value, state,data) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
  }

  Open(state, data) {
    let feeMode;
    if(data.feeMode=="FIXED")
    {
      feeMode='fixedModifyFees'
    }
    else{
      feeMode='variableModifyFees'
    }
    this.eventService.sidebarData(feeMode);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);

  }

  deleteModal(value,data) {
    const dialogData = {
      data: value,
      dataToShow:data,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
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

  delete(data) {
    const Fragmentdata = {
      Flag: data,
    };
    if (data === 'cancelSubscription') {
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
