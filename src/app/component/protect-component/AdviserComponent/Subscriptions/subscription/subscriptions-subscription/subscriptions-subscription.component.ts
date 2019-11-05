import {Component, Input, OnInit} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from '../../subscription-inject.service';
import {MatDialog, MAT_DATE_FORMATS} from '@angular/material';
import {DeleteSubscriptionComponent} from '../common-subscription-component/delete-subscription/delete-subscription.component';
import {SubscriptionService} from '../../subscription.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {AuthService} from '../../../../../../auth-service/authService';
import * as _ from 'lodash';
import {EnumServiceService} from '../enum-service.service';
import {UtilService} from "../../../../../../services/util.service";
import { DatePipe } from '@angular/common';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const APP_DATE_FORMATS = {
  parse: {
    dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'numeric'},
    dateA11yLabel: {
      year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: {year: 'numeric', month: 'long'},
  }
};
export const MY_FORMATS2 = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
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
  styleUrls: ['./subscriptions-subscription.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    [DatePipe],
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
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
  ];
  dateChips = [
    'Activation date',
    'Last billing date',
    'Next billing date'
  ];
  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  sendData: any[];
  senddataTo: any;
  showFilter = false;
  dataTocheck: boolean;
  live: boolean;
  notStarted: boolean;
  future: boolean;
  feeCollectionMode: any;
  getDate: any;
  getDate2: string;

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject,
              private eventService: EventService, private subService: SubscriptionService, public enumService: EnumServiceService,private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    // console.log("feeeee...",this.feeCollectionMode);
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
    (value=="billerSettings"|| value=='changePayee')?value:(data.subscriptionPricing.feeTypeId == 1) ? value = 'createSubFixed' : value = 'createSubVariable'
    data.isCreateSub = true;
    const fragmentData = {
      Flag: value,
      data,
      id: 1,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.getSummaryDataAdvisor();
        }
      }
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
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
          this.getSummaryDataAdvisor();
        }
      }
    );

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
      this.showFilter = true;
    } else {
      this.showFilter = false;
    }

  }

  addFilters(addFilters) {
    console.log('addFilters', addFilters);
    if (addFilters == 'LIVE') {
      this.senddataTo = 2;
    } else if (addFilters == 'NOT STARTED') {
      this.senddataTo = 1;
    } else if (addFilters == 'FUTURE') {
      this.senddataTo = 3;
    } else {
      this.senddataTo = 4;
    }
    console.log(this.senddataTo);
    if (!_.includes(this.filterStatus, this.senddataTo)) {
      this.filterStatus.push(this.senddataTo);
    } else {
      _.remove(this.filterStatus, this.senddataTo);
    }
    this.sendData = this.filterStatus;
    
    this.callFilter();
  }

  filterSubscriptionRes(data) {
    console.log('filterSubscriptionRes', data);
    this.getSubSummaryRes(data);
  }

  addFiltersDate(dateFilter) {
    console.log('addFilters', dateFilter);
    this.filterDate.push(dateFilter);
    this.callFilter();
  }

  removeDate(item) {
    this.filterDate.splice(item, 1);
    this.callFilter();
  }

  remove(item) {
    this.filterStatus.splice(item, 1);
    this.callFilter();

  }
  orgValueChange(value){
    console.log(value)
    this.getDate = this.datePipe.transform(value, 'yyyy-MM-dd');
    this.callFilter();

  }
  orgValueChange2(value){
    console.log(value)
    this.getDate2 = this.datePipe.transform(value, 'yyyy-MM-dd');
    this.callFilter();

  }
  callFilter() {
    this.statusIdList = (this.sendData == undefined)? [] : this.sendData;
    const obj = {
      advisorId: this.advisorId,
      limit: 10,
      offset: 0,
      fromDate: this.getDate,
      toDate:  this.getDate2,
      statusIdList: this.statusIdList,
      dateType: 0
    };
    console.log('this.statusIdList', this.statusIdList);
    this.subService.filterSubscription(obj).subscribe(
      data => this.filterSubscriptionRes(data)
    );
  }

  delete(data, value) {
    const Fragmentdata = {
      Flag: data,
      subData: value
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
