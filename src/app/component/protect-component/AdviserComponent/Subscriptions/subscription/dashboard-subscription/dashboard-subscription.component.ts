import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../subscription-inject.service';
import {EventService} from 'src/app/Data-service/event.service';
import {MatDialog} from '@angular/material';
import {DeleteSubscriptionComponent} from '../common-subscription-component/delete-subscription/delete-subscription.component';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {SubscriptionService} from '../../subscription.service';
import {EnumServiceService} from '../enum-service.service';
import {UtilService} from '../../../../../../services/util.service';
import {AuthService} from '../../../../../../auth-service/authService';
import {Chart} from 'angular-highcharts';

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

  constructor(private enumService: EnumServiceService,
              public subInjectService: SubscriptionInject, public eventService: EventService,
              public dialog: MatDialog, private subService: SubscriptionService) {

  }

  // advisorId = 400;
  advisorId;
  dataSourceSingCount;
  dataSourceClientWithSub;
  dataSourceInvoiceReviwed;
  subSummaryData;
  dataSource;
  showSubStep = false;
  displayedColumns: string[] = ['name', 'service', 'amt', 'billing', 'icons'];
  chart: Chart;
  subscriptionSummaryStatusFilter = '1';

  ngOnInit() {
    this.initChart();

    this.advisorId = AuthService.getAdvisorId();
    this.docSentSignedCountData();
    this.clientWithSubscription();
    this.invoiceToBeReviewed();
    this.getSummaryDataDashboard(null);
    this.getDataForCreateService();
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
        console.log('12397891273098127389012739812731231982371 chart ref setTimeout')
        chartView.reflow();

        chart.addPoint(6);
      }, 100);
    });
  }

  Open(state, data) {
    let feeMode;
    if (data.feeMode == 'FIXED') {
      feeMode = 'fixedModifyFees';
    } else {
      feeMode = 'variableModifyFees';
    }
    this.eventService.sidebarData(feeMode);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
  }

  openPlanSlider(value, state, data) {
    this.eventService.sidebarData(value);
    this.subInjectService.rightSideData(state);
    this.subInjectService.addSingleProfile(data);
    this.invoiceHisData = data;
  }

  showSubscriptionSteps() {
    this.showSubStep = true;
  }

  delete(data) {
    const Fragmentdata = {
      Flag: data,
    };
    if (data == 'cancelSubscription') {
      const dialogRef = this.dialog.open(DeleteSubscriptionComponent, {
        width: '20%',
        // height:'40%',
        data: Fragmentdata,
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
      });
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
      limit: -1,
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
      offset: 1
    };
    this.subService.invoiceReviewed(obj).subscribe(
      data => this.invoiceToBeReviewedRes(data)
    );
  }

  invoiceToBeReviewedRes(data) {
    console.log('invoiceToBeReviewedRes', data);
    this.dataSourceInvoiceReviwed = data;
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

  getDataForCreateService() {
    const obj = {};
    this.subService.getDataForCreateService(obj).subscribe(
      data => {
        console.log('data getDataForCreateService ', data);
        const newJsonForConsumption = {
          billingMode: [],
          assetTypes: [],
          feeTypes: [],
          billingNature: [],
          otherAssetTypes: [],
          feeCollectionMode: []
        };
        newJsonForConsumption.billingNature = UtilService.convertObjectToArray(data.billingNature);
        newJsonForConsumption.otherAssetTypes = UtilService.convertObjectToCustomArray(data.otherAssetTypes, 'subAssetClassName', 'subAssetClassId');
        newJsonForConsumption.feeTypes = UtilService.convertObjectToArray(data.feeTypes);
        newJsonForConsumption.assetTypes = UtilService.convertObjectToArray(data.assetTypes);
        newJsonForConsumption.billingMode = UtilService.convertObjectToArray(data.billingMode);
        newJsonForConsumption.feeCollectionMode = UtilService.convertObjectToArray(data.paymentModes);
        console.log('data newJsonForConsumption ', newJsonForConsumption);

        this.enumService.setGlobalEnumData(newJsonForConsumption);
      }
    );
  }
}
