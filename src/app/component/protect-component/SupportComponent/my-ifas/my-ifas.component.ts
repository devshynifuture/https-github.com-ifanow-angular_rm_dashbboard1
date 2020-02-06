import { Component, OnInit } from '@angular/core';
import { SupportService } from './../support.service';
import { IfasDetailsComponent } from './ifas-details/ifas-details.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';


@Component({
  selector: 'app-my-ifas',
  templateUrl: './my-ifas.component.html',
  styleUrls: ['./my-ifas.component.scss']
})


export class MyIfasComponent implements OnInit {
  isLoading = false;
  constructor(private supportService: SupportService, private subInjectService: SubscriptionInject) { }

  dataSource = ELEMENT_DATA;
  displayedColumns = ['adminName', 'email', 'mobile', 'usingSince', 'lastLogin', 'accStatus', 'plan', 'nextBilling', 'team', 'arn', 'logout', 'menu']


  ngOnInit() {

  }

  openDetailsComponent(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open70',
      componentName: IfasDetailsComponent
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