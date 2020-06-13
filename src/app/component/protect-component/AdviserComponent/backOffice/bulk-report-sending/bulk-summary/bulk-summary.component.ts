import { Component, OnInit, Input } from '@angular/core';
import { MutualFundSummaryComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { UtilService } from 'src/app/services/util.service';

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
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    this.clientId = data.clientId;
    this.sendData = data
    this.ngOnInit()
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
    this.fragmentData = {}
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.mfService.getSendData()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        if (this.getObj.hasOwnProperty('customDataSource')) {
          this.getAllData()
        }
      })
    console.log(this.getObj)
  }
  ngAfterViewInit() {
    this.generatePdf()
  }
  getUploadData() {
    this.getObj = this.summary.uploadData(this.sendData)
    console.log('data summary summary ======', this.getObj)
    console.log(this.getObj)
  }
  getAllData() {

    this.customDataSource = this.getObj.customDataSource;
    // pie chart data after calculating percentage
    //this.ngAfterViewInit()
  }
  generatePdf() {
    let para = document.getElementById('template');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Summary',
      landscape: true,
      key: 'showPieChart',
      svg: ''
    }
    this.utilService.htmlToPdf(para.innerHTML, 'Summary', false, this.fragmentData, '', '')
    return obj

  }
}
