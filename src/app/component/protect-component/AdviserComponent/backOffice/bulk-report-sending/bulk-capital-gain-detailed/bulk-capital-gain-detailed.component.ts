import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { MfCapitalDetailedComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mf-capital-detailed/mf-capital-detailed.component';

@Component({
  selector: 'app-bulk-capital-gain-detailed',
  templateUrl: './bulk-capital-gain-detailed.component.html',
  styleUrls: ['./bulk-capital-gain-detailed.component.scss'],
  providers:[MfCapitalDetailedComponent]
})
export class BulkCapitalGainDetailedComponent implements OnInit {
  inputData: any;
  clientId: any;
  sendData: any;
  userInfo: any;
  clientData: any;
  reportDate: Date;
  GTdividendPayout : any;
  GTdividendReinvestment: any;
  GTReinvesment : any;
  dataSource : any;
  dataSource1 : any;
  dataSource2 : any;
  equityObj : any;
  debtObj : any;
  getObj: any;
  fragmentData: any;
  total_stGain: any;
  total_ltGain: any;
  total_stLoss: any;
  total_ltLoss: any;
  total_indexGain: any;
  total_indexLoss: any;
  purchaseAmount: any;
  redeemAmount: any;
  total_stt: any;

  constructor(
    private utilService :UtilService,
    public mfService :MfServiceService,
    public capitalDetailed : MfCapitalDetailedComponent
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
    this.mfService.getCapitalDetailed()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        console.log('capital getCapitalDetailed data here =',this.getObj)
        if (this.getObj.hasOwnProperty('dataSource')&& this.getObj.hasOwnProperty('dataSource1')&&this.getObj.hasOwnProperty('dataSource2')) {
          this.getAllData()
        }
      })
    console.log(this.getObj)
  }
  ngAfterViewInit(){
    let para = document.getElementById('template');
    if(para.innerHTML){
      this.generatePdf()
    }
  }
  getUploadData(){
    this.getObj = this.capitalDetailed.uploadData(this.sendData)
    console.log('data ======', this.getObj)
    console.log(this.getObj)
  }
  getAllData(){
    this.dataSource = this.getObj.dataSource
    this.dataSource1 = this.getObj.dataSource1
    this.dataSource2 = this.getObj.dataSource2
    this.equityObj = this.getObj.equityObj
    this.debtObj = this.getObj.debtObj
    this.GTReinvesment = this.getObj.GTReinvesment
    this.GTdividendPayout = this.getObj.GTdividendPayout
    this.GTdividendReinvestment = this.getObj.GTdividendReinvestment
    this.total_stGain = this.getObj.total_stGain;
    this.total_ltGain = this.getObj.total_ltGain;
    this.total_stLoss = this.getObj.total_stLoss;
    this.total_ltLoss = this.getObj.total_ltLoss;
    this.total_indexGain = this.getObj.total_indexGain;
    this.total_indexLoss = this.getObj.total_indexLoss;
    this.purchaseAmount = this.getObj.purchaseAmount;
    this.redeemAmount = this.getObj.redeemAmount;
    this.total_stt = this.getObj.total_stt;
  }
  generatePdf() {
    let para = document.getElementById('template');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Capital_Gain_Summary`s'+this.clientData.name,
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
