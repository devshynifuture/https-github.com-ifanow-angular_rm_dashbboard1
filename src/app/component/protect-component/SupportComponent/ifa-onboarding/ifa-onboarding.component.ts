import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ifa-onboarding',
  templateUrl: './ifa-onboarding.component.html',
  styleUrls: ['./ifa-onboarding.component.scss']
})
export class IfaOnboardingComponent implements OnInit {

  constructor() { }

  dataSource = ELEMENT_DATA;
  displayedColumns = ['adminName', 'email', 'mobile', 'rmName', 'stage', 'usingSince', 'plan', 'team', 'arn', 'menu']

  ngOnInit() {
  }

  someFunction() {
    console.log("this is some function")
  }

}


const ELEMENT_DATA = [
  { adminName: 'Admin Name', email: 'Hydrogen', mobile: 1.0079, rmName: 'H', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Helium', mobile: 4.0026, rmName: 'He', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Lithium', mobile: 6.941, rmName: 'Li', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Beryllium', mobile: 9.0122, rmName: 'Be', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Boron', mobile: 10.811, rmName: 'B', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Carbon', mobile: 12.0107, rmName: 'C', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Nitrogen', mobile: 14.0067, rmName: 'N', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Oxygen', mobile: 15.9994, rmName: 'O', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Fluorine', mobile: 18.9984, rmName: 'F', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
  { adminName: 'Admin Name', email: 'Neon', mobile: 20.1797, rmName: 'Ne', stage: '30 mins ago', usingSince: 'active', plan: 'planName', team: '3', arn: '1', menu: '' },
];
