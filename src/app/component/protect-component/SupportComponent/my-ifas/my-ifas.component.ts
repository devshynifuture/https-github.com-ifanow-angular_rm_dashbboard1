import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { IfaDetailsComponent } from './ifa-details/ifa-details.component';

@Component({
  selector: 'app-my-ifas',
  templateUrl: './my-ifas.component.html',
  styleUrls: ['./my-ifas.component.scss']
})
export class MyIfasComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  dataSource = ELEMENT_DATA;
  displayedColumns = ['adminName', 'email', 'mobile', 'usingSince', 'lastLogin', 'accStatus', 'plan', 'nextBilling', 'team', 'arn', 'logout', 'menu']

  ngOnInit() {
  }

  someFunction() {
    console.log("this is some function:::::::")
  }

  openIfaRightSilder(data) {
    const fragmentData = {
      flag: 'ifaDetails',
      data,
      id: 1,
      state: 'open75',
      componentName: IfaDetailsComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
    event.stopPropagation();
  }
}
const ELEMENT_DATA = [
  { adminName: 'Admin Name', email: 'Hydrogen', mobile: 1.0079, usingSince: 'H', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Helium', mobile: 4.0026, usingSince: 'He', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Lithium', mobile: 6.941, usingSince: 'Li', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Beryllium', mobile: 9.0122, usingSince: 'Be', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Boron', mobile: 10.811, usingSince: 'B', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Carbon', mobile: 12.0107, usingSince: 'C', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Nitrogen', mobile: 14.0067, usingSince: 'N', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Oxygen', mobile: 15.9994, usingSince: 'O', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Fluorine', mobile: 18.9984, usingSince: 'F', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Admin Name', email: 'Neon', mobile: 20.1797, usingSince: 'Ne', lastLogin: '30 mins ago', accStatus: 'active', plan: 'planName', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
];