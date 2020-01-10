import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubscriptionInject } from '../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog } from '@angular/material';
import { DeleteSubscriptionComponent } from '../common-subscription-component/delete-subscription/delete-subscription.component';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SubscriptionService } from '../../subscription.service';
import { EnumServiceService } from '../../../../../../services/enum-service.service';
import { UtilService } from '../../../../../../services/util.service';
import { AuthService } from '../../../../../../auth-service/authService';
import { Chart } from 'angular-highcharts';
import { VariableFeeComponent } from '../common-subscription-component/variable-fee/variable-fee.component';
import { FixedFeeComponent } from '../common-subscription-component/fixed-fee/fixed-fee.component';
import { BillerSettingsComponent } from '../common-subscription-component/biller-settings/biller-settings.component';
import { ChangePayeeComponent } from '../common-subscription-component/change-payee/change-payee.component';
import { InvoiceHistoryComponent } from '../common-subscription-component/invoice-history/invoice-history.component';

export interface PeriodicElement {
  name: string;
  service: string;
  amt: string;
  billing: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Abhishek Mane', service: 'Financial Planning', amt: 'Rs.1,00,000/Q', billing: '25/08/2019' },
  { name: 'Ronak Hasmuk Hindocha', service: 'Investment management', amt: 'View Details', billing: '-' },
  { name: 'Aman Jain', service: 'AUM Linked fee', amt: 'View Details', billing: '-' },

];


@Component({
  selector: 'app-dashboard-subscription',
  templateUrl: './dashboard-subscription.component.html',
  styleUrls: ['./dashboard-subscription.component.scss']
})
export class DashboardSubscriptionComponent implements OnInit {
  invoiceHisData: any;
  showLetsBeginData: any;
  totalSaleReceived: any;
  dataSource = [{}, {}, {}];
  isLoading = false;
  isLoadingSubSummary = false;
  isLoadingTotal = false;
  isLoadingFee = false;
  isLoadingDocsSent = false;
  isLoadingDocsSigned = false;
  @Output() subIndex = new EventEmitter()

  advisorName;
  greeting;
  // advisorId = 400;
  advisorId;
  dataSourceSingCount;
  dataSourceClientWithSub: any = {};
  dataSourceInvoice;
  subSummaryData;
  showSubStep = false;
  displayedColumns: string[] = ['name', 'service', 'amt', 'billing', 'icons'];
  chart: Chart;
  subscriptionSummaryStatusFilter = '1';
  showLetsBegin = false;
  feeRecieved: any;
  totalSales: any;

