import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ExcelService } from '../../../../excel.service';

@Component({
  selector: 'app-small-saving-scheme',
  templateUrl: './small-saving-scheme.component.html',
  styleUrls: ['./small-saving-scheme.component.scss']
})
export class SmallSavingSchemeComponent implements OnInit {
  selectedTab: number;
  @Output() changeCount = new EventEmitter();
  constructor(private excel: ExcelService, ) {
  }
  ppfDataList: any;
  nscDataList: any;
  ssyDataList: any;
  kvpDataList: any;
  scssDataList: any;
  poDataList: any;
  pordDataList: any;
  potdDataList: any;
  pomisDataList: any;
  ngOnInit() {
    this.selectedTab = 1;
  }

  getAssetCountGLobalData() {
    // this.changeCount.emit("call");
  }

  getDataList(asset, event) {
    switch (asset) {
      case 'ppf':
        this.ppfDataList = event;
        break;
      case 'nsc':
        this.nscDataList = event;
        break;
      case 'ssy':
        this.ssyDataList = event;
        break;
      case 'kvp':
        this.kvpDataList = event;
        break;
      case 'scss':
        this.scssDataList = event;
        break;
      case 'po':
        this.poDataList = event;
        break;
      case 'pord':
        this.pordDataList = event;
        break;
      case 'potd':
        this.potdDataList = event;
        break;
      case 'pomis':
        this.pomisDataList = event;
        break;
    }
  }
}
