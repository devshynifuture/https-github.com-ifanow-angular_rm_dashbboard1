import { Component, OnInit } from '@angular/core';
import { MutualFundOverviewComponent } from '../mutual-fund/mutual-fund-overview/mutual-fund-overview.component';

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
  getObj: { htmlInput: string; name: string; landscape: boolean; key: string; svg: string; };
  constructor(public overview: MutualFundOverviewComponent ) { }

  ngOnInit() {
    this.getUploadData()
  }
  getUploadData() {
    this.getObj = this.overview.uploadData(this.sendData)
    console.log('data ======', this.getObj)
  }
}
