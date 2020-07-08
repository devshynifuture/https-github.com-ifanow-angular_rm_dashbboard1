import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FixedFeeComponent } from '../Subscriptions/subscription/common-subscription-component/fixed-fee/fixed-fee.component';
import { VariableFeeComponent } from '../Subscriptions/subscription/common-subscription-component/variable-fee/variable-fee.component';
import { SubscriptionInject } from '../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { BillerSettingsComponent } from '../Subscriptions/subscription/common-subscription-component/biller-settings/biller-settings.component';
import { InvoiceHistoryComponent } from '../Subscriptions/subscription/common-subscription-component/invoice-history/invoice-history.component';
import { ChangePayeeComponent } from '../Subscriptions/subscription/common-subscription-component/change-payee/change-payee.component';
import { DeleteSubscriptionComponent } from '../Subscriptions/subscription/common-subscription-component/delete-subscription/delete-subscription.component';
import { ConfirmDialogComponent } from '../../common-component/confirm-dialog/confirm-dialog.component';
import { BackOfficeService } from '../backOffice/back-office.service';
import { OnlineTransactionService } from '../transactions/online-transaction.service';
import { TransactionEnumService } from '../transactions/transaction-enum.service';
import { DashboardService } from './dashboard.service';
import { FormControl } from '@angular/forms';
import { calendarService } from '../Activities/calendar/calendar.service';
import { EmailServiceService } from '../Email/email-service.service';
import { DatePipe } from '@angular/common';

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  apr: string;
  may: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Gross sales', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },
  { position: 'Redemptions', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },
  { position: 'Net sales', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },

];

export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: 'Rahul Jain', name: 'Extend the account for an', weight: 'Nita Shinde' },
  { position: 'Mohan Kumar', name: 'Re-invest FD to goal', weight: 'Sajith Thilakan' },
  { position: 'Sagar Shah', name: 'Surrender insurance policy', weight: 'Khushboo Sidapara' },
  { position: 'Rahul Jain', name: 'File IT returns through CA', weight: 'Satish Patel' },

];

export interface PeriodicElement3 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Pending', name: '2', weight: '1', symbol: '4' },
  { position: 'Rejections', name: '2', weight: '3', symbol: '2' },


];

export interface PeriodicElement4 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { position: 'Pending', name: '2', weight: '1', symbol: '4' },
  { position: 'Rejections', name: '2', weight: '3', symbol: '2' },


];

export interface PeriodicElement5 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { position: 'Vishnu Khandelwal	', name: 'SIP Rejection', weight: '23/04/2019' },
  {
    position: 'Saniya Kishore Parmar rep by Kishore Babulal Parmar	',
    name: 'Redemption Rejection',
    weight: '23/04/2019'
  },


];

