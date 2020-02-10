import { Component, OnInit } from '@angular/core';
import { ExcelService } from '../../../../excel.service';

@Component({
  selector: 'app-small-saving-scheme',
  templateUrl: './small-saving-scheme.component.html',
  styleUrls: ['./small-saving-scheme.component.scss']
})
export class SmallSavingSchemeComponent implements OnInit {
  selectedTab: number;

  constructor(private excel: ExcelService, ) {
  }

  ngOnInit() {
    this.selectedTab = 6;
  }
}
