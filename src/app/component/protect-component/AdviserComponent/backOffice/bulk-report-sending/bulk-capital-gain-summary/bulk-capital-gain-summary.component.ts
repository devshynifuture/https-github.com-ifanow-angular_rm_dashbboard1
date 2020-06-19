import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {MfServiceService} from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import {MutualFundsCapitalComponent} from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import {UtilService} from 'src/app/services/util.service';
import {AuthService} from 'src/app/auth-service/authService';

@Component({
  selector: 'app-bulk-capital-gain-summary',
  templateUrl: './bulk-capital-gain-summary.component.html',
  styleUrls: ['./bulk-capital-gain-summary.component.scss'],
  providers: [MutualFundsCapitalComponent]
})
export class BulkCapitalGainSummaryComponent implements OnInit, AfterViewInit {
  getOrgData;
  viewMode;
  // GTdividendReinvestment=0;
  totaldividendPayout = 0;
  // GTReinvesment=0;
  isLoading = false;
  GTdividendPayout: any;
  GTdividendReinvestment: any;
  GTReinvesment : any;
  dataSource : any;
  dataSource1 : any;
  dataSource2 : any;
  equityObj : any;
  debtObj : any;
  reportDate: Date;
  fragmentData: any;
  clientData: any;
  sendData: any;
  inputData: any;
  userInfo: any;
  clientId: any;
  getObj: any;

  constructor(
    public mfService: MfServiceService,
    private utilService: UtilService,
    public capitalGainSummary: MutualFundsCapitalComponent
  ) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    if (data) {
      this.clientId = data.clientId;
      this.sendData = data;
      this.userInfo = (data.userInfo) ? data.userInfo.advisorData : '-';
      this.clientData = (data.userInfo) ? data.userInfo.clientData : '-';
      this.ngOnInit();
    }
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.reportDate = new Date();
    this.fragmentData = {};
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.getObj.sendData  = this.sendData
    this.mfService.getCapitalSummary()
      .subscribe(res => {
        this.getObj = res; // used for getting mutual fund data coming from main gain call
        console.log('capital summary data here =', this.getObj);
        if (this.getObj.hasOwnProperty('dataSource') && this.getObj.hasOwnProperty('dataSource1')
          && this.getObj.hasOwnProperty('dataSource2')) {
          this.getAllData();
        }
      });
    console.log(this.getObj);
  }

  ngAfterViewInit() {
    const para = document.getElementById('template');
    if (para.innerHTML) {
      this.generatePdf();
    }
  }

  getUploadData() {
    this.getObj = this.capitalGainSummary.uploadData(this.sendData);
    console.log('data ======', this.getObj);
    console.log(this.getObj);
  }

  getAllData() {
    this.dataSource = this.getObj.dataSource;
    this.dataSource1 = this.getObj.dataSource1;
    this.dataSource2 = this.getObj.dataSource2;
    this.equityObj = this.getObj.equityObj;
    this.debtObj = this.getObj.debtObj;
    this.GTReinvesment = this.getObj.GTReinvesment;
    this.GTdividendPayout = this.getObj.GTdividendPayout;
    this.GTdividendReinvestment = this.getObj.GTdividendReinvestment;
  }

  generatePdf() {
    const para = document.getElementById('template');
    const obj = {
      htmlInput: para.innerHTML,
      name: 'Capital_Gain_Summary`s',
      landscape: true,
      key: 'showPieChart',
      svg: '',
      clientId: 97118,
      advisorId: AuthService.getAdvisorId(),
      fromEmail: 'devshyni@futurewise.co.in',
      toEmail: 'devshyni@futurewise.co.in'
    };
    this.utilService.bulkHtmlToPdf(obj);
    this.utilService.htmlToPdf(para.innerHTML, 'Capital_Gain_Summary', true, this.fragmentData, '', '');
    return obj;

  }
}