export interface PeriodicElement6 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA6: PeriodicElement6[] = [
  { position: 'Mandira Gangakhedkar	', name: 'Investment Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },
  { position: 'Abhishek Mane	', name: 'Financial Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },
  { position: 'Sagar Shroff	', name: 'Tax Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },


];

export interface PeriodicElement7 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  match: string;
  report: string;

}

const ELEMENT_DATA7: PeriodicElement7[] = [

  { position: 'CAMS	', name: 'INA000004409', weight: 'Today', symbol: 'Aniket Shah', match: '8', report: 'Report' },
  { position: 'Karvy	', name: 'INA000004409', weight: '1 day ago', symbol: 'System', match: '23', report: 'Report' },
  { position: 'FT	', name: 'INA000004409', weight: '10 days ago', symbol: 'Aniket Shah', match: '0', report: 'Report' },
  { position: 'CAMS	', name: 'INA000004409', weight: '2 days ago', symbol: 'System', match: '18', report: 'Report' },


];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  documentSizeData: any = {};
  aumReconList: any;
  aumFlag: boolean;
  goalSummaryData: any = {};
  isKeyMatrix: boolean;
  subOverviewFlag: boolean;
  docOverviewFlag: boolean;

  constructor(
    public dialog: MatDialog, private subService: SubscriptionService,
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private subInjectService: SubscriptionInject,
    private backoffice: BackOfficeService,
    private transactionService: OnlineTransactionService,
    private dashboardService: DashboardService,
    private calenderService: calendarService,
    private emailService: EmailServiceService,
    private utils: UtilService,
    private datePipe: DatePipe
  ) {
    const date = new Date();
    const hourOfDay = date.getHours();
    if (hourOfDay < 12) {
      this.greeting = 'Good morning';
    } else if (hourOfDay < 16) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  advisorId: any;
  dashBoardSummary: {}[];
  isLoadingSubSummary = false;
  feeRecieved: any;
  dataSourceClientWithSub: any;
  greeting: string;
  advisorName: any;
  parentId: any;
  sipCount: any;
  keyMetricJson: any = {
    mfAum: '',
    sipBook: '',
    clientCount: '',
    InvestorCount: ''
  };
  totalSales: any;
  finalStartDate: number;
  finalEndDate: number;
  transactionList: any;
  isRecentTransactionFlag: boolean;
  todoListData = [];
  eventData: any;
  formatedEvent: any[];
  calenderLoader: boolean;
  birthdayAnniList: any;
  connectedToGmail: boolean;
  excessAllow: any;
  dashEvent = true;
  bseData: {}[];
  nscData: {}[];
  last7DaysFlag: boolean;
  displayedDashboardSummary: string[] = ['name', 'service', 'amt', 'billing', 'icons'];
  subscriptionSummaryStatusFilter = '1';
  showInput = false;
  selectedItem = new FormControl();
  updateNote = new FormControl();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'apr', 'may'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['position', 'name', 'weight'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns4: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource4 = ELEMENT_DATA4;
  displayedColumns5: string[] = ['position', 'name', 'weight'];
  dataSource5 = ELEMENT_DATA5;
  displayedColumns6: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource6 = ELEMENT_DATA6;
  displayedColumns7: string[] = ['position', 'name', 'weight', 'symbol', 'match', 'report'];
  dataSource7 = ELEMENT_DATA7;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    this.advisorName = AuthService.getUserInfo().name;
    this.excessAllow = localStorage.getItem('successStoringToken');

    this.getTotalRecivedByDash();
    this.clientWithSubscription();
    this.getSummaryDataDashboard(); // summry dashbord
    // this.sipCountGet();//for getting total sip book
    this.getKeyMetrics(); // for getting total AUM
    this.finalStartDate = UtilService.getStartOfTheDay(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7)).getTime();
    this.finalEndDate = UtilService.getEndOfDay(new Date()).getTime();
    this.getTodoListData();
    this.getRecentTransactionData();
    // this.connectAccountWithGoogle();
    this.getBirthdayOrAnniversary();
    this.getLast7DaysTransactionStatus();
    this.getDocumentTotalSize();
    this.getLastSevenDaysTransactions();
    this.getLatesAumReconciliationData();
    this.getLastSevenDaysInvestmentAccounts();
    this.getGoalSummaryData();
  }

  mailConnect(done) {
    this.excessAllow = done;
  }

  LastSevenDaysInvestmentAccounts: any = [];
  getLastSevenDaysInvestmentAccounts() {
    const obj = {
      "advisorId": this.advisorId,
      "startDate": new Date().getTime(),
      "endDate": new Date(this.lastSevenDays).getTime()
    }

    //       const obj = {
    //     "advisorId":5430,
    //     "startDate":1593369000000,
    //     "endDate":1594060199999
    //  }
    this.dashboardService.getLastSevenDaysInvestmentAccounts(obj).subscribe(
      (data) => {
        if (data) {
          this.LastSevenDaysInvestmentAccounts = data;
        }
        else {
          this.LastSevenDaysInvestmentAccounts = [];
        }
      },
      (err) => {

      });
  }

  LastSevenDaysTransactions: any = [];
  rejectedFAILURE: any = [];
  lastSevenDays: any = new Date().setDate(new Date().getDate() - 7);
  getLastSevenDaysTransactions() {
    const obj = {
      "advisorId": this.advisorId,
      "tpUserCredentialId": null,
      "startDate": new Date().getTime(),
      "endDate": new Date(this.lastSevenDays).getTime()
    }

    //    const obj = {
    //     "advisorId":5430,
    //     "tpUserCredentialId":null,
    //     "startDate":1593369000000,
    //     "endDate":1594060199999
    //  }
    console.log(new Date(obj.startDate), new Date(obj.endDate), "date 123");
    this.dashboardService.getLastSevenDaysTransactions(obj).subscribe(
      (data) => {
        console.log(data, "LastSevenDaysTransactions 123");
        if (data) {
          this.LastSevenDaysTransactions = data;
          this.dataSource5 = this.LastSevenDaysTransactions.filter((x) => {
            x.status == 1 || x.status == 7;
          })
        }
        else {
          this.LastSevenDaysTransactions = [];
          this.dataSource5 = [];
        }
      });
  }

  getSummaryDataDashboard() {
    const obj = {
      advisorId: this.advisorId,
      limit: 9,
      offset: 0,
      dateType: 0,
      statusIdList: [this.subscriptionSummaryStatusFilter],
      fromDate: null,
      toDate: null

    };
    this.dashBoardSummary = [{}, {}, {}];
    this.isLoadingSubSummary = true;
    this.subService.filterSubscription(obj).subscribe(
      data => this.getSubSummaryRes(data), error => {
        this.isLoadingSubSummary = false;
        this.dataSource = [];

      }
    );
  }

  getTodoListData() {
    const obj = {
      advisorId: this.advisorId
    };
    this.dashboardService.getNotes(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          data.forEach(element => {
            element.update = false;
            if (this.calculateDifferenc(element.createdOn) <= 1) {
              element.createdDate = this.calculateDifferenc(element.createdOn);
            } else {
              element.createdDate = this.datePipe.transform(element.createdOn, 'MMMM d, y');
            }
          });
          // data.forEach(element => {
          // });
          this.todoListData = data;
          // this.todoListData=this.todoListData.sort((a,b)=>a.due - b.due);
        }
      }
    );
  }

  addTodoList(value) {
    const obj = {
      id: 0,
      advisorId: this.advisorId,
      activityName: value
    };
    this.dashboardService.addNotes(obj).subscribe(
      data => {
        if (data) {
          this.eventService.openSnackBar('To-Do note is added', 'Dismiss');
          this.showInput = false;
          data.forEach(element => {
            element.update = false;
            this.selectedItem.reset();
            if (this.calculateDifferenc(element.createdOn) <= 1) {
              element.createdDate = this.calculateDifferenc(element.createdOn);
            } else {
              element.createdDate = this.datePipe.transform(element.createdOn, 'MMMM d, y');
            }
          });
          this.todoListData = data;
          // this.todoListData.unshift(data);
        }
      }
    );
  }

  doubleClick(value) {
    value.update = true;
    this.updateNote.setValue(value.activityName);
  }

  focusOutFunction(value) {
    value.update = false;
  }

  updateTodoList(todoData) {
    const obj = {
      id: todoData.id,
      advisorId: this.advisorId,
      activityName: this.updateNote.value
    };
    this.dashboardService.updateNotes(obj).subscribe(
      data => {
        if (data) {
          this.eventService.openSnackBar('To-Do note is updated', 'Dismiss');
          this.showInput = false;
          data.forEach(element => {
            element.update = false;
            this.selectedItem.reset();
            if (this.calculateDifferenc(element.createdOn) <= 1) {
              element.createdDate = this.calculateDifferenc(element.createdOn);
            } else {
              element.createdDate = this.datePipe.transform(element.createdOn, 'MMMM d, y');
            }
          });
          this.todoListData = data;
        }
      }), err => this.eventService.openSnackBar(err, 'Dismiss');
  }

  deleteTodoList(value, index) {
    this.dashboardService.deleteNotes(value.id).subscribe(
      data => {
        // if (data) {
        this.todoListData.splice(index, 1);
        // }
      }), err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      };
  }

  getBirthdayOrAnniversary() {
    const toDate = new Date();
    toDate.setDate(new Date().getDate() + 7);
    const obj = {
      advisorId: this.advisorId,
      fromDate: new Date().getTime(),
      toDate: toDate.getTime()
    };
    this.dashboardService.getBirthdayOrAnniversary(obj).subscribe(
      data => {
        if (data) {
          data.forEach(element => {
            if (element.displayName.length > 15) {
              element['shortName'] = element.displayName.substr(0, element.name.indexOf(' '));
            }
            if (element.dateOfBirth && element.dateOfBirth != 0) {
              element.daysToGo = this.calculateBirthdayOrAnniversary(element.dateOfBirth);
            } else {
              element.daysToGo = 'N/A';
            }
          });
          this.utils.calculateAgeFromCurrentDate(data);
          this.birthdayAnniList = data;
          console.log(this.birthdayAnniList);
        }
      }
    );
  }

  calculateBirthdayOrAnniversary(date) {
    let today, bday, diff, days;
    today = new Date().getDate();
    bday = new Date(date).getDate();
    days = bday - today;
    return days;
  }

  calculateDifferenc(createdDate) {
    const date1 = new Date(createdDate);
    const date2 = new Date();
    const diffDays = Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    console.log(Math.round(diffDays));
    return Math.round(diffDays);
  }

  getLast7DaysTransactionStatus() {
    this.last7DaysFlag = true;
    this.nscData = [{}, {}];
    this.bseData = [{}, {}];
    const obj = {
      advisorId: this.advisorId
    };
    this.dashboardService.last7DaysTransactionStatus(obj).subscribe(
      data => {
        if (data) {
          this.last7DaysFlag = false;
          this.nscData = data.nse;
          this.bseData = data.bse;
        }
        else {
          this.last7DaysFlag = false;
          this.nscData = [{}, {}];
          this.bseData = [{}, {}];
        }
      }, err => {
        this.last7DaysFlag = false;
        this.nscData = [{}, {}];
        this.bseData = [{}, {}];
      }
    );
  }

  getDocumentTotalSize() {
    this.docOverviewFlag = true;
    const obj = {
      advisorId: this.advisorId,
      // clientId
    }
    this.dashboardService.getDocumentTotalSize(obj).subscribe(
      data => {
        if (data) {
          this.docOverviewFlag = false;
          this.documentSizeData = data;
        }
      }
    )
  }

  getLatesAumReconciliationData() {
    this.aumReconList = [{}, {}, {}];
    this.aumFlag = true;
    const obj =
    {
      id: this.advisorId
    }
    this.dashboardService.getLatestAumReconciliation(obj).subscribe(
      data => {
        if (data) {
          this.aumFlag = false;
          this.aumReconList = data;
        }
        else {
          this.aumFlag = false;
          this.aumReconList = []
        }
      }, err => {
        this.aumFlag = false;
        this.aumReconList = []
      }
    )
  }

  getGoalSummaryData() {
    const obj = {
      advisorId: this.advisorId
    }
    this.dashboardService.getGoalSummarydata(obj).subscribe(
      data => {
        if (data) {
          this.goalSummaryData = data;
        } else {

        }
      }, err => {

      }
    )
  }

  connectAccountWithGoogle() {
    this.calenderLoader = true;
    this.emailService.getProfile().subscribe(res => {
      if (res) {
        this.connectedToGmail = true;
        this.calenderLoader = false;
        localStorage.setItem('googleOAuthToken', 'oauthtoken');
        localStorage.setItem('successStoringToken', 'true');
        localStorage.setItem('associatedGoogleEmailId', AuthService.getUserInfo().userName);
        this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute });
        this.getEvent();
      } else {
        this.calenderLoader = false;
        this.connectedToGmail = false;
        // this.eventService.ope(res, 'DISMISS');
      }
    }, err => {
      this.calenderLoader = false;
      this.connectedToGmail = false;
      // this.eventService.openSnackBarNoDuration(err, 'DISMISS');
    });
  }

  getEvent() {
    const eventData = {
      calendarId: AuthService.getUserInfo().userName,
      userId: AuthService.getUserInfo().advisorId
    };
    this.calenderService.getEvent(eventData).subscribe((data) => {

      if (data != undefined) {

        this.eventData = data;

        console.log(data, 'events calender', this.eventData);
        this.formatedEvent = [];

        for (const e of this.eventData) {
          if (e.start) {
            e.day = this.formateDate(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.month = this.formateMonth(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.year = this.formateYear(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.startTime = this.formateTime(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.endTime = this.formateTime(!e.end.dateTime ? new Date(e.created) : new Date(e.end.dateTime));
            this.formatedEvent.push(e);
            // console.log(this.formatedEvent,"formatedEvent calender1",);
          }
        }
      }
    });


  }


  formateDate(date) {
    const dd = new Date(date).getDate();

    return dd;
  }

  formateMonth(date) {
    const mm = new Date(date).getMonth() + 1; // January is 0!
    return mm;
  }

  formateYear(date) {
    const yyyy = new Date(date).getFullYear();
    return yyyy;
  }

  formateTime(date) {

    let hh = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    let mm = date.getMinutes();
    const amPm = date.getHours() > 12 ? 'pm' : 'am';
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    return hh + ':' + mm + amPm + ' ';
  }

  getRecentTransactionData() {
    this.isRecentTransactionFlag = true;
    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: null,
      startDate: this.finalStartDate,
      endDate: this.finalEndDate
    };
    this.transactionService.getSearchScheme(obj).subscribe(
      data => {
        if (data) {
          this.isRecentTransactionFlag = false;
          this.transactionList = data;
          this.transactionList = TransactionEnumService.setPlatformEnum(data);
          this.transactionList = TransactionEnumService.setTransactionStatus(data);
        }
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismefault/stockfeediss');
      }
    );
  }

  changeParentsTab(selectedTab) {
    this.eventService.tabData(selectedTab);
    if (selectedTab === 3) {
      this.router.navigate(['/admin/subscription/subscriptions']);

    } else if (selectedTab === 5) {
      this.router.navigate(['/admin/subscription/invoices']);
    }
  }

  getSubSummaryRes(data) {
    this.isLoadingSubSummary = false;
    // data.forEach(element => {
    //   element.feeMode = (element.feeMode == 1) ? 'FIXED' : 'VARIABLE';
    //   element.startsOn = (element.status == 1) ? 'START' : element.startsOn;
    //   element.status = (element.status == 1) ? 'NOT STARTED' : (element.status == 2) ?
    //   'LIVE' : (element.status == 3) ? 'FUTURE' : 'CANCELLED';
    // });
    if (data) {
      this.dashBoardSummary = data;
    } else {
      this.dashBoardSummary = [];
    }
  }

  Open(data) {
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
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openPlanSlider(value, state, data) {
    let componentName;
    // if (this.isLoading) {
    //   return
    // }
    (value == 'billerSettings') ? componentName = BillerSettingsComponent : (value == 'changePayee') ? componentName = ChangePayeeComponent :
      (value == 'SUBSCRIPTIONS') ? componentName = InvoiceHistoryComponent : (data.subscriptionPricing.feeTypeId == 1) ?
        value = 'createSubFixed' : value = 'createSubVariable';
    data.isCreateSub = false;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  delete(data) {
    const Fragmentdata = {
      flag: data,
    };
    if (data === 'cancelSubscription') {
      const dialogRef = this.dialog.open(DeleteSubscriptionComponent, {
        width: '400px',
        // height:'40%',
        data: Fragmentdata,
        autoFocus: false,
      });
      /*dialogRef.afterClosed().subscribe(result => {
      });*/
    }
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone.',
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

  getTotalRecivedByDash() {
    // this.isLoading = true;
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    const obj = {
      advisorId: this.advisorId,
      fromDate: UtilService.getStartOfTheDay(beginDate).getTime(),
      toDate: UtilService.getEndOfDay(new Date()).getTime()
    };
    this.subService.getTotalRecived(obj).subscribe(
      data => {
        this.totalSales = data != undefined ? data.totalSales : '0';
        this.feeRecieved = data != undefined ? data.feeRecieved : '0';
      }
    );
  }

  clientWithSubscription() {
    this.subOverviewFlag = true;
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.clientWithSubcribe(obj).subscribe(
      data => {
        if (data) {
          this.subOverviewFlag = false;
          this.dataSourceClientWithSub = data;
        } else {
          this.dataSourceClientWithSub = {};
        }
      }
    );
  }

  sipCountGet() {
    const obj = {
      advisorId: (this.parentId) ? 0 : [this.advisorId],
      arnRiaDetailsId: -1,
      parentId: this.parentId
    };
    this.backoffice.getSipcountGet(obj).subscribe(
      data => {
        this.sipCount = data.totalAmountInWords;
      },
      err => {
        this.sipCount = '';
      }
    );
  }

  getKeyMetrics() {
    this.isKeyMatrix = true;
    const obj = {
      id: this.advisorId
    };
    this.dashboardService.getKeyMetrics(obj).subscribe(
      data => {
        this.isKeyMatrix = false
        this.keyMetricJson = data;
      },
      err => {
        this.keyMetricJson = '';
      }
    );
  }

  openGuideDialog(): void {
    const dialogRef = this.dialog.open(DashboardGuideDialogComponent, {
      maxWidth: '100vw',
      width: '90vw',
      height: '90vh',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
