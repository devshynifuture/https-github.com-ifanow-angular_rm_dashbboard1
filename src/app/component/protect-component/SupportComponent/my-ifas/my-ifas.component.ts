import { SubscriptionInject } from './../../AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from './../../../../services/util.service';
import { Component, OnInit, ViewChild } from '@angular/core';
// import { IfaDetailsComponent } from './ifa-details/ifa-details.component';

import { IfasDetailsComponent } from './ifas-details/ifas-details.component';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { OrderHistoricalFileComponent } from './../order-historical-file/order-historical-file.component';
import { SupportService } from '../support.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-my-ifas',
  templateUrl: './my-ifas.component.html',
  styleUrls: ['./my-ifas.component.scss']
})


export class MyIfasComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  constructor(
    private subInjectService: SubscriptionInject, private supportService: SupportService, private eventService: EventService
  ) { }

  dataSource;
  displayedColumns = ['adminName', 'email', 'mobile', 'usingSince', 'lastLogin', 'accStatus', 'plan', 'nextBilling', 'team', 'arn', 'logout', 'menu']

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource.sort = this.sort;
    this.getMyIfasList();
  }

  getMyIfasList() {
    let obj = {};
    this.isLoading = true;
    this.supportService.getMyIFAValues(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length !== 0) {
          this.isLoading = false;
          let tableArray = [];
          data.forEach(element => {
            tableArray.push({
              adminName: element.name,
              email: element.email_id,
              mobile: element.mobile_number,
              usingSince: element.using_since_year + "Y " + element.using_since_month + "M",
              lastLogin: element.last_login ? element.last_login : ' - ',
              accStatus: element.account_status ? element.account_status : ' - ',
              plan: element.plan ? element.plan : ' - ',
              nextBilling: element.next_billing ? element.next_billing : ' - ',
              team: element.team_count,
              arn: element.arn_ria_count,
              logout: element.logout ? element.logout : ' - ',
              adminAdvisorId: element.admin_advisor_id,
              menu: ''
            })
          });
          this.dataSource.data = tableArray;
        }
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
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
  { adminName: '', email: '', mobile: '', usingSince: '', lastLogin: '', accStatus: '', plan: '', nextBilling: '', team: '', arn: '', logout: '', menu: '' },
  { adminName: '', email: '', mobile: '', usingSince: '', lastLogin: '', accStatus: '', plan: '', nextBilling: '', team: '', arn: '', logout: '', menu: '' },
  { adminName: '', email: '', mobile: '', usingSince: '', lastLogin: '', accStatus: '', plan: '', nextBilling: '', team: '', arn: '', logout: '', menu: '' },
]; 