import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MutualFundSummaryComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { UtilService } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-bulk-summary',
  templateUrl: './bulk-summary.component.html',
  styleUrls: ['./bulk-summary.component.scss'],
  providers: [MutualFundSummaryComponent]
})

export class BulkSummaryComponent implements OnInit {
  inputData: any;
  clientId: any;
  sendData: any;
  getOrgData: any;
  userInfo: any;
  details: any;
  clientData: any;
  mfData: any;
  grandTotal: any;
  rightFilterData: any;
  reponseData: any;
  setDefaultFilterData: any;
  saveFilterData: any;
  reportDate: any;
  totalValue: any;

  @ViewChild('summaryTemplate', { static: false }) summaryTemplate: ElementRef;
  chart: Highcharts.Chart;

  @Input()
  set data(data) {
    this.inputData = data;
    if (data.clientId) {
      console.log('This is Input data of proceed ', data);
      this.sendData = data
      this.userInfo = data.userInfo.advisorData;
      this.clientData = data.userInfo.clientData
      this.ngOnInit()
    }
  }
  get data() {
    return this.inputData;
  }
  getObj: any;
  fragmentData: any;
  customDataSource: any;

  constructor(
    public summary: MutualFundSummaryComponent,
    public mfService: MfServiceService,
    public utilService: UtilService
  ) { }

  ngOnInit() {
    this.reportDate = new Date()
    this.fragmentData = {}
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.mfService.getSummaryData()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        console.log('yeeeeeeeee', res)
        if (this.getObj.hasOwnProperty('customDataSourceData') && this.getObj.hasOwnProperty('grandTotal')) {
          this.getAllDataSummary()
        }
      })
    console.log(this.getObj)
  }
  ngAfterViewInit() {
    let para = document.getElementById('template');
    if (para.innerHTML) {
      this.generatePdf()

    }
  }
  getUploadData() {
    this.getObj = this.summary.uploadData(this.sendData)
    console.log('data summary summary ======', this.getObj)
    console.log(this.getObj)
  }
  getAllDataSummary() {
    this.customDataSource = this.getObj.customDataSourceData.customDataSourceData;
    this.totalValue = this.getObj.customDataSourceData.totalValue
    this.grandTotal = this.getObj.grandTotal
  }
  generatePdf() {
    let para = document.getElementById('template');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Summary`s'+this.clientData.name,
      landscape: true,
      key: 'showPieChart',
      clientId : 93902,
      advisorId : AuthService.getAdvisorId(),
      fromEmail: 'devshyni@futurewise.co.in',
      toEmail: 'devshyni@futurewise.co.in'
    }
    this.utilService.bulkHtmlToPdf(obj)
    this.utilService.htmlToPdf(para.innerHTML, 'Summary', false, this.fragmentData, '', '')
    return obj

  }
}
