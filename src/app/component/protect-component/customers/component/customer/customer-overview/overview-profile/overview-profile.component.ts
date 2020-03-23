import { Component, OnInit } from '@angular/core';
import { AddFamilyMemberComponent } from './add-family-member/add-family-member.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { HistoryViewComponent } from './history-view/history-view.component';
import { AddClientComponent } from 'src/app/component/protect-component/PeopleComponent/people/Component/people-clients/add-client/add-client.component';

@Component({
  selector: 'app-overview-profile',
  templateUrl: './overview-profile.component.html',
  styleUrls: ['./overview-profile.component.scss']
})
export class OverviewProfileComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  familyMemberList = [
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
    { name: "Harish", type: 'spouse', age: 35 },
  ]
  open(value, data) {
    let component;
    if (value == 'add') {
      component = AddFamilyMemberComponent;
      (data == null) ? data = { flag: 'Add Family Member', fieldFlag: 'familyMember' } : '';
    }
    else {
      (data == null) ? data = { flag: 'Add Family Member', fieldFlag: 'familyMember' } : '';
      component = AddClientComponent;
    }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: component,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }


  openHistory(value, data) {

    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open35',
      componentName: HistoryViewComponent,

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }




}
