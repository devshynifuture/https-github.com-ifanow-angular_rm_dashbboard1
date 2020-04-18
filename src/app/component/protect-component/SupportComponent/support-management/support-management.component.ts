import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { SupportService } from '../support.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { UtilService } from 'src/app/services/util.service';
import { IfasDetailsComponent } from '../my-ifas/ifas-details/ifas-details.component';

@Component({
  selector: 'app-support-management',
  templateUrl: './support-management.component.html',
  styleUrls: ['./support-management.component.scss']
})
export class SupportManagementComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  constructor(
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    private eventService: EventService,
    public utilsService: UtilService,
  ) { }

  dataSource = new MatTableDataSource([{}, {}, {}]);
  displayedColumns = ['adminName', 'email', 'mobile', 'plan', 'nextBilling', 'menu']

  ngOnInit() {
    this.utilsService.loader(0);
    this.dataSource.sort = this.sort;
    this.getMyIfasList();
  }

  getMyIfasList() {
    let obj = {};
    this.utilsService.loader(1);
    this.supportService.getMyIFAValues(obj).subscribe(
      data => {
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
        this.utilsService.loader(-1);
      },
      err => {
        this.utilsService.loader(-1);
        this.eventService.openSnackBar(err, "Dismiss")
      }
    )
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