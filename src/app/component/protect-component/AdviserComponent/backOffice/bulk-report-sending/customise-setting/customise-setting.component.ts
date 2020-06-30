import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customise-setting',
  templateUrl: './customise-setting.component.html',
  styleUrls: ['./customise-setting.component.scss']
})
export class CustomiseSettingComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mfoverview', 'mfsummary', 'mftransaction', 'mfunrealised', 'mfcapitalgain', 'mfcapitalgaindetailed'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  name: string;
  mfoverview: string;
  mfsummary: string;
  mftransaction: string;
  mfunrealised: string;
  mfcapitalgain: string;
  mfcapitalgaindetailed: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Ronak hindocha', mfoverview: ' ', mfsummary: '', mftransaction: '', mfunrealised: '', mfcapitalgain: '', mfcapitalgaindetailed: '' },


];