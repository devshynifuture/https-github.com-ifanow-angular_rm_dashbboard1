import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-preference',
  templateUrl: './setting-preference.component.html',
  styleUrls: ['./setting-preference.component.scss']
})
export class SettingPreferenceComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource1 = ELEMENT_DATA1;
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



export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Welcome email', name: 'Used when creating a new client or converting prospect to client',
    weight: 'welcome@acmefinancial.com',
  },

];
