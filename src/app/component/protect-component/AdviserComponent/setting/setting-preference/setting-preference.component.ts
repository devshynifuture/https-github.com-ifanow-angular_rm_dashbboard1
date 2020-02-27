import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-preference',
  templateUrl: './setting-preference.component.html',
  styleUrls: ['./setting-preference.component.scss']
})
export class SettingPreferenceComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  viewMode = 'tab1';
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'archit.gupta@acmefinancial.com', name: 'Verified' },
  { position: 'welcome@acmefinancial.com', name: 'Verification in process' },
  { position: 'info@acmefinancial.com', name: 'Verification failed' },

];