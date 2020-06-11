import { Component, OnInit } from '@angular/core';
import { MutualFundOverviewComponent } from '../mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-bulk-email-test',
  templateUrl: './bulk-email-test.component.html',
  styleUrls: ['./bulk-email-test.component.scss'],
  providers: [MutualFundOverviewComponent],
})
export class BulkEmailTestComponent implements OnInit {
  data: any;
  sendData = [{
    clientId: 88317
  }]
  getObj: any;
  dataSource3: any;
  dataSource: any;
  mfData: any;
  dataSource4: any;
  dataSource2: any;
  chart: any;
  
  constructor(public overview: MutualFundOverviewComponent, private UtilService : UtilService) { }

  ngOnInit() {
    this.getUploadData()
  }
  getUploadData() {
    this.getObj = this.overview.uploadData(this.sendData)
    console.log('data ======', this.getObj)
    this.dataSource3 = this.getObj.dataSource3;
    this.dataSource = this.getObj.dataSource;
    this.mfData = this.getObj.mfData;
    this.dataSource4 = this.getObj.dataSource4;
    this.dataSource2 = this.getObj.dataSource2;
    this.chart = this.getObj.dataSource2;
    this.generatePdf()

  }
  generatePdf() {
    //this.svg = this.chart.getSVG()
    let para = document.getElementById('template');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Overview',
      landscape: true,
      key: 'showPieChart',
      svg: ''
    }
 this.UtilService.htmlToPdf(para.innerHTML, 'Overview', false, true, 'showPieChart', '')
    return obj
  }
}
