import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})
export class AdminDetailsComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, ) { }
  displayedColumns: string[] = ['name', 'email', 'mobile', 'role'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['arn', 'regEmailId', 'scheduleExp'];
  dataSource1 = ELEMENT_DATA1;

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}


export interface PeriodicElement {
  name: string;
  email: string;
  mobile: string;
  role: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Rinku Singh', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
  { name: 'Atul Shah', email: 'atul@manekfinancial.com', mobile: '9879879878', role: 'Team member' },
];


export interface PeriodicElement1 {
  arn: string;
  regEmailId: string;
  scheduleExp: string;
}
const ELEMENT_DATA1: PeriodicElement1[] = [
  { arn: 'Atul Shah', regEmailId: 'atul@manekfinancial.com', scheduleExp: '9879879878' },

];
