import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
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
  weight: string;
 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Debt asset class', name: '7%', weight: '6%'},
  {position: 'Equity asset class', name: '17%', weight: '6%'},
  {position: 'Debt funds', name: '12%', weight: '16%'},
  {position: 'Equity funds', name: '10%', weight: '6%'},
  {position: 'Balanced funds', name: '7%', weight: '6%'},
  {position: 'Stocks', name: '7%', weight: '6%'},
 
];
