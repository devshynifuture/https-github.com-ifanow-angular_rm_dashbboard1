import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  displayedColumns = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['position', 'name'];
  dataSource1 = ELEMENT_DATA1;
  constructor(private subInjectService: SubscriptionInject) { }
  selected;
  ngOnInit() {
    this.selected = 0;
  }
  close() {
    // this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;

 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Debt asset class', name: '7%'},
  {position: 'Equity asset class', name: '17%'},
  {position: 'Debt funds', name: '12%'},
  {position: 'Equity funds', name: '10%'},
  {position: 'Balanced funds', name: '7%'},
  {position: 'Stocks', name: '7%'},
 
];
export interface PeriodicElement1 {
  name: string;
  position: string;
 
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {position: 'Inflation rate', name: '6%'},
 
];