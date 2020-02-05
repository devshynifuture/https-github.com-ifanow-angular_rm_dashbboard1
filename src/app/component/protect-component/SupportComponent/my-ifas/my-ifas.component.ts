import { Component, OnInit } from '@angular/core';
import { SupportService } from './../support.service';


@Component({
  selector: 'app-my-ifas',
  templateUrl: './my-ifas.component.html',
  styleUrls: ['./my-ifas.component.scss']
})


export class MyIfasComponent implements OnInit {
  isLoading = false;
  constructor(private supportService: SupportService) { }

  dataSource = ELEMENT_DATA;
  displayedColumns = ['adminName', 'email', 'mobile', 'usingSince', 'lastLogin', 'accStatus', 'plan', 'nextBilling', 'team', 'arn', 'logout', 'menu']


  ngOnInit() {

  }




}
const ELEMENT_DATA = [
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '2Y ', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'Inactive', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '123 Days', accStatus: 'Decativated', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
]; 