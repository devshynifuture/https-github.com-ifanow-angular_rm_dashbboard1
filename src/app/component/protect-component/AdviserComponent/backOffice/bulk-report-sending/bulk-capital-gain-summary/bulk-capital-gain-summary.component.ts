import { Component, OnInit, Input } from '@angular/core';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { MutualFundOverviewComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundsCapitalComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-bulk-capital-gain-summary',
  templateUrl: './bulk-capital-gain-summary.component.html',
  styleUrls: ['./bulk-capital-gain-summary.component.scss'],
  providers:[MutualFundsCapitalComponent]
})
export class BulkCapitalGainSummaryComponent implements OnInit {
  GTdividendReinvestment=0;
  totaldividendPayout =0;
  GTReinvesment=0;
  isLoading = false;
  GTdividendPayout : any;
  dataSource : any;
  dataSource1 : any;
  dataSource2 : any;
  equityObj : any;
  debtObj : any;
  reportDate: Date;
  fragmentData: any;
  getObj: string;
  clientData: any;
  sendData: any;
  inputData: any;
  userInfo: any;
  clientId: any;

  constructor(
    public mfService : MfServiceService,
    private utilService : UtilService,
    public capitalGainSummary : MutualFundsCapitalComponent
  ) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    if(data){
      this.clientId = data.clientId;
      this.sendData = data
      this.userInfo =  (data.userInfo)? data.userInfo.advisorData: '-';
      this.clientData = (data.userInfo)?  data.userInfo.clientData: '-';
      this.ngOnInit()
    }
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.reportDate = new Date()
    this.fragmentData = {}
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.mfService.getCapitalSummary()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        if ('') {
          this.getAllData()
        }
      })
    console.log(this.getObj)
  }
  ngAfterViewInit(){
    let para = document.getElementById('templateOver');
    if(para.innerHTML){
      this.generatePdf()
    }
  }
  getUploadData(){

  }
  getAllData(){

  }
  generatePdf() {
    let para = document.getElementById('templateOver');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Overview`s'+this.clientData.name,
      landscape: true,
      key: 'showPieChart',
      svg: '',
      clientId : this.sendData.clientId,
      advisorId : AuthService.getAdvisorId(),
      fromEmail: 'devshyni@futurewise.co.in',
      toEmail: 'devshyni@futurewise.co.in'
    }
    this.utilService.bulkHtmlToPdf(obj)
    this.utilService.htmlToPdf(para.innerHTML, 'Overview', false, this.fragmentData, '', '')
    return obj

  }
}
