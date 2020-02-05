import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DeleteSubscriptionComponent } from '../common-subscription-component/delete-subscription/delete-subscription.component';
import { SubscriptionService } from '../../subscription.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../../../../auth-service/authService';
import { EnumServiceService } from '../../../../../../services/enum-service.service';
import { UtilService } from '../../../../../../services/util.service';
import { DatePipe } from '@angular/common';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FixedFeeComponent } from '../common-subscription-component/fixed-fee/fixed-fee.component';
import { VariableFeeComponent } from '../common-subscription-component/variable-fee/variable-fee.component';
import { CreateSubscriptionComponent } from '../common-subscription-component/create-subscription/create-subscription.component';
import { BillerSettingsComponent } from '../common-subscription-component/biller-settings/biller-settings.component';
import { InvoiceHistoryComponent } from '../common-subscription-component/invoice-history/invoice-history.component';
import { ChangePayeeComponent } from '../common-subscription-component/change-payee/change-payee.component';
import { ErrPageOpenComponent } from 'src/app/component/protect-component/customers/component/common-component/err-page-open/err-page-open.component';
import { SubscriptionDataService } from '../../subscription-data.service';
import { SubscriptionDetailsComponent } from '../common-subscription-component/biller-profile-advisor/subscription-details/subscription-details.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

// declare var window
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'LL',
//   },
//   display: {
//     dateInput: 'LL',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
// export const APP_DATE_FORMATS = {
//   parse: {
//     dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
//   },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: {year: 'numeric', month: 'numeric'},
//     dateA11yLabel: {
//       year: 'numeric', month: 'long', day: 'numeric'
//     },
//     monthYearA11yLabel: {year: 'numeric', month: 'long'},
//   }
// };


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
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})

export class SubscriptionsSubscriptionComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  selector = '.wrapper-20';
  displayedColumns: string[] = ['client', 'service', 'amt', 'sub', 'status', 'activation',
    'lastbilling', 'nextbilling', 'feemode', 'icons'];

  // subscriptionValue: any;
  @Input() upperData;
  advisorId;
  lastFilterDataId;
  Oposition;
  maxDate = new Date();
  getData: any = '';
  filterDataArr = [];
  isFilter: boolean = false;
  // DataToSend;
  scrollCallData = true;
  isLoading = false;
  isFirstCall=true
  chips = [
    { name: 'LIVE', value: 2 },
    { name: 'FUTURE', value: 3 },
    { name: 'NOT STARTED', value: 1 },
    { name: 'CANCELLED', value: 4 }
  ];
  dateChips = [
    { name: 'Activation date', value: 1 },
    { name: 'Last billing date', value: 2 },
    { name: 'Next billing date', value: 3 }
  ];
  passFilterData = {
    data: "",
    selectedCount: "",
    statusFilter: this.chips,
    dateFilter: this.dateChips
  };
  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  // sendData: any[];
  // senddataTo: any;
  showFilter = false;
  selectedStatusFilter: any = 'status';
  selectedDateFilter: any = 'selected';
  // selectedDateFilter;
  dataTocheck: boolean;
  live: boolean;
  notStarted: boolean;
  future: boolean;
  feeCollectionMode: any;
  getDate: any;
  getDate2: string;
  selectedDateRange = { begin: new Date(), end: new Date() };
  noData: string;
  scrollLoad = false;
  lastDataId;
  statusIdLength = 0;
  tableData = [];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);

  scrollPosition;

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject,
    private eventService: EventService, private subService: SubscriptionService,
    public enumService: EnumServiceService, private datePipe: DatePipe, private utilservice: UtilService) {
  }


  ngOnInit() {
    // this.data = [{}, {}, {}];

    this.advisorId = AuthService.getAdvisorId();
    this.feeCollectionMode = this.enumService.getFeeCollectionModeData();
    // console.log("feeeee...",this.feeCollectionMode);
    if (this.utilservice.checkSubscriptionastepData(3) == undefined) {
      this.dataSource.data = [{}, {}, {}]
    }
    else {
      (this.utilservice.checkSubscriptionastepData(3) == false) ? this.dataSource.data = [] : this.dataSource.data = [{}, {}, {}]
    }
    this.getClientSubData(this.scrollLoad,this.isFirstCall);
    console.log('upperData', this.upperData);

  }

  getClientSubData(boolean,firstLoad) {
    this.dataSource.data = [{}, {}, {}]
    this.getSummaryDataAdvisor(boolean,firstLoad).subscribe(
      data => {
        this.getData = data;
        if (data != undefined) {
          this.lastDataId = data[data.length - 1].id;
          // obj.offset = this.lastDataId;
          // console.log(this.lastDataId, obj, "data check");
          if (this.tableData.length <= 0) {
            this.tableData = data;
          } else {
            this.tableData = this.tableData.concat(data);
            console.log(this.tableData, 'this.tableData 123');
          }
        } else {
          this.isLoading = false;
          // getSubSummarySubscription.unsubscribe();
        }
        this.getSubSummaryRes(this.tableData);

      }, (error) => {
        this.errorMessage();
        // this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    )
  }
  errorMessage() {
    const fragmentData = {
      flag: 'app-err-page-open',
      data: {},
      id: 1,
      // data,
      direction: 'top',
      componentName: ErrPageOpenComponent,
      state: 'open',
    };
    fragmentData.data = {
      positiveMethod: (barButtonOption: MatProgressButtonOptions) => {
        barButtonOption.active = true;
        this.isFirstCall=false;
        this.getSummaryDataAdvisor(false,this.isFirstCall).subscribe(
          data => {
            barButtonOption.active = false;
            this.getData = data;
            if (data != undefined) {
              if(this.isFirstCall==false){
                this.lastDataId=0;
              }else{
                this.lastDataId = data[data.length - 1].id;
              }
              // obj.offset = this.lastDataId;
              // console.log(this.lastDataId, obj, "data check");
              if (this.tableData.length <= 0) {
                this.tableData = data;
              } else {
                this.tableData = this.tableData.concat(data);
                console.log(this.tableData, 'this.tableData 123');
              }
            } else {
              this.isLoading = false;
              // getSubSummarySubscription.unsubscribe();
            }
            this.eventService.changeUpperSliderState({ state: 'close' })
            this.getSubSummaryRes(this.tableData);
            // this.eventService.openSnackBar('Wait sometime....', 'dismiss');
            // this.errorMessage();
          }, (error) => {
            barButtonOption.active = false;
            this.eventService.openSnackBar('Wait sometime....', 'dismiss');
          }
        )
      },
    }
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // subscription.unsubscribe();
        }
      }
    );
  }
  scrollCall(scrollLoader) {
    const uisubs = document.getElementById('ui-subs');
    const wrapper = document.getElementById('wrapper');

    const contentheight = wrapper.offsetHeight;
    const yoffset = uisubs.scrollTop;
    const y = yoffset + window.innerHeight;
    // console.log(y >= contentheight && this.getData != undefined && this.scrollCallData, this.scrollCallData, "this.scrollCallData 123");
    console.log(this.getData != undefined, this.scrollCallData, '|| this.statusIdList.length > 0');

    if ((y >= contentheight && this.getData != undefined && this.scrollCallData)) {
      this.scrollCallData = false;
      if (this.scrollPosition == undefined) {
        this.scrollPosition = contentheight - yoffset;
      } else if (this.scrollPosition < contentheight) {
        this.scrollPosition = contentheight - window.innerHeight;
      }

      console.log(this.scrollPosition, 'this.scrollPosition 123');


      if (this.statusIdList.length <= 0) {

        this.getClientSubData(scrollLoader,false);
      } else {
        this.callFilter(scrollLoader);
      }

    }
  }


  getSummaryDataAdvisor(scrollLoader,isFirstCall) {
    if(isFirstCall!=true){
      this.lastDataId=0;
    }
    const obj = {
      advisorId: this.advisorId,
      clientId: 0,
      flag: 0,
      dateType: 0,
      limit: -1,
      offset: this.lastDataId > 0 ? this.lastDataId : 0,
      order: 0,
    };

    if (!scrollLoader) {
      this.isLoading = true;
    }

   return this.subService.getSubSummary(obj);
  }


  getSubSummaryRes(data) {
    const uisubs = document.getElementById('ui-subs');
    this.isLoading = false;
    console.log('  aaa: ', data);

    if (data && data.length > 0) {
      this.data = data;

      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      uisubs.scrollTo(0, this.scrollPosition);
      console.log(uisubs.scrollTop, this.scrollPosition, 'this.yoffset');

      this.scrollCallData = true;
      // this.DataToSend = data;
    } else {
      this.data = [];
      this.dataSource.data = data;
      // console.log(data);
      this.dataSource.data = [];
      this.noData = 'No Data Found';
    }
  }

  getFiterRes(data) {
    console.log(data, "data for filter");
    this.filterStatus = data.statusFilterJson;
    this.filterDate = data.dateFilterArr;
    this.selectedDateRange = data.dateFilterJson;
    this.lastFilterDataId = 0;
    this.filterDataArr = [];
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.isFilter = true;
    this.callFilter(false);
  }

  openPlanSlider(value, state, data) {
    if (this.isLoading) {
      return;
    }
    let component;
    if (data) {
      if (value == 'billerSettings' || value == 'changePayee' || value == null || value == 'subscriptionDetails') {
        (value == 'billerSettings') ? component = BillerSettingsComponent : (value == 'changePayee') ? component = ChangePayeeComponent : component = SubscriptionDetailsComponent;
      } else if (data.subscriptionPricing.feeTypeId == 1) {
        value = 'createSubFixed';
        component = CreateSubscriptionComponent
        data.subFlag = 'createSubFixed';
      } else {
        value = 'createSubVariable';
        component = CreateSubscriptionComponent
        data.subFlag = 'createSubVariable';
      }
      data.isCreateSub = false;
      data.isSaveBtn = false;
    }
    // else {
    //   component = PlanRightsliderComponent;
    // }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    console.log(fragmentData,  "fragmentData json");
    
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getClientSubData(false, false);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
    // this.subInjectService.pushUpperData(data)
  }

  getFeeTypeName(ch) {
    let feeModeName = '';
    switch (ch) {
      case 1:
        feeModeName = 'Cheque';
        break;
      case 2:
        feeModeName = 'NEFT';
        break;
      case 3:
        feeModeName = 'Cash';
        break;
      case 4:
        feeModeName = 'ECS mandate';
        break;
      case 5:
        feeModeName = 'Bank Transfer';
        break;
      case 6:
        feeModeName = 'Debit Card';
        break;
      case 7:
        feeModeName = 'Credit Card';
        break;
      case 8:
        feeModeName = 'NACH Mandate';
        break;
      default:
        feeModeName = '';
    }

    return feeModeName;
  }

  Open(state, data) {
    let feeMode;
    let component;
    data.isCreateSub = true;
    (data.subscriptionPricing.feeTypeId == 1) ? feeMode = 'fixedModifyFees' : feeMode = 'variableModifyFees';
    (data.subscriptionPricing.feeTypeId == 1) ? component = FixedFeeComponent : component = VariableFeeComponent
    const fragmentData = {
      flag: feeMode,
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', UtilService.isRefreshRequired(sideBarData));
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getClientSubData(false,false);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openFeeEditor(data) {
    let feeMode;
    data.isCreateSub = true;
    (data.subscriptionPricing.feeTypeId == 1) ? feeMode = FixedFeeComponent : feeMode = VariableFeeComponent;
    const fragmentData = {
      // flag: feeMode,
      data,
      id: 1,
      state: 'open',
      componentName: feeMode
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getClientSubData(false,false);
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );

  }

  deleteModal(value, subData) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        const obj = {
          advisorId: this.advisorId,
          id: subData.id
        };
        this.subService.deleteSubscriptionData(obj).subscribe(
          data => {
            this.deletedData(data);
            dialogRef.close(subData);
          }
        );

      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        console.log(result, this.dataSource.data, 'delete result');
        const tempList = [];
        this.dataSource.data.forEach(singleElement => {
          if (singleElement.id != result.id) {
            tempList.push(singleElement);
          }
        });
        this.dataSource.data = tempList;
      }
    });
  }

  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
    console.log('this.filterStatus: ', this.filterStatus);
    console.log('this.filterDate: ', this.filterDate);

  }

  addFilters(addFilters) {

    console.log('addFilters', addFilters);
    // !_.includes(this.filterStatus, addFilters)
    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      this.lastFilterDataId = 0;
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
      console.log(this.filterStatus);
    } else {
      this.lastFilterDataId = 0;
      // _.remove(this.filterStatus, this.senddataTo);
    }

    console.log(this.filterStatus, 'this.filterStatus 123');

    this.callFilter(false);
  }


  filterSubscriptionRes(data, scrollLoader) {
    this.isLoading = false;

    console.log('filterSubscriptionRes', data);
    if (data == undefined && this.statusIdLength < 1) {
      this.noData = 'No Data Found';
      if (!scrollLoader) {
        this.dataSource.data = [];
      } else {
        this.dataSource.data = this.filterDataArr;
      }
    } else {
      console.log(this.statusIdList.length, this.statusIdLength < this.statusIdList.length, this.statusIdLength, 'this.statusIdList.length123');
      // if(this.statusIdLength < this.statusIdList.length || this.statusIdList.length <= 0){
      //   this.statusIdLength = this.statusIdList.length;
      //   this.lastFilterDataId = 0;
      // }else{

      this.lastFilterDataId = data[data.length - 1].id;
      // }
      console.log(this.lastFilterDataId, 'this.lastFilterDataId');
      if (this.filterDataArr.length <= 0) {
        this.filterDataArr = data;
      } else {
        this.filterDataArr = this.filterDataArr.concat(data);
        console.log(this.filterDataArr, 'this.filterDataArr 123');
      }
      this.scrollCallData = true;

      this.dataSource.data = this.filterDataArr;
    }
    // this.getSubSummaryRes(data);
  }

  addFiltersDate(dateFilter) {
    this.filterDate = [];
    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDataArr = [];
    this.lastFilterDataId = 0;
    this.filterDate.push((dateFilter == '1: Object') ? 1 : (dateFilter == '2: Object') ? 2 : 3);
    console.log('addFilters', dateFilter);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
    console.log(this.filterDate, 'this.filterDate 123');
    this.callFilter(false);
  }

  removeDate(item) {
    console.log(this.filterDate, 'this.filterDate 123 r');
    this.selectedDateFilter = 'selected';
    this.filterDate.splice(item, 1);
    this.lastFilterDataId = 0;
    this.callFilter(false);
  }

  remove(item) {
    if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
      this.selectedStatusFilter = 'status';
    }

    this.filterStatus.splice(item, 1);
    this.filterDataArr = this.filterDataArr.filter((x) => {
      x.status != item.value;
    });
    this.lastFilterDataId = 0;
    this.callFilter(false);

  }

  orgValueChange(selectedDateRange) {
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);
    this.selectedDateRange = { begin: selectedDateRange.begin, end: selectedDateRange.end };
    this.callFilter(false);
  }

  orgValueChange2(value) {
    console.log(value);
    this.getDate2 = this.datePipe.transform(value, 'yyyy-MM-dd');
    this.callFilter(false);

  }

  callFilter(scrollLoader) {
    if (this.filterStatus && this.filterStatus.length > 0) {
      this.statusIdList = [];
      this.dataSource.data = [{}, {}, {}];
      this.isLoading = true;
      this.filterStatus.forEach(singleFilter => {
        this.statusIdList.push(singleFilter.value);
        console.log(this.statusIdList, 'this.statusIdList 1233');
      });
    } else {
      this.statusIdList = [];
    }
    // this.statusIdList = (this.sendData == undefined) ? [] : this.sendData;
    console.log(this.lastFilterDataId, this.statusIdLength < this.statusIdList.length, 'aaaa');
    const obj = {
      advisorId: this.advisorId,
      limit: -1,
      offset: this.lastFilterDataId,
      fromDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.begin, 'yyyy-MM-dd') : null,
      toDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') : null,
      statusIdList: this.statusIdList,
      dateType: (this.filterDate.length == 0) ? 0 : this.filterDate,
    };
    console.log('this.callFilter req obj : ', obj, this.statusIdList);
    if (obj.statusIdList.length == 0 && obj.fromDate == null) {
      this.getClientSubData(false,false);
    } else {
      this.subService.filterSubscription(obj).subscribe(
        (data) => {
          this.filterSubscriptionRes(data, scrollLoader);
        }
      );
    }
  }

  delete(data, value) {
    const Fragmentdata = {
      flag: data,
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

  deletedData(data) {
    if (data) {
      this.eventService.changeUpperSliderState({ state: 'close' });
      this.eventService.openSnackBar('Deleted successfully!', 'dismiss');
    }
  }
}
