import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {DeleteSubscriptionComponent} from '../common-subscription-component/delete-subscription/delete-subscription.component';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {SubscriptionService} from '../../subscription.service';
import {EnumServiceService} from '../../../../../../services/enum-service.service';
import {UtilService} from '../../../../../../services/util.service';
import {AuthService} from '../../../../../../auth-service/authService';
import {Chart} from 'angular-highcharts';
import {EnumDataService} from "../../../../../../services/enum-data.service";

export interface PeriodicElement {
  name: string;
  service: string;
  amt: string;
  billing: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Abhishek Mane', service: 'Financial Planning', amt: 'Rs.1,00,000/Q', billing: '25/08/2019'},
  {name: 'Ronak Hasmuk Hindocha', service: 'Investment management', amt: 'View Details', billing: '-'},
  {name: 'Aman Jain', service: 'AUM Linked fee', amt: 'View Details', billing: '-'},

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

  constructor(private enumService: EnumServiceService,
              public subInjectService: SubscriptionInject, public eventService: EventService,
              public dialog: MatDialog, private subService: SubscriptionService) {

  }

  // advisorId = 400;
  advisorId;
  dataSourceSingCount;
  dataSourceClientWithSub;
  dataSourceInvoice;
  subSummaryData;
  dataSource;
  showSubStep = false;
  displayedColumns: string[] = ['name', 'service', 'amt', 'billing'];
  chart: Chart;
  subscriptionSummaryStatusFilter = '1';
  showLetsBegin = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();

    this.initChart();
    this.getDashboardResponse();
    this.docSentSignedCountData();
    this.clientWithSubscription();
    this.invoiceToBeReviewed();
    this.getSummaryDataDashboard(null);
    this.getTotalRecivedByDash();
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

  Open(state, data) {
    let feeMode;
    data.isCreateSub = true;
    (data.subscriptionPricing.feeTypeId == 1) ? feeMode = 'fixedModifyFees' : feeMode = 'variableModifyFees';
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
        }
      }
    );
  }

  openPlanSlider(value, state, data) {
    (value == "billerSettings" || value == 'changePayee' || value == 'SUBSCRIPTIONS') ? value : (data.subscriptionPricing.feeTypeId == 1) ? value = 'createSubFixed' : value = 'createSubVariable'
    data.isCreateSub = false;
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
        }
      }
    );
  }

  getTotalRecivedByDash() {
    let obj = {
      advisorId: this.advisorId,
      period: 0
    }
    this.subService.getTotalRecived(obj).subscribe(
      data => this.getTotalRecivedRes(data)
    );
  }

  getTotalRecivedRes(data) {
    console.log('getTotalRecivedRes', data)
    this.totalSaleReceived = data
  }

  showSubscriptionSteps() {
    this.showSubStep = true;
  }

  changeParentsTab(selectedTab) {
    this.eventService.tabData(selectedTab);

  }

  delete(data) {
    const Fragmentdata = {
      Flag: data,
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
  getSummaryDataDashboard(eventValue) {
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
      limit: 10,
      offset: 0,
      dateType: 0,
      statusIdList: [this.subscriptionSummaryStatusFilter],
      fromDate: null,
      toDate: null

    };
    console.log('filterSubscription eventValue ', eventValue);
    console.log('filterSubscription this.subscriptionSummaryStatusFilter ', this.subscriptionSummaryStatusFilter);

    console.log('filterSubscription reqObj ', obj);
    this.subService.filterSubscription(obj).subscribe(
      data => this.getSubSummaryRes(data)
    );
  }

  getSubSummaryRes(data) {
    console.log('Summary Data', data);
    // data.forEach(element => {
    //   element.feeMode = (element.feeMode == 1) ? 'FIXED' : 'VARIABLE';
    //   element.startsOn = (element.status == 1) ? 'START' : element.startsOn;
    //   element.status = (element.status == 1) ? 'NOT STARTED' : (element.status == 2) ?
    //   'LIVE' : (element.status == 3) ? 'FUTURE' : 'CANCELLED';
    // });
    this.dataSource = data;
  }

// ******* Dashboard Sent And Signed Count *******

  docSentSignedCountData() {
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.docSentSignedCount(obj).subscribe(
      data => this.docSentSignedCountResponse(data)
    );
  }

  docSentSignedCountResponse(data) {
    console.log('SentSignedCountResponse', data);
    this.dataSourceSingCount = data;
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
    this.dataSourceClientWithSub = data;
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
