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
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import * as Highcharts from 'highcharts';
import { MatDialog } from '@angular/material';

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
  selectedGoal:any = {};
  allGoals: any[] = [];

  // options set for bar charts
  // Reference - https://api.highcharts.com/highcharts/
  options: any = {
    chart: {
      type: 'bar',
      height: 200
    },
    plotOptions: {
      bar: {
          dataLabels: {
              enabled: true,
              align: 'left',
              inside: false
          }
      }
    },
    credits: {
        enabled: false
    },
    title: {
      text: 'Monthly Bar Chart'
    },
    xAxis: {
        type: 'category',
        lineWidth: 0,
        tickWidth: 0
    },
    yAxis:{
      visible: false
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [{
        data: [{
            y: 123,
            name: 'Gabriel',
            color: 'green'
        }, {
            y: 60,
            name: 'Marie',
            color: 'blue'
        }, {
            y: 43,
            name: 'Adam',
            color: 'yellow'
        }, {
            y: 55,
            name: 'Camille',
            color: 'red'
        }],
    }]
  }

  // options set for donut chart
  // TODO:- remove 'series' legend from the tooltip
  donutOptions:any = {
    chart: {
        type: 'pie',
        height: 170
    },
    title: {
      text: ''
    },
    credits: {
        enabled: false
    },
    yAxis: {
        title: {
            text: 'Total percent market share'
        }
    },
    plotOptions: {
        pie: {
            shadow: false
        }
    },
    legend:{
      floating: true,
    },
    series: [{
        data: [["Loan Amt",6],["Down Amt",4]],
        size: '100%',
        innerSize: '55%',
        showInLegend:true,
        dataLabels: {
            enabled: false
        }
    }]
}

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
    // TODO:- implement loader fundtion
    this.loadAllGoals();
  }

  // load all goals created for the client and select the first goal
  loadAllGoals(){
    this.plansService.getAllGoals(this.advisor_client_id).subscribe((data)=>{
      if (data) {
        setTimeout(() => {
          this.allGoals = data.map(goal => this.mapGoalDashboardData(goal));
          // let dom render first
          this.loadSelectedGoalData(this.allGoals[0]);
        });
      }
    }, err => this.eventService.openSnackBar(err, "Dismiss"))
  }

  mapGoalDashboardData(goal:any) {
    let mapData:any = {};

    /**
     * TODO:- need to correct the logics for the following
     * 1. goal progress
     * 2. achieved value -- fix on html as well
     * 3. image for multi year goal
     */

    mapData.id = goal.id;
    mapData.goalType = goal.goalType;
    if(goal.singleOrMulti == 1) {
      const goalSubData = goal.singleGoalModel;
      mapData.img = goalSubData.imageUrl;
      mapData.year = (new Date(goalSubData.goalStartDate).getFullYear()) + ' - ' + (new Date(goalSubData.goalStartDate).getFullYear());
      mapData.goalName = goalSubData.goalName;
      mapData.gv = goalSubData.goalFV;
      mapData.achievedValue = goalSubData.achievedValue;
      mapData.dashboardData = {
        goalYear: new Date(goalSubData.goalStartDate).getFullYear(),
        presentValue: goalSubData.goalPresentValue,
        futureValue: goalSubData.goalFV,
        equity_monthly: goalSubData.equitySipAmount || 0,
        debt_monthly: goalSubData.debtSipAmount || 0,
        lump_equity: goalSubData.lumpsumEquityReqOnSSD || 0,
        lump_debt: goalSubData.lumpsumDebtReqOnSSD || 0,
        goalProgress: (goalSubData.achievedValue / goalSubData.goalFV * 100),
      }
      mapData.remainingData = goalSubData;
    } else {
      const goalSubData:any = goal.multiYearGoalPlan;
      mapData.img = goalSubData.imageUrl;
      mapData.year = (new Date(goalSubData.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalSubData.differentGoalYears[goalSubData.differentGoalYears.length -1]).getFullYear());
      mapData.goalName = goalSubData.name;
      mapData.gv = goalSubData.futureValue;
      mapData.achievedValue = goalSubData.achievedValue;
      mapData.dashboardData = {
        goalYear: new Date(goalSubData.goalEndDate || goalSubData.vacationEndYr).getFullYear(),
        presentValue: goalSubData.presentValue,
        futureValue: goalSubData.futureValue,
        equity_monthly: this.getSumOfJsonMap(goalSubData.sipAmoutEquity),
        debt_monthly: this.getSumOfJsonMap(goalSubData.sipAmoutDebt),
        lump_equity: this.getSumOfJsonMap(goalSubData.lumpSumAmountEquity),
        lump_debt: this.getSumOfJsonMap(goalSubData.lumpSumAmountDebt),
        goalProgress: (goalSubData.achievedValue / goalSubData.futureValue * 100),
      }
      mapData.remainingData = goalSubData;
    }
    return mapData;
  }

  getSumOfJsonMap(json:Object = {}) {
    let sum = 0;
    for(let k in json) {
      if(json.hasOwnProperty(k)) {
        sum+=json[k];
      }
    }
    return sum;
  }

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
      data: this.selectedGoal,
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

        // TODO:- remove .data as its for demo purpose only
        fragmentData.data = this.selectedGoal.dashboardData;
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
    Highcharts.chart('monthly-chart-container', this.options);
    Highcharts.chart('lumpsum-chart-container', this.options);
    Highcharts.chart('donut-chart-container', this.donutOptions);
  }

  deleteGoal() {
    const dialogData = {
      header: 'DELETE',
      body: 'Are you sure you want to delete this goal?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let deleteObj = {
          goalId: this.selectedGoal.id,
          goalType: this.selectedGoal.goalType
        }
        this.plansService.deleteGoal(deleteObj).subscribe((data)=>{
          this.eventService.openSnackBar("Goal has been deleted successfully", "Dismiss");
          this.allGoals = [];
          this.loadAllGoals();
          dialogRef.close()
        }, (err) => { this.eventService.openSnackBar(err, "Dismiss") })
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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


