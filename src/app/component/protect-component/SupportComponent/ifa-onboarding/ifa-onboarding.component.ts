import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderHistoricalFileComponent } from './../order-historical-file/order-historical-file.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SupportService } from '../support.service';
import { EventService } from '../../../../Data-service/event.service';

@Component({
  selector: 'app-ifa-onboarding',
  templateUrl: './ifa-onboarding.component.html',
  styleUrls: ['./ifa-onboarding.component.scss']
})
export class IfaOnboardingComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;
  stagesArray: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private supportService: SupportService,
    private eventService: EventService
  ) { }

  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  displayedColumns = ['adminName', 'email', 'mobile', 'rmName', 'stage', 'usingSince', 'plan', 'team', 'arn', 'menu']

  ngOnInit() {
    this.getStagesFromBackend();

  }

  getStagesFromBackend() {
    this.isLoading = true;
    this.supportService.getOnboardingTaskGlobal({})
      .subscribe(data => {
        if (data) {
          this.stagesArray = data;
          console.log("stages array::", data);
          this.getMyIfaDetail();
        }
      },
        err => this.eventService.openSnackBar(err, "DISMISS")
      )
  }

  getMyIfaDetail() {
    let obj = {};
    this.supportService.getMyIFAValues(obj).subscribe(
      data => {
        console.log(data);
        if (data && data.length !== 0) {
          this.isLoading = false;
          let tableArray = [];
          data.forEach((element, index) => {
            tableArray.push({
              adminName: element.name,
              email: element.email_id,
              mobile: element.mobile_number,
              rmName: element.rm_name ? element.rm_name : ' - ',
              stage: element.task_id ? this.getStageName(element.task_id) : '-',
              usingSince: element.using_since_year + "Y " + element.using_since_month + "M",
              plan: element.plan ? element.plan : ' - ',
              team: element.team_count,
              arn: element.arn_ria_count,
              menu: '',
              advisorId: element.admin_advisor_id,
            })
          });
          this.dataSource.data = tableArray;
          this.isLoading = false;
        }
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }

  getStageName(id) {
    for (let index = 0; index < this.stagesArray.length; index++) {
      const element = this.stagesArray[index];
      if (id === element.id) {
        return element.name;
      }
    }
  }

  someFunction() {
    console.log("this is some function")
  }


  openIfaHistory(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: OrderHistoricalFileComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }



  openAdminDetails(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: AdminDetailsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }





}


const ELEMENT_DATA = [
  { adminName: '', email: '', mobile: '', rmName: '', stage: '', usingSince: '', plan: '', team: '', arn: '', menu: '' },
  { adminName: '', email: '', mobile: '', rmName: '', stage: '', usingSince: '', plan: '', team: '', arn: '', menu: '' },
  { adminName: '', email: '', mobile: '', rmName: '', stage: '', usingSince: '', plan: '', team: '', arn: '', menu: '' },
];
