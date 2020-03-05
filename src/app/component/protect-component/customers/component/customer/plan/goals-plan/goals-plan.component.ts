import { Component, OnInit } from '@angular/core';

import { UtilService } from "../../../../../../../services/util.service";
import { SubscriptionInject } from "../../../../../AdviserComponent/Subscriptions/subscription-inject.service";
import { MfAllocationsComponent } from './mf-allocations/mf-allocations.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { AddGoalComponent } from './add-goal/add-goal.component';
import { KeyInfoComponent } from './key-info/key-info.component';
import { CalculatorsComponent } from './calculators/calculators.component';
import { AddGoalsComponent } from '../add-goals/add-goals.component';
import { EventService } from 'src/app/Data-service/event.service';
import { EditNoteGoalComponent } from './edit-note-goal/edit-note-goal.component';
import { ViewPastnotGoalComponent } from './view-pastnot-goal/view-pastnot-goal.component';
import { PlanService } from '../plan.service';

export interface PeriodicElement {
  position: string;
  name: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Fixed Deposit', name: 'Continue till maturity', weight: '13,000', symbol: '5,28,000' },
  { position: 'LIC Jeevan Saral', name: 'Pre close this asset', weight: '13,000', symbol: '5,28,000' },
];

@Component({
  selector: 'app-goals-plan',
  templateUrl: './goals-plan.component.html',
  styleUrls: ['./goals-plan.component.scss']
})
export class GoalsPlanComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService, 
    private plansService: PlanService) {
  }
  isLoading = false;
  ngOnInit() {
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource = ELEMENT_DATA;
  
  openAddgoals(data) {
    console.log('hello mf button clicked');
    const fragmentData = {
      flag: 'openAddgoals',
      id: 1,
      data,
      direction: 'top',
      componentName: AddGoalsComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  openInSideBar(data, flag) {
    let fragmentData = {
      flag: flag,
      id: 1,
      data,
      componentName: undefined,
      state: 'open'
    };

    switch (flag) {
      case 'openCalculators':
        fragmentData.componentName = CalculatorsComponent;
        break;
      case 'openPreferences':
        fragmentData.componentName = PreferencesComponent;
        fragmentData.state = 'open40';
        break;
      case 'openView':
        fragmentData.componentName = ViewPastnotGoalComponent;
        fragmentData.state = 'open35';
        break;
      case 'openEdit':
        fragmentData.componentName = EditNoteGoalComponent;
        fragmentData.state = 'open65';
        // fragmentData['popupHeaderText'] = '';
        break;
      case 'openKeyinfo':
        fragmentData.componentName = KeyInfoComponent;
        fragmentData.state = 'open25';
        break;
      case 'openallocations':
        fragmentData.componentName = AddGoalComponent;
        fragmentData.state = 'open25';
        break;
      case 'openMfAllocation':
        fragmentData.componentName = MfAllocationsComponent;
        fragmentData.state = 'open70';
        break;
      default:
        console.error('Undefiend flag found');
        return;
    }

    const subscription = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if(UtilService.isRefreshRequired(sideBarData)) {
            switch (flag) {
              case 'openCalculators':
                // TODO:- add the save data method and then show snackbar
                // sideBarData.data is the form value
                this.eventService.openSnackBar('Goal calculation added successfully', 'OK');
                break;
            }
          }
          subscription.unsubscribe();
        }
      });
  }
}


