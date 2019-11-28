import {Component, OnInit} from '@angular/core';

import {UtilService} from "../../../../../../../services/util.service";
import {SubscriptionInject} from "../../../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { AddGoalComponent } from './add-goal/add-goal.component';

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

  openAddGoal(data) {
    const fragmentData = {
      flag: 'addGoal',
      componentName: AddGoalComponent,
      data,
      id: 1,
      state: 'open'
    };
    this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        /*   console.log('this is sidebardata in subs subs : ', sideBarData);
           if (UtilService.isDialogClose(sideBarData)) {
             console.log('this is sidebardata in subs subs 2: ', sideBarData);
             rightSideDataSub.unsubscribe();

           }*/
      }
    );
  }

  getComponentJson(flag, data, componentName) {
    const fragmentData = {
      flag,
      componentName,
      data,
      id: 1,
      state: 'open'
    };
    return fragmentData;
  }
}
