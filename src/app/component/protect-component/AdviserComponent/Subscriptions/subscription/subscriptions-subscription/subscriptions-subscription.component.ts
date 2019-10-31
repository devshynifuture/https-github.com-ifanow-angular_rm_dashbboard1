import {Component, Input, OnInit} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../subscription-inject.service';
import {MatDialog} from '@angular/material';
import {DeleteSubscriptionComponent} from '../common-subscription-component/delete-subscription/delete-subscription.component';
import {SubscriptionService} from '../../subscription.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {AuthService} from "../../../../../../auth-service/authService";
import * as _ from 'lodash';

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

  displayedColumns: string[] = ['client', 'service', 'amt', 'sub', 'status', 'activation',
    'lastbilling', 'nextbilling', 'feemode', 'icons'];

  subscriptionValue: any;
  @Input() upperData;
  advisorId;
  dataSource;
  DataToSend;
  chips = [
    'LIVE',
    'FUTURE',
    'NOT STARTED',
    'CANCELLED'
  ]
  dateChips = [
    'Activation date',
    'Last billing date',
    'Next billing date'
  ]
  filterStatus = []
  filterDate = []
  statusIdList = []
  sendData: any[];
  senddataTo: any;
  showFilter = false
  dataTocheck: boolean;
  live: boolean;
  notStarted: boolean;
  future: boolean;

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject,
              private eventService: EventService, private subService: SubscriptionService) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getSummaryDataAdvisor();
    console.log('upperData', this.upperData);
  }

  getSummaryDataAdvisor() {
    const obj = {
      // 'id':2735, //pass here advisor id for Invoice advisor
      // 'module':1,
      // advisorId: 12345,
      advisorId: this.advisorId,
      clientId: 0,
      flag: 0,
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
    // data.forEach(element => {
    //   element.feeMode = (element.feeMode === 1) ? 'FIXED' : 'VARIABLE';
    //   element.startsOn = (element.status === 1) ? 'START' : element.startsOn;
    //   element.status = (element.status === 1) ? 'NOT STARTED' : (element.status === 2) ?
    //     'LIVE' : (element.status === 3) ? 'FUTURE' : 'CANCELLED';
    // });
    this.dataSource = data;
    this.DataToSend = data;
  }

  openPlanSlider(value, state, data) {
    //data
    const billerDataProfile = this.subInjectService.singleProfileData.subscribe(data => {
      this.eventService.sidebarData(value);

    });
    const sideBarSubs = this.eventService.sidebarSubscribeData.subscribe(data => {
      setTimeout(() => {
        this.subInjectService.rightSideData(state);
      }, 500);
    });
    setTimeout(() => {
      billerDataProfile.unsubscribe();
      sideBarSubs.unsubscribe();

    }, 300);
    this.subInjectService.addSingleProfile(data);


  }

  Open(state, data) {
    let feeMode;
    if (data.subscriptionPricing.feeTypeId == 1) {
      feeMode = 'fixedModifyFees'
    } else {
      feeMode = 'variableModifyFees'
    }
    this.eventService.sidebarData(feeMode);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);

  }

  deleteModal(value, data) {
    const dialogData = {
      data: value,
      dataToShow: data,
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

  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = true
    } else {
      this.showFilter = false
    }

  }

  addFilters(addFilters) {
    console.log('addFilters', addFilters)
    if (addFilters == 'LIVE') {
      this.senddataTo = 2
    } else if (addFilters == 'NOT STARTED') {
      this.senddataTo = 1
    } else if (addFilters == 'FUTURE') {
      this.senddataTo = 3
    } else {
      this.senddataTo = 4
    }
    console.log(this.senddataTo)
    if (!_.includes(this.filterStatus, this.senddataTo)) {
      this.filterStatus.push(this.senddataTo)
    } else {
      _.remove(this.filterStatus, this.senddataTo);
    }
    this.sendData = this.filterStatus
    this.callFilter()
  }
  filterSubscriptionRes(data){
    console.log('filterSubscriptionRes',data)
    this.getSubSummaryRes(data)
  }

  addFiltersDate(dateFilter) {
    console.log('addFilters', dateFilter)
    this.filterDate.push(dateFilter)
    this.callFilter()
  }

  removeDate(item) {
    this.filterDate.splice(item, 1);
    this.callFilter()
  }

  remove(item) {
    this.filterStatus.splice(item, 1);
    this.callFilter()

  }

  callFilter() {
    this.statusIdList = this.sendData
    let obj = {
      advisorId: this.advisorId,
      limit: 10,
      offset: 0,
      fromDate:"2000-01-01",
      toDate:"3000-01-01",
      statusIdList: this.statusIdList,
      dateType:0
    }
    console.log('this.statusIdList', this.statusIdList)
    this.subService.filterSubscription(obj).subscribe(
      data => this.filterSubscriptionRes(data)
    );
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
