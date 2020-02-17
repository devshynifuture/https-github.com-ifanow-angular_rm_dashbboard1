import { Component, OnInit, ViewChild } from '@angular/core';
import { IfaBoardingHistoryComponent } from './ifa-boarding-history/ifa-boarding-history.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-ifa-onboarding',
  templateUrl: './ifa-onboarding.component.html',
  styleUrls: ['./ifa-onboarding.component.scss']
})
export class IfaOnboardingComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoading = false;


  constructor(private subInjectService: SubscriptionInject) { }

  dataSource = ELEMENT_DATA;
  displayedColumns = ['adminName', 'email', 'mobile', 'rmName', 'stage', 'usingSince', 'plan', 'team', 'arn', 'menu']

  ngOnInit() {
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
      componentName: IfaBoardingHistoryComponent
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
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },
  { adminName: 'Sonesh Dedhia', email: 'sonesh.dedhia@manek.com', mobile: 9322574914, rmName: 'Nita Shinde', stage: 'Auto forward setup', usingSince: '7 Days', plan: 'Power + WL + OT', team: '3', arn: '1', menu: '' },

];
