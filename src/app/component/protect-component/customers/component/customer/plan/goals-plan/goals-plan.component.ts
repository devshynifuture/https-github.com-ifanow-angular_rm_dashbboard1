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
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth-service/authService';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';

export interface PeriodicElement {
  position: string;
  name: string;
  weight: string;
  symbol: string;
}

@Component({
  selector: 'app-goals-plan',
  templateUrl: './goals-plan.component.html',
  styleUrls: ['./goals-plan.component.scss']
})
export class GoalsPlanComponent implements OnInit {
  clientFamily:any[];

  isLoading = false;
  advisor_client_id: any = {
    advisorId:'',
    clientId:''
  }
  dashboardData: any;
  selectedGoal:any;
  allGoals: any[] = [
    {
      goalName: 'Shreya’s higher education',
      gv: 4813000,
      year: '2030 - 2033',
      img: '/assets/images/svg/higher-edu.svg',
      dummyDashBoardData: {
        goalYear: 2025,
        presentValue: 24325,
        futureValue: 456543,
        equity_monthly: 5200,
        debt_monthly: 44553,
        lump_equity: 45232,
        lump_debt: 35452,
        goalProgress: 20,
      }
    },
    {
      goalName: 'House',
      gv: 10000000,
      year: '2033',
      img: '/assets/images/svg/house-goals.svg',
      dummyDashBoardData: {
        goalYear: 2025,
        presentValue: 24325,
        futureValue: 456543,
        equity_monthly: 5200,
        debt_monthly: 44553,
        lump_equity: 45232,
        lump_debt: 35452,
        goalProgress: 20,
      }
    },
    {
      goalName: 'Rahul’s retirement',
      gv: 45522000,
      year: '2030 - 2033',
      img: '/assets/images/svg/retierment-goals.svg',
      dummyDashBoardData: {
        goalYear: 2025,
        presentValue: 24325,
        futureValue: 456543,
        equity_monthly: 5200,
        debt_monthly: 44553,
        lump_equity: 45232,
        lump_debt: 35452,
        goalProgress: 20,
      }
    },
    {
      goalName: 'Aryan’s marriage',
      gv: 4813000,
      year: '2030 - 2033',
      img: '/assets/images/svg/higher-edu.svg',
      dummyDashBoardData: {
        goalYear: 2025,
        presentValue: 24325,
        futureValue: 456543,
        equity_monthly: 5200,
        debt_monthly: 44553,
        lump_equity: 45232,
        lump_debt: 35452,
        goalProgress: 20,
      }
    },
  ];

  constructor(
    private subInjectService: SubscriptionInject, 
    private eventService: EventService, 
    private plansService: PlanService,
    private dialog: MatDialog,
  ) {
    this.advisor_client_id.advisorId = AuthService.getAdvisorId();
    this.advisor_client_id.clientId = AuthService.getClientId();
  }


  ngOnInit() {
    this.loadAllGoals();
    // this.loadGlobalAPIs();
    this.selectedGoal = this.allGoals[0];
  }

  // load all goals created for the client and select the
  loadAllGoals(){
    this.plansService.getAllGoals(this.advisor_client_id).subscribe((data)=>{
      // this.allGoals = data || [];
      this.loadSelectedGoalData(this.allGoals[0]);
      console.log(data);
    }, err => this.eventService.openSnackBar(err, "Dismiss"))
  }

  // loads all the global data required for various components called from here
  loadGlobalAPIs(){
    this.plansService.getListOfFamilyByClient(this.advisor_client_id).subscribe((data)=>{
      this.clientFamily = data.familyMembersList.sort((a, b) => {
        return a.relationshipId - b.relationshipId;
      });
    }, (err) => {this.eventService.openSnackBar(err, "Dismiss")});
  }

  openAddgoals() {
    let data = {}
    const fragmentData = {
      flag: 'openAddgoals',
      id: 1,
      data: data,
      direction: 'top',
      componentName: AddGoalsComponent,
      state: 'open'
    };

    this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isRefreshRequired(upperSliderData)) {
          this.loadAllGoals();
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
        fragmentData['popupHeaderText'] = 'CALCULATORS - NEW HOUSE 2035';
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

        // TODO:- remove .data as its for demo purpose only
        fragmentData.data = this.selectedGoal.dummyDashBoardData;
        break;
      case 'openallocations':
        fragmentData.componentName = AddGoalComponent;
        fragmentData.data = this.clientFamily;
        fragmentData['isOverlayVisible'] = false;
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

  loadSelectedGoalData(goalData) {
    this.selectedGoal = goalData;
  }

  deleteGoal(goal) {
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let deleteObj = {
          goalId: goal.id,
        }
        this.plansService.deleteGoal(deleteObj).subscribe((data)=>{
          this.eventService.openSnackBar("Goal has been deleted successfully", "Dismiss");
        }, (err) => { this.eventService.openSnackBar(err, "Dismiss") })
      }
    };

    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }

  // drag drop for assets brought from allocations tab
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  // dummy for allocation dragdrop list
  todo:any[] = [];
  logger(event) {
    console.log('s')
  }
}


