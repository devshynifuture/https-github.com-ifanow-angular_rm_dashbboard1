import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { MutualFundUnrealizedTranComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-bulk-all-transactions',
  templateUrl: './bulk-all-transactions.component.html',
  styleUrls: ['./bulk-all-transactions.component.scss'],
  providers:[MutualFundUnrealizedTranComponent]
})
export class BulkAllTransactionsComponent implements OnInit {
  fragmentData: any;
  getObj: any;
  inputData: any;
  sendData: any;
  userInfo : any;
  reportDate: any;
  clientData : any;
  dataSource: any;
  customDataSource: any;
  getOrgData : any;
  viewMode : any;
  reponseData : any;
  setDefaultFilterData : any;
  saveFilterData : any;
  grandTotal : any
  showDownload : any;
  columnHeader : any;
  rightFilterData: any;
  details : any;
  mode: any;
  displayedColumns: any;


  constructor(
    private utilService : UtilService,
    public mfService : MfServiceService,
    public unrealisedTransaction : MutualFundUnrealizedTranComponent,
  ) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    this.sendData = data
    this.mode = data.reportType
    this.userInfo =  data.userInfo.advisorData
    this.clientData = data.userInfo.clientData
    this.ngOnInit()
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.fragmentData = {}
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.mfService.getTransactionData()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        console.log('yeeeeeeeee Transaction ====',res)
        if (this.getObj.hasOwnProperty('customDataSourceData')&& this.getObj.hasOwnProperty('displayedColumns')&& this.getObj.hasOwnProperty('viewMode')) {
          this.getAllData()
        }
      })
    console.log(this.getObj)
  }
  ngAfterViewInit() {
    this.generatePdf()
  }
  getAllData(){
    this.customDataSource = this.getObj.customDataSourceData
    this.dataSource = this.getObj.dataSource
    this.grandTotal = this.getObj.grandTotal
    this.viewMode = this.getObj.viewMode
    this.displayedColumns = this.getObj.displayedColumns
    this.columnHeader = this.getObj.columnHeader
    this.setDefaultFilterData = this.getObj.setDefaultFilterData
  }
  getUploadData() {
    this.getObj = this.unrealisedTransaction.uploadData(this.sendData)
    console.log('data summary summary ======', this.getObj)
    console.log(this.getObj)
  }
  generatePdf() {
    this.fragmentData.isSpinner = true;
    setTimeout(() => {
      const para = document.getElementById('template');
     let obj = {
        htmlInput: para.innerHTML,
        name: this.mode+this.clientData.name,
        landscape: true,
        key: 'showPieChart',
        clientId : 93902,
        advisorId : AuthService.getAdvisorId(),
        fromEmail: 'devshyni@futurewise.co.in',
        toEmail: 'devshyni@futurewise.co.in'
      }
      this.utilService.bulkHtmlToPdf(obj)
      this.utilService.htmlToPdf(para.innerHTML, 'Test', 'true', this.fragmentData, '', '');
    }, 200);

    // if(data){
    //   this.isSpinner = false;
    // }
  }

}
