import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { UtilService, LoaderFunction } from "../../../../../../../services/util.service";
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
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/auth-service/authService';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import * as Highcharts from 'highcharts';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { P } from '@angular/cdk/keycodes';
import { Subscriber, Subscription, Subject, forkJoin } from 'rxjs';
import { AddGoalService } from './add-goal/add-goal.service';
import { ReallocateAssetComponent } from './reallocate-asset/reallocate-asset.component';



@Component({
  selector: 'app-goals-plan',
  templateUrl: './goals-plan.component.html',
  styleUrls: ['./goals-plan.component.scss'],
  providers: [LoaderFunction]
})
export class GoalsPlanComponent implements OnInit, OnDestroy {
  displayedColumns = ['goalYear', 'goalFv', 'goalFvAllocated', 'status'];
  clientFamily: any[];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  isRetirementTab = false;
  isLoading = true;
  advisor_client_id: any = {
    advisorId: '',
    clientId: ''
  }
  otherAssetAllocationSubscription:Subscription;
  selectedGoal: any = {};
  allGoals: any[] = [];
  allAssets:any[] = [];
  hasCostOfDelay: boolean = false;
  inDropZone:boolean = false;

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
      text: ''
    },
    xAxis: {
      type: 'category',
      lineWidth: 0,
      tickWidth: 0
    },
    yAxis: {
      visible: false
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [{ data: [] }]
  }

  // options set for donut chart
  // TODO:- remove 'series' legend from the tooltip
  donutOptions = {
    chart: {
      type: 'pie',
      height: 170
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: ' <b>{point.percentage:.1f}%</b>'
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    plotOptions: {
      pie: {
        shadow: false
      }
    },
    legend: {
      floating: false,
    },
    series: []
  }
  allocatedList:Array<any> = [];
  assetError = false;
  selectedGoalId:any = null;
  subscriber = new Subscriber();

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private plansService: PlanService,
    private dialog: MatDialog,
    private allocateOtherAssetService: AddGoalService,
    public loaderFn: LoaderFunction
  ) {
    this.advisor_client_id.advisorId = AuthService.getAdvisorId();
    this.advisor_client_id.clientId = AuthService.getClientId();
  }
  
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {
    this.subscriber.add(
      this.allocateOtherAssetService.refreshObservable.subscribe(() => {
        this.loadAllGoals();
      })
    );
    this.loadAllAssets();
    this.loadAllGoals();
    this.loaderFn.setFunctionToExeOnZero(this, this.afterDataLoadMethod);
  }

  // load all goals created for the client and select the first goal
  loadAllGoals() {``
    this.allGoals = [{}, {}, {}];
    this.loaderFn.increaseCounter();
    this.selectedGoal = {};
    this.plansService.getAllGoals(this.advisor_client_id).subscribe((data: any[]) => {
      if (data) {
        this.allGoals = data
      } else {
        this.allGoals = [];
      }
      this.loaderFn.decreaseCounter();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.loaderFn.decreaseCounter();
    });
  }

  loadAllAssets(){
    const otherAssets = this.plansService.getAssetsForAllocation(this.advisor_client_id);
    const mfAssets = this.plansService.getMFList(this.advisor_client_id);

    this.loaderFn.increaseCounter();
    forkJoin(otherAssets, mfAssets).subscribe(result => {
      let otherAssetRes = result[1].map(asset => {
        let absAllocation = 0;
        if(asset.goalAssetMapping) {
          asset.goalAssetMapping.forEach(element => {
            if(absAllocation <= 99){
              absAllocation += element.percentAllocated;
            }else{
              this.eventService.openSnackBar('Asset allocation already 100%', "Dismiss")
            }
          });
        }
        return {absAllocation, ...asset};
      });

      let mfAssetRes = result[1].map(mf => {
        let absAllocation = 0;
        if(mf.goalAssetMapping.length > 0) {
          mf.goalAssetMapping.forEach(element => {
            if(absAllocation <= 99){
              absAllocation += element.percentAllocated;
            }else{
              this.eventService.openSnackBar('Asset allocation already 100%', "Dismiss")
            }
          });
        }
        return {absAllocation, ...mf};
      })

      this.allAssets = [...otherAssetRes, ...mfAssetRes];
      this.loaderFn.decreaseCounter();
    }, err => {
      console.error(err)
      this.assetError = true;
      this.loaderFn.decreaseCounter();
    })
  }


  // create loan and cost of delay charts
  createChart(res) {
    const colors = ['green', 'blue', 'yellow', 'red'];
    const costDelay: Object = res.remainingData.costDelay;
    if (costDelay && costDelay.hasOwnProperty(0)) {
      this.hasCostOfDelay = true;
    } else {
      this.hasCostOfDelay = false;
      return;
    }

    let lumpsumSeries = JSON.parse(JSON.stringify(this.options));
    let sipSeries = JSON.parse(JSON.stringify(this.options));
    let count = 0;
    for (let k in costDelay) {
      if (costDelay.hasOwnProperty(k)) {
        lumpsumSeries.series[0].data.push({
          y: Math.round(costDelay[k].lumpsum_total),
          name: k + ' years',
          color: colors[count],
        })
        sipSeries.series[0].data.push({
          y: Math.round(costDelay[k].sip_total),
          name: k + ' years',
          color: colors[count]
        })
        count++;
      }
    }
    Highcharts.chart('monthly-chart-container-main', sipSeries);
    Highcharts.chart('lumpsum-chart-container-main', lumpsumSeries);

    if (res.remainingData.loan) {
      const loan = res.remainingData.loan;
      const chart = {
        data: [["Loan Amt", parseInt(loan.loanAmount)], ["Down Amt", parseInt(loan.downPayment)]],
        size: '100%',
        innerSize: '55%',
        showInLegend: true,
        dataLabels: {
          enabled: false
        }
      }
      this.donutOptions.series = [chart];
      Highcharts.chart('donut-chart-container', this.donutOptions);
    }
  }

  afterDataLoadMethod(){
    this.allGoals = this.allGoals.reverse().map(goal => this.mapGoalDashboardData(goal));
    if(this.selectedGoalId) {
      this.loadSelectedGoalData(this.allGoals.find(goal => goal.remainingData.id == this.selectedGoalId));
    } else {
      if(this.allGoals.length > 0) {
        this.loadSelectedGoalData(this.allGoals[0]);
      } else {
        this.selectedGoalId = null;
        this.selectedGoal = {};
      }
    }
  }

  // create json which is used on dashboard and other areas
  mapGoalDashboardData(goal: any) {
    let mapData: any = {};

    mapData.id = goal.id;
    mapData.goalType = goal.goalType;
    mapData.singleOrMulti = goal.singleOrMulti;
    mapData.goalAssetAllocation = goal.goalAssetAllocation;
    if (goal.singleOrMulti == 1) {
      const goalSubData = goal.singleGoalModel;
      mapData.img = goalSubData.imageUrl;
      mapData.year = (new Date(goalSubData.goalStartDate).getFullYear()).toString();
      mapData.goalName = goalSubData.goalName;
      mapData.gv = goalSubData.goalFV;
      mapData.goalStartDate = goalSubData.goalStartDate;
      mapData.goalEndDate = goalSubData.goalStartDate; // because start hote hi khatam ho gaya
      mapData.dashboardData = {
        goalYear: new Date(goalSubData.goalStartDate).getFullYear(),
        presentValue: goalSubData.goalPresentValue,
        futureValue: goalSubData.goalFV,
        equity_monthly: this.getSumOfJsonMap(goalSubData.sipAmountEquity) || 0,
        debt_monthly: this.getSumOfJsonMap(goalSubData.sipAmountDebt) || 0,
        lump_equity: this.getSumOfJsonMap(goalSubData.lumpSumAmountEquity) || 0,
        lump_debt: this.getSumOfJsonMap(goalSubData.lumpSumAmountDebt) || 0,
        goalProgress: goalSubData.goalAchievedPercentage,
        achievedValue: goalSubData.achievedValue
      }
      mapData.remainingData = goalSubData;
      mapData.remainingData.differentGoalYears = [goalSubData.goalStartDate];
    } else {
      const goalSubData: any = goal.multiYearGoalPlan;
      mapData.img = goalSubData.imageUrl;
      mapData.year = (new Date(goalSubData.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalSubData.differentGoalYears[goalSubData.differentGoalYears.length - 1]).getFullYear());
      mapData.goalName = goalSubData.name;
      mapData.gv = goalSubData.futureValue;
      mapData.goalStartDate = goalSubData.differentGoalYears[0];
      mapData.goalEndDate = goalSubData.differentGoalYears[goalSubData.differentGoalYears.length - 1];
      mapData.dashboardData = {
        goalYear: new Date(goalSubData.goalEndDate || goalSubData.vacationEndYr).getFullYear(),
        presentValue: goalSubData.presentValue,
        futureValue: goalSubData.futureValue,
        equity_monthly: this.getSumOfJsonMap(goalSubData.sipAmountEquity),
        debt_monthly: this.getSumOfJsonMap(goalSubData.sipAmountDebt),
        lump_equity: this.getSumOfJsonMap(goalSubData.lumpSumAmountEquity),
        lump_debt: this.getSumOfJsonMap(goalSubData.lumpSumAmountDebt),
        goalProgress: goalSubData.goalAchievedPercentage,
        achievedValue: goalSubData.achievedValue
      }
      mapData.remainingData = goalSubData;
    }
    return mapData;
  }

  getSumOfJsonMap(json: Object = {}) {
    let sum = 0;
    for (let k in json) {
      if (json.hasOwnProperty(k)) {
        sum += json[k];
      }
    }
    return sum;
  }

  loadGlobalAPIs() {
    this.plansService.getListOfFamilyByClient(this.advisor_client_id).subscribe((data) => {
      this.clientFamily = data.familyMembersList.sort((a, b) => {
        return a.relationshipId - b.relationshipId;
      });
    }, (err) => { this.eventService.openSnackBar(err, "Dismiss") });
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

    const sub = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isRefreshRequired(upperSliderData)) {
          this.selectedGoalId = null;
          this.loadAllGoals();
          sub.unsubscribe();
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
        break;
      case 'openKeyinfo':
        fragmentData.componentName = KeyInfoComponent;
        fragmentData.state = 'open25';
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
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.loadAllGoals();
        }
        subscription.unsubscribe();
      }
    });
    if(flag == 'openallocations') {
      this.otherAssetAllocationSubscription = subscription
    }
  }

  loadSelectedGoalData(goalData) {
    this.allocatedList = goalData.goalAssetAllocation.map(asset => {
      let assetObj = this.allAssets.find(allasset => allasset.assetId == asset.assetId && allasset.assetType == asset.assetType) || {};
      return {
        ...assetObj,
        ...asset
      }
    });
    console.log('allocatedList',this.allocatedList)
    this.selectedGoal = goalData;
    this.selectedGoalId = goalData.remainingData.id;
    if(goalData.remainingData.retirementTableValue){
      this.isRetirementTab =true;
      let goalTableData =  goalData.remainingData.retirementTableValue;
      goalTableData.forEach(element => {
          element.goalYear = new Date(element.goalStartDate).getFullYear()
      });
    }else{
      this.isRetirementTab =false;
    }
    this.dataSource = goalData.remainingData.retirementTableValue ? goalData.remainingData.retirementTableValue : [];
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.createChart(this.selectedGoal);
    }, 100);
  }

  deleteGoal() {
    const dialogData = {
      header: 'UNALLOCATE ASSET',
      body: 'Are you sure you want to delete this goal?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNALLOCATE',
      positiveMethod: () => {
        let deleteObj = {
          goalId: this.selectedGoal.id,
          goalType: this.selectedGoal.goalType
        }
        this.plansService.deleteGoal(deleteObj).subscribe((data) => {
          this.eventService.openSnackBar("Goal has been deleted successfully", "Dismiss");
          this.allGoals = this.allGoals.filter(goal => goal.remainingData.id != this.selectedGoalId);
          this.selectedGoalId = null;
          if(this.allGoals.length > 0) {
            this.loadSelectedGoalData(this.allGoals[0]);
          } else {
            this.selectedGoal = {};
          }
          // update asset list if user deletes goal and the list is still open
          this.allocateOtherAssetService.refreshAssetList.next();
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
    if(event.previousContainer === event.container || !event.isPointerOverContainer) {
      return;
    }
    this.allocateOtherAssetService.allocateOtherAssetToGoal(event, this.advisor_client_id, this.selectedGoal);
  }

  removeAllocation(allocation) {
    const dialogData = {
      header: 'UNALLOCATE ASSET',
      body: 'Are you sure you want to remove allocation?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNALLOCATE',
      positiveMethod: () => {
        let obj = {
          ...this.advisor_client_id,
          id: allocation.id,
          assetId: allocation.assetId,
          assetType: allocation.assetType,
          goalId: this.selectedGoal.remainingData.id,
          goalType: this.selectedGoal.goalType,
          percentAllocated: 0
        }
        this.plansService.allocateOtherAssetToGoal(obj).subscribe(res => {
          const assetIndex =  this.allocatedList.findIndex((asset) => asset.assetId == allocation.assetId);
          this.allocatedList.splice(assetIndex, 1);
          // update asset list if user deletes goal and the list is still open
          this.allocateOtherAssetService.refreshAssetList.next();
          this.eventService.openSnackBar("Asset unallocated");
          dialogRef.close();
        }, err => {
          this.eventService.openSnackBar(err);
        })
      }
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }

  reallocateAsset(allocation){
    const dialogData = {
      goalData: this.selectedGoal,
      allocationData: allocation,
    }
    this.dialog.open(ReallocateAssetComponent, {
      width: '600px',
      height: '400px',
      data: dialogData,
      autoFocus: false,
    });
  }

  inDropZoneMethod(e) {
    console.log(e, 'dz method')
  }

  ngOnDestroy(){
    this.subInjectService.closeNewRightSlider({state: 'close'});
    if(this.otherAssetAllocationSubscription) {
      this.otherAssetAllocationSubscription.unsubscribe();
    }
    this.subscriber.unsubscribe();
  }
}


