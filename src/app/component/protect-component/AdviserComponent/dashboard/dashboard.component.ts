import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  { position: 'Saniya Kishore Parmar rep by Kishore Babulal Parmar	', name: 'Redemption Rejection', weight: '23/04/2019' },



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
  advisorId: any;
  dashBoardSummary: {}[];
  isLoadingSubSummary = false;
  feeRecieved: any;
  dataSourceClientWithSub: any;
  greeting: string;
  advisorName: any;
  parentId: any;
  sipCount: any;
  MiscData1: any;
  totalSales: any;

  constructor(
    public dialog: MatDialog, private subService: SubscriptionService, private eventService: EventService, private router: Router, private activatedRoute: ActivatedRoute, private subInjectService: SubscriptionInject, private backoffice: BackOfficeService
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
  displayedDashboardSummary: string[] = ['name', 'service', 'amt', 'billing', 'icons'];
  subscriptionSummaryStatusFilter = '1';

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
    this.advisorName = AuthService.getUserInfo().name;
    this.getTotalRecivedByDash();
    this.clientWithSubscription();
    this.getSummaryDataDashboard();//summry dashbord
    this.sipCountGet();//for getting total sip book
    this.getMisData(); // for getting total AUM


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
      (value == "SUBSCRIPTIONS") ? componentName = InvoiceHistoryComponent : (data.subscriptionPricing.feeTypeId == 1) ?
        value = 'createSubFixed' : value = 'createSubVariable';
    data.isCreateSub = false;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: componentName
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
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.clientWithSubcribe(obj).subscribe(
      data => {
        if (data)
          this.dataSourceClientWithSub = data;
        else
          this.dataSourceClientWithSub = {};
      }
    );
  }
  sipCountGet() {
    const obj = {
      advisorId: (this.parentId) ? 0 : [this.advisorId],
      arnRiaDetailsId: -1,
      parentId: this.parentId
    }
    this.backoffice.getSipcountGet(obj).subscribe(
      data => {
        this.sipCount = data.totalAmountInWords;
      },
      err => {
        this.sipCount = '';
      }
    )
  }
  getMisData() {
    // const obj = {
    //   advisorId:(this.parentId) ? 0 : (this.arnRiaValue!=-1) ? 0 :[this.adminAdvisorIds],
    //   arnRiaDetailsId: this.arnRiaValue,
    //   parentId: this.parentId
    // }
    this.backoffice.getMisData(this.advisorId).subscribe(
      data => {
        this.MiscData1 = data;
      },
      err => {
        this.MiscData1 = '';
      }
    )
  }
  openGuideDialog(): void {
    const dialogRef = this.dialog.open(DashboardGuideDialogComponent, {
      width: '99%',
      height: '595px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
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
}