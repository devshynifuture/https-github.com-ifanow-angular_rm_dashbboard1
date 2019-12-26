import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-select-advice',
  // templateUrl: './select-advice.component.html',
  // templateUrl: './mutual-fund-action-plan.html',
  templateUrl: './sip-table.html',
  styleUrls: ['./select-advice.component.scss']
})
export class SelectAdviceComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'attch', 'icons'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'sdate', 'amt', 'status'];
  dataSource1 = ELEMENT_DATA1;

  constructor(public subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }
  Close(state) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  attch: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Aditya birla sun life - Equity Savings Fund Regular Plan Growth ',
    name: 'Equity - Large cap', weight: 'Visible', symbol: 'Added', attch: 'Added'
  },
  {
    position: 'Aditya birla sun life - Equity Savings Fund Regular Plan Growth ',
    name: 'Equity - Large cap', weight: 'Visible', symbol: 'Added', attch: 'Added'
  },
  {
    position: 'Aditya birla sun life - Equity Savings Fund Regular Plan Growth ',
    name: 'Equity - Large cap', weight: 'Visible', symbol: 'Added', attch: 'Added'
  },
];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  sdate: string;
  amt: string;
  status: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Aditya birla sun life - Equity Savings Fund Regular Plan Growth ',
    name: 'Equity - Large cap', weight: 'Visible', symbol: 'Added', sdate: '09/10/2019', amt: '5,000', status: 'Pending authorization'
  },
  {
    position: 'Aditya birla sun life - Equity Savings Fund Regular Plan Growth ',
    name: 'Equity - Large cap', weight: 'Visible', symbol: 'Added', sdate: '09/10/2019', amt: '5,000', status: 'Pending authorization'
  },
  {
    position: 'Aditya birla sun life - Equity Savings Fund Regular Plan Growth ',
    name: 'Equity - Large cap', weight: 'Visible', symbol: 'Added', sdate: '09/10/2019', amt: '5,000', status: 'Pending authorization'
  },
];
