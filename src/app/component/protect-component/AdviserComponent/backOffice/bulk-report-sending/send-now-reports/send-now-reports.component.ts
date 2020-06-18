import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';
import { OpenSendReportPopupComponent } from '../open-send-report-popup/open-send-report-popup.component';
import { MatDialog } from '@angular/material';
import * as Highcharts from 'highcharts';
import { MutualFundOverviewComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';

@Component({
  selector: 'app-send-now-reports',
  templateUrl: './send-now-reports.component.html',
  styleUrls: ['./send-now-reports.component.scss'],
  providers: [MutualFundOverviewComponent],

})
export class SendNowReportsComponent implements OnInit {
  element: any;
  capitalGainSummary = false;
  capitalGainDetails = false;
  unrealisedTransactions = false;
  allTransactions = false;
  summary = false;
  overview = true;
  selectedReportType: any;
  fromDate: Date;
  toDate: Date;
  financialYears: { from: number; to: number; selected: boolean; disabled: boolean; }[];
  date: any;

  constructor(
    private subInjectService: SubscriptionInject,
    public dialog: MatDialog,
    public overviewRepot: MutualFundOverviewComponent,
    public mfService: MfServiceService,
  ) { }

  ngOnInit() {
    this.capitalGainSummary = false;
    this.date = {}
    this.date.fromDate = {}
    this.date.toDate = {}
    this.capitalGainDetails = false;
    this.unrealisedTransactions = false;
    this.allTransactions = false;
    this.summary = false;
    this.overview = true;
    this.selectedReportType = 'overview'
    this.fromDate = new Date();
    this.fromDate.setFullYear(this.fromDate.getFullYear() - 1);
    this.toDate = new Date();
    this.financialYears=[{'from':2010,'to':2011,'selected':true,'disabled':true},{'from':2011,'to':2012,'selected':true,'disabled':true},{'from':2012,'to':2013,'selected':true,'disabled':true},{'from':2013,'to':2014,'selected':true,'disabled':true},{'from':2014,'to':2015,'selected':true,'disabled':true},
    {'from':2015,'to':2016,'selected':true,'disabled':true},{'from':2016,'to':2017,'selected':true,'disabled':true},{'from':2017,'to':2018,'selected':true,'disabled':true},{'from':2018,'to':2019,'selected':true,'disabled':true},{'from':2019,'to':2020,'selected':true,'disabled':true},{'from':2020,'to':2021,'selected':true,'disabled':true}]
    this.financialYears.filter(function (element) {
      if (element.from == 2019 && element.to == 2020) {
        element.selected = true;
      } else {
        element.selected = false;
      }

    });
 
  }
  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
    });
  }
  proceed() {
    const dialogRef = this.dialog.open(OpenSendReportPopupComponent, {
      width: '400px',
      height: '500px',
      data: { reportType: this.selectedReportType, selectedElement: this.date }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined) {
        return
      }
      console.log('The dialog was closed');
      this.element = result;
      console.log('result -==', this.element)
    });
  }
  selectReportType(reportType, flag) {

    if (this.selectedReportType == undefined) {
      this.selectedReportType = 'overview'
    }
    if (reportType == 'overview') {
      if (flag == true) {
        this.overview = false
      } else {
        this.overview = true
        this.summary = false
        this.allTransactions = false
        this.unrealisedTransactions = false
        this.capitalGainDetails = false
        this.capitalGainSummary = false

        this.selectedReportType = reportType
      }
    } else if (reportType == 'summary') {
      if (flag == true) {
        this.summary = false
      } else {
        this.summary = true
        this.allTransactions = false
        this.unrealisedTransactions = false
        this.overview = false
        this.capitalGainDetails = false
        this.capitalGainSummary = false

        this.selectedReportType = reportType
      }
    } else if (reportType == 'allTransactions') {
      if (flag == true) {
        this.allTransactions = false
      } else {
        this.allTransactions = true
        this.summary = false
        this.unrealisedTransactions = false
        this.overview = false
        this.capitalGainDetails = false
        this.capitalGainSummary = false

        this.selectedReportType = reportType
      }
    } else if (reportType == 'unrealisedTransactions') {
      if (flag == true) {
        this.unrealisedTransactions = false
      } else {
        this.unrealisedTransactions = true
        this.summary = false
        this.allTransactions = false
        this.overview = false
        this.capitalGainDetails = false
        this.capitalGainSummary = false

        this.selectedReportType = reportType
      }
    } else if (reportType == 'capitalGainDetails') {
      if (flag == true) {
        this.capitalGainDetails = false
      } else {
        this.capitalGainDetails = true
        this.summary = false
        this.allTransactions = false
        this.unrealisedTransactions = false
        this.capitalGainSummary = false
        this.overview = false
        this.selectedReportType = reportType
      }
    } else if (reportType == 'capitalGainSummary') {
      if (flag == true) {
        this.capitalGainSummary = false
      } else {
        this.capitalGainSummary = true
        this.summary = false
        this.allTransactions = false
        this.unrealisedTransactions = false
        this.overview = false
        this.capitalGainDetails = false
        this.selectedReportType = reportType
      }
    }
  }
  changeFinancialYear(){}
  changeFromDate(date,flag){
    if(flag == 'fromDate'){
      this.fromDate = date.value
      this.date.fromDate = this.fromDate
    }else{
      this.toDate = date.value
      this.date.toDate = this.toDate
    }
    console.log('from date',this.fromDate)
  }
}
