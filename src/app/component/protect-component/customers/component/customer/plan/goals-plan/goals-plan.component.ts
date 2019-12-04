import {Component, OnInit} from '@angular/core';

import {UtilService} from "../../../../../../../services/util.service";
import {SubscriptionInject} from "../../../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { MfAllocationsComponent } from './mf-allocations/mf-allocations.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { KeyInfoComponent } from './key-info/key-info.component';

export interface PeriodicElement {
  position: string;
  name: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Fixed Deposit', name: 'Continue till maturity', weight: '13,000', symbol: '5,28,000'},
  {position: 'LIC Jeevan Saral', name: 'Pre close this asset', weight: '13,000', symbol: '5,28,000'},
];

@Component({
  selector: 'app-goals-plan',
  templateUrl: './goals-plan.component.html',
  styleUrls: ['./goals-plan.component.scss']
})
export class GoalsPlanComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource = ELEMENT_DATA;
  
  openMfAllocation(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openMfAllocation',
      data,
      componentName: MfAllocationsComponent, 
      id: 1,
      state: 'open70'
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
  openPreferences(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openPreferences',
      data,
      componentName: PreferencesComponent, 
      id: 1,
      state: 'open40'
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
  openallocations(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openallocations',
      data,
      componentName: AddGoalComponent, 
      id: 1,
      state: 'open25'
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
  openKeyinfo(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openKeyinfo',
      data,
      componentName: KeyInfoComponent, 
      id: 1,
      state: 'open50'
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
}

