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

  ngOnInit() {
    this.selectedTab = 1;
  }

  // getAssetCountGLobalData(){
  //   this.changeCount.emit("call");
  // }
}