  constructor(private enumService: EnumServiceService,
    public subInjectService: SubscriptionInject,
    public eventService: EventService,
    public dialog: MatDialog,
    private subService: SubscriptionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    const date = new Date();
    const hourOfDay = date.getHours();
    console.log('DashboardSubscriptionComponent constructor hourOfDay : ', hourOfDay);
    if (hourOfDay < 12) {
      this.greeting = 'Good morning';
    } else if (hourOfDay < 16) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }

  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.advisorName = AuthService.getUserInfo().fullName;
    this.initChart();
    this.getDashboardResponse();
    this.docSentSignedCountData();
    this.clientWithSubscription();
    this.invoiceToBeReviewed();
    this.getSummaryDataDashboard();
    this.getTotalRecivedByDash();
  }

  getIndex(index) {
    console.log(index)
    this.subIndex.emit(index)
    // this.selected=index
  }

  display(data) {
    this.showSubStep = false;
  }

  getDashboardResponse() {

    this.subService.getDashboardSubscriptionResponse(this.advisorId).subscribe(
      data => {
        this.showLetsBegin = data.show;
        this.showLetsBeginData = data.advisorAccomplishedSubscriptionFinalList;
      }
    );
  }

  initChart() {
    const chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Linechart'
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Line 1',
        data: [1, 2, 3],
        type: 'line'

      }]
    });
    chart.addPoint(4);
    this.chart = chart;
    chart.addPoint(5);

    chart.ref$.subscribe((chartView) => {
      setTimeout(() => {
        chartView.reflow();
        chart.addPoint(6);
      }, 100);
    });
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
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  // || value == 'changePayee' || value == 'SUBSCRIPTIONS'
  openPlanSlider(value, state, data) {
    let componentName;
    if (this.isLoading) {
      return
    }
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
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getTotalRecivedByDash() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      period: 0
    };
    this.subService.getTotalRecived(obj).subscribe(
      data => this.getTotalRecivedRes(data)
    );
  }

  getTotalRecivedRes(data) {
    this.isLoading = false;
    console.log('getTotalRecivedRes', data);
    this.totalSaleReceived = data;
    this.totalSales = (data == 200) ? data.totalSales : '0';
    this.feeRecieved = (data == 304) ? data.feeRecieved : '0';
  }

  showSubscriptionSteps() {
    this.showSubStep = true;
  }

  changeParentsTab(selectedTab) {
    console.log("this is selected Tab:::::::::::::", selectedTab);
    this.eventService.tabData(selectedTab);
    if (selectedTab === 3) {
      this.router.navigate(['../subscriptions'], { relativeTo: this.activatedRoute });

    } else if (selectedTab === 5) {
      this.router.navigate(['../invoices'], { relativeTo: this.activatedRoute });
    }
  }

  delete(data) {
    const Fragmentdata = {
      flag: data,
    };
    if (data === 'cancelSubscription') {
      const dialogRef = this.dialog.open(DeleteSubscriptionComponent, {
        width: '20%',
        // height:'40%',
        data: Fragmentdata,
        autoFocus: false,
      });
      /*dialogRef.afterClosed().subscribe(result => {
      });*/
    }
  }

  // ******* Dashboard Subscription Summary *******
  getSummaryDataDashboard() {
    /* const obj = {
       // 'id':2735, //pass here advisor id for Invoice advisor
       // 'module':1,
       // advisorId: 12345,
       advisorId: this.advisorId,

       clientId: 0,
       flag: 1,
       dateType: 0,
       limit: 10,
       offset: 0,
       order: 0,
     };
     this.subService.getSubSummary(obj).subscribe(
       data => {
         this.getSubSummaryRes(data);
       }
     );*/
    console.log('filterSubscription this.subscriptionSummaryStatusFilter ', this.subscriptionSummaryStatusFilter);

    const obj = {
      advisorId: this.advisorId,
      limit: 3,
      offset: 0,
      dateType: 0,
      statusIdList: [this.subscriptionSummaryStatusFilter],
      fromDate: null,
      toDate: null

    };
    console.log('filterSubscription this.subscriptionSummaryStatusFilter ', this.subscriptionSummaryStatusFilter);
    this.dataSource = [{}, {}, {}];
    console.log('filterSubscription reqObj ', obj);
    this.isLoadingSubSummary = true;
    this.subService.filterSubscription(obj).subscribe(
      data => this.getSubSummaryRes(data), error => {
        this.isLoadingSubSummary = false;
        this.dataSource = [];

      }
    );
  }

  getSubSummaryRes(data) {
    this.isLoadingSubSummary = false;
    console.log('Summary Data', data);
    // data.forEach(element => {
    //   element.feeMode = (element.feeMode == 1) ? 'FIXED' : 'VARIABLE';
    //   element.startsOn = (element.status == 1) ? 'START' : element.startsOn;
    //   element.status = (element.status == 1) ? 'NOT STARTED' : (element.status == 2) ?
    //   'LIVE' : (element.status == 3) ? 'FUTURE' : 'CANCELLED';
    // });
    if (data) {
      this.dataSource = data;
    } else {
      this.dataSource = [];
    }
  }

  // ******* Dashboard Sent And Signed Count *******

  docSentSignedCountData() {
    this.isLoadingDocsSent = true;

    const obj = {
      advisorId: this.advisorId
    };
    this.subService.docSentSignedCount(obj).subscribe(
      data => this.docSentSignedCountResponse(data)
    );
  }

  docSentSignedCountResponse(data) {
    console.log('SentSignedCountResponse', data);
    if (data){
      this.isLoadingDocsSent = false;
      this.dataSourceSingCount = data;
    }
    else{
      this.dataSourceSingCount = {};
    }
  }


  // ******* Dashboard Client With Subscription *******

  clientWithSubscription() {
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.clientWithSubcribe(obj).subscribe(
      data => this.clientWithSubscriptionRes(data)
    );
  }

  clientWithSubscriptionRes(data) {
    console.log('clientWithSubscriptionRes', data);
    if (data)
      this.dataSourceClientWithSub = data;
    else
      this.dataSourceClientWithSub = {};

  }

  // ******* Dashboard Invoice To Be Reviewed *******

  invoiceToBeReviewed() {
    const obj = {
      // advisorId: 2735,
      advisorId: this.advisorId,
      limit: 10,
      offset: 0
    };
    this.subService.invoiceReviewed(obj).subscribe(
      data => this.invoiceToBeReviewedRes(data)
    );
  }

  invoiceToBeReviewedRes(data) {
    console.log('invoiceToBeReviewedRes', data);
    this.dataSourceInvoice = data;
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
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


}
