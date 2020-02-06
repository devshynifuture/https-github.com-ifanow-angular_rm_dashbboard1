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

  displayedColumns2: string[] = ['arn', 'loginId', 'registeredId', 'userOrdering'];
  dataSource2 = ELEMENT_DATA2;

  displayedColumns3: string[] = ['arn', 'loginId', 'registeredId'];
  dataSource3 = ELEMENT_DATA3;

  displayedColumns4: string[] = ['arn', 'loginId'];
  dataSource4 = ELEMENT_DATA4;

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


export interface PeriodicElement2 {
  arn: string;
  loginId: string;
  registeredId: string;
  userOrdering: string;
}
const ELEMENT_DATA2: PeriodicElement2[] = [
  { arn: 'ARN-83866', loginId: 'abcconsult', registeredId: 'firstname.lastname@abcconsultants.com', userOrdering: "Yes" },
  { arn: 'RIA-INA000004409', loginId: 'riaconsult', registeredId: 'ria@abcconsultants.com,secondemail@abcconsults.com', userOrdering: "Yes" },

];



export interface PeriodicElement3 {
  arn: string;
  loginId: string;
  registeredId: string;

}
const ELEMENT_DATA3: PeriodicElement3[] = [
  { arn: 'ARN-83866', loginId: 'abcconsult', registeredId: 'firstname.lastname@abcconsultants.com' },
  { arn: 'RIA-INA000004409', loginId: 'riaconsult', registeredId: 'ria@abcconsultants.com,secondemail@abcconsults.com' },

];



export interface PeriodicElement4 {
  arn: string;
  loginId: string;

}
const ELEMENT_DATA4: PeriodicElement4[] = [
  { arn: 'ARN-83866', loginId: 'abcconsult', },
  { arn: 'ARN-83866', loginId: 'abcconsult', },

];

