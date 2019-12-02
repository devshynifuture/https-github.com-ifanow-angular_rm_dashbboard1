import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-mf-allocations',
  templateUrl: './mf-allocations.component.html',
  styleUrls: ['./mf-allocations.component.scss']
})
export class MfAllocationsComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['scheme', 'value', 'goal', 'allocation','icons'];
  dataSource1 = ELEMENT_DATA1;
  
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    // this.addMoreFlag = false;
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  
}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Lumpsum', name: '4,55,814', weight: '1,20,529'},
  {position: 'Monthly', name: '35,907', weight: '12,835'},
  
];

export interface PeriodicElement1 {
  scheme: string;
  value: string;
  goal: string;
  allocation:string
  
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {scheme: 'DSP Tax Saver Fund - Regular Plan Growth | Large cap', value: '4,000', goal: 'Rahul’s retirement',allocation:'80%'},
  {scheme: 'DSP Tax Saver Fund - Regular Plan Growth | Large cap | [SIP]', value: '4,000', goal: 'Aryan’s higher education',allocation:'80%'},
  {scheme: 'Aditya birla sun life low duration fund | Low Duration', value: '4,000', goal: 'Aryan’s higher education',allocation:'80%'},
  {scheme: 'Mirae Equity Fund - Regular Plan - Growth | Diversified', value: '4,000', goal: '-',allocation:'80%'},
  {scheme: 'HDFC Balanced Advantage fund Aggressive - Growth	| Multi cap', value: '4,000', goal: 'Shreya’s marriage',allocation:'80%'},
  {scheme: 'Mirae Equity Fund - Regular Plan - Growth | Diversified', value: '4,000', goal: '-',allocation:'80%'},
  {scheme: 'HDFC Equity Fund - Regular Plan - Growth | ELSS | [SIP]', value: '4,000', goal: '-',allocation:'80%'},
  
];