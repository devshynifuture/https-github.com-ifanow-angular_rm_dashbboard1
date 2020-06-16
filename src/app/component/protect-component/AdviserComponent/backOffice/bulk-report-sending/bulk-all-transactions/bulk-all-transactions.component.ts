import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { MutualFundUnrealizedTranComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';

@Component({
  selector: 'app-bulk-all-transactions',
  templateUrl: './bulk-all-transactions.component.html',
  styleUrls: ['./bulk-all-transactions.component.scss']
})
export class BulkAllTransactionsComponent implements OnInit {
  fragmentData: any;
  getObj: any;
  inputData: any;
  sendData: any;

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
    this.ngOnInit()
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.fragmentData = {}
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.mfService.getSummaryData()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        console.log('yeeeeeeeee',res)
        if (this.getObj.hasOwnProperty('data')) {
          //this.getAllData()
        }
      })
    console.log(this.getObj)
  }
  ngAfterViewInit() {
    this.generatePdf()
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
      this.utilService.htmlToPdf(para.innerHTML, 'Test', 'true', this.fragmentData, '', '');
    }, 200);

    // if(data){
    //   this.isSpinner = false;
    // }
  }

}
