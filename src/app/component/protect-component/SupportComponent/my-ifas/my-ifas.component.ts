import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../services/util.service';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { IfaDetailsComponent } from './ifa-details/ifa-details.component';

import { IfasDetailsComponent } from './ifas-details/ifas-details.component';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { OrderHistoricalFileComponent } from './../order-historical-file/order-historical-file.component';

@Component({
  selector: 'app-my-ifas',
  templateUrl: './my-ifas.component.html',
  styleUrls: ['./my-ifas.component.scss']
})


export class MyIfasComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  constructor(
    private subInjectService: SubscriptionInject
  ) { }

  dataSource;
  displayedColumns = ['adminName', 'email', 'mobile', 'usingSince', 'lastLogin', 'accStatus', 'plan', 'nextBilling', 'team', 'arn', 'logout', 'menu']

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.sort = this.sort;
  }

  openOrderHistoricalFile(data) {
    const fragmentData = {
      flag: 'ifaDetails',
      data,
      id: 1,
      state: 'open50',
      componentName: OrderHistoricalFileComponent,
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
  }

  openIfaRightSilder(data) {
    const fragmentData = {
      flag: 'ifaDetails',
      data,
      id: 1,
      state: 'open70',
      componentName: IfasDetailsComponent,
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
    // event.stopPropagation();
  }
}
const ELEMENT_DATA = [
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '2Y ', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'Inactive', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '123 Days', accStatus: 'Decativated', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, usingSince: '3Y 7M', lastLogin: '30 mins ago', accStatus: 'active', plan: 'Power + OT + WL', nextBilling: '18/03/2020', team: '3', arn: '1', logout: '', menu: '' },
]; 