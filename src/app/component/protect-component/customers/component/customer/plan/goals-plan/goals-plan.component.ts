import { Component, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';

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
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { P } from '@angular/cdk/keycodes';
import { Subscriber, Subscription, Subject, forkJoin } from 'rxjs';
import { AddGoalService } from './add-goal/add-goal.service';
import { ReallocateAssetComponent } from './reallocate-asset/reallocate-asset.component';
import { element } from 'protractor';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { Output } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs-compat/operator/map';
import { RoleService } from 'src/app/auth-service/role.service';
import { OpenGalleryPlanComponent } from 'src/app/component/protect-component/AdviserComponent/setting/setting-plan/setting-plan/plan-gallery/open-gallery-plan/open-gallery-plan.component';



@Component({
  selector: 'app-goals-plan',
  templateUrl: './goals-plan.component.html',
  styleUrls: ['./goals-plan.component.scss'],
  providers: [LoaderFunction]
})
export class GoalsPlanComponent implements OnInit, OnDestroy {
  displayedColumns = ['goalYear', 'goalFv', 'status', 'percentage'];
  displayedColumns1 = ['select', 'milestone', 'amount', 'fv', 'icons'];
  clientFamily: any[];
  dataSource = ([{}, {}, {}]);
  dataSource1 = [];
  isRetirementTab = false;
  isLoading = true;
  advisor_client_id: any = {
    advisorId: '',
    clientId: ''
  }
  otherAssetAllocationSubscription: Subscription;
  selectedGoal: any = {};
  allGoals: any[] = [];
  allAssets: any[] = [];
  hasCostOfDelay: boolean = false;
  inDropZone: boolean = false;

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
  allocatedList: Array<any> = [];
  assetError = false;
  selectedGoalId: any = null;
  subscriber = new Subscriber();
  highlight: boolean = false;
  singleGoalData = {
    goalName: '', goal: '', goalType: 0,
    details: '', value: '', month: '', lumpsum: '', img: '', year: '', remainingData: { notes: '' }, dashboardData: { arr_lump_equity: [], arr_lump_debt: [], arr_debt_monthly: [], arr_equity_monthly: [], arr_goalYrAndFutValues: [], key_arr_equity_monthly: [], presentValue: 0, goalProgress: 0, achievedValue: 0, futureValue: 0, debt_monthly: {}, lump_equity: {}, equity_monthly: {}, lump_debt: {} },
    goalFV: '', achievedValue: '', equity_monthly: '', debt_monthly: '', lump_equity: '', lump_debt: '',
    goalAssetAllocation: '', retirementTableValue: '', percentCompleted: ''
  };
  isLoadingGoals: boolean;
  goalList: any;
  fragmentData: any;
  dataSource3: any;
  clientData: any;
  getOrgData: any;
  details: any;
  defaultGallery: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private UtilService: UtilService,
    private eventService: EventService,
    private plansService: PlanService,
    private dialog: MatDialog,
    private allocateOtherAssetService: AddGoalService,
    private cd: ChangeDetectorRef,
    public loaderFn: LoaderFunction,
    public roleService: RoleService,
    public authService: AuthService,
  ) {
    this.advisor_client_id.advisorId = AuthService.getAdvisorId();
    this.advisor_client_id.clientId = AuthService.getClientId();
    this.clientData = AuthService.getClientData();
    this.details = AuthService.getProfileDetails();
    this.getOrgData = AuthService.getOrgDetails();
    console.log('isAdvisor', authService.isAdvisor())
  }

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator;
  @ViewChild('summaryTemplateHeader', { static: false }) summaryTemplateHeader: any;
  @ViewChild('summaryPlan', { static: false }) summaryPlan: any;
  @Output() loaded = new EventEmitter();

  @Input() finPlanObj: any;//finacial plan pdf input
  ngOnInit() {
    if (this.finPlanObj && this.finPlanObj.sectionName) {
      this.selectedGoal = this.finPlanObj.selectionName
    }
    this.fragmentData = { isSpinner: false };
    this.dataSource1 = [];
    //this.dataSource.data = [];
    this.subscriber.add(
      this.allocateOtherAssetService.refreshObservable.subscribe(() => {
        this.loadAllGoals(false);
      })
    );
    //this.loadAllAssets();
    this.loadAllGoals(false);
    this.loaderFn.setFunctionToExeOnZero(this, this.afterDataLoadMethod);
  }

  // load all goals created for the client and select the first goal
  generatePdf(data) {
    this.fragmentData = {}
    this.fragmentData.isSpinner = true;;
    let para = document.getElementById('planSummary');
    //const header = this.summaryTemplateHeader.nativeElement.innerHTML
    this.UtilService.htmlToPdf('', para.innerHTML, 'Financial plan', false, this.fragmentData, '', '', false);

  }
  loadAllGoals(flag) {
    this.isLoading = true;
    this.allGoals = [{}, {}, {}];
    this.loaderFn.increaseCounter();
    this.selectedGoal = {};
    this.dataSource3 = new MatTableDataSource(ELEMENT_DATA);
    this.plansService.getAllGoals(this.advisor_client_id).subscribe((data: any[]) => {
      if (data) {
        this.allGoals = data
        if (flag == true) {
          this.loadAllGoals(false)
        }
      } else {
        this.allGoals = [];
      }
      this.isLoading = false;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.loaderFn.decreaseCounter();
    });
  }

  loadAllAssets() {
    const otherAssets = this.plansService.getAssetsForAllocation(this.advisor_client_id);
    const mfAssets = this.plansService.getMFList(this.advisor_client_id);

    this.loaderFn.increaseCounter();
    forkJoin(otherAssets, mfAssets).subscribe(result => {
      let otherAssetRes = result[1].map(asset => {
        let absAllocation = 0;
        if (asset.goalAssetMapping) {
          asset.goalAssetMapping.forEach(element => {
            if (absAllocation <= 99) {
              absAllocation += element.percentAllocated;
            } else {
              //this.eventService.openSnackBar('Asset allocation already 100%', "Dismiss")
            }
          });
        }
        return { absAllocation, ...asset };
      });

      let mfAssetRes = result[1].map(mf => {
        let absAllocation = 0;
        if (mf.goalAssetMapping.length > 0) {
          mf.goalAssetMapping.forEach(element => {
            if (absAllocation <= 99) {
              absAllocation += element.percentAllocated;
            } else {
              //this.eventService.openSnackBar('Asset allocation already 100%', "Dismiss")
            }
          });
        }
        return { absAllocation, ...mf };
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

  afterDataLoadMethod() {
    this.highlight = false
    this.allGoals = this.allGoals.reverse().map(goal => this.mapGoalDashboardData(goal));
    console.log('allGoals', this.allGoals)
    this.allGoals.map(element => {
      element.gv = UtilService.getNumberToWord(element.gv)
      element.dashboardData.futureValue = UtilService.getNumberToWord(element.dashboardData.futureValue)
      element.dashboardData.achievedValue = UtilService.getNumberToWord(element.dashboardData.achievedValue)
    })
    if (this.selectedGoalId) {
      this.loadSelectedGoalData(this.allGoals.find(goal => goal.remainingData.id == this.selectedGoalId));
    } else {
      if (this.allGoals.length > 0) {
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
      if (mapData.goalType == 1) {
        mapData.year = (goalSubData.differentGoalYears) ? (new Date(goalSubData.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalSubData.goalEndDate).getFullYear()) : '-';
      }
      mapData.goalName = goalSubData.goalName;
      mapData.gv = goalSubData.goalFV;
      mapData.goalStartDate = goalSubData.goalStartDate;
      if (goalSubData.goalType == 1) {
        mapData.goalEndDate = goalSubData.goalEndDate; // because start hote hi khatam ho gaya
      } else {
        mapData.goalEndDate = goalSubData.goalStartDate; // because start hote hi khatam ho gaya
      }
      mapData.dashboardData = {
        goalYear: new Date(goalSubData.goalStartDate).getFullYear(),
        presentValue: goalSubData.goalPresentValue,
        futureValue: goalSubData.goalFV,
        equity_monthly: this.getSumOfJsonMap(goalSubData.sipAmountEquity) || 0,
        debt_monthly: this.getSumOfJsonMap(goalSubData.sipAmountDebt) || 0,
        targetValueOfRequiredFVEquity: this.getSumOfJsonMap(goalSubData.targetValueOfRequiredFVEquity),
        targetValueOfRequiredFVDebt: this.getSumOfJsonMap(goalSubData.targetValueOfRequiredFVDebt),
        lump_equity: this.getSumOfJsonMap(goalSubData.lumpSumAmountEquity) || 0,
        lump_debt: this.getSumOfJsonMap(goalSubData.lumpSumAmountDebt) || 0,
        arr_equity_monthly: this.getSumOfJsonMapArr(goalSubData.sipAmountEquity),
        arr_debt_monthly: this.getSumOfJsonMapArr(goalSubData.sipAmountDebt),
        arr_lump_equity: this.getSumOfJsonMapArr(goalSubData.lumpSumAmountEquity),
        arr_lump_debt: this.getSumOfJsonMapArr(goalSubData.lumpSumAmountDebt),
        arr_goalYrAndFutValues: this.getSumOfJsonMapArr(goalSubData.goalYrAndFutValues),
        key_arr_equity_monthly: this.getSumOfJsonMapArrKey(goalSubData.sipAmountEquity),
        key_arr_debt_monthly: this.getSumOfJsonMapArrKey(goalSubData.sipAmountDebt),
        key_arr_lump_equity: this.getSumOfJsonMapArrKey(goalSubData.lumpSumAmountEquity),
        key_arr_lump_debt: this.getSumOfJsonMapArrKey(goalSubData.lumpSumAmountDebt),
        key_goalYrAndFutValues: this.getSumOfJsonMapArrKey(goalSubData.goalYrAndFutValues),
        goalProgress: goalSubData.goalAchievedPercentage,
        achievedValue: goalSubData.achievedValue
      }
      console.log('sip equity', mapData.dashboardData.equity_monthly)
      console.log('sip debt', mapData.dashboardData.debt_monthly)
      console.log('lum equity', mapData.dashboardData.lump_equity)
      console.log('lum debt', mapData.dashboardData.lump_debt)
      if (mapData.dashboardData.equity_monthly == 0 && mapData.dashboardData.lump_equity != 0) {
        mapData.dashboardData.equity_monthly = 'N/A'
      }
      if (mapData.dashboardData.debt_monthly == 0 && mapData.dashboardData.lump_debt != 0) {
        mapData.dashboardData.debt_monthly = 'N/A'
      }
      console.log('mapData.dashboardData.key_arr_equity_monthly', mapData.dashboardData.key_arr_equity_monthly)
      mapData.remainingData = goalSubData;
      mapData.remainingData.differentGoalYears = [goalSubData.goalStartDate];
    } else {
      const goalSubData: any = goal.multiYearGoalPlan;
      mapData.img = goalSubData.imageUrl;
      mapData.year = (goalSubData.differentGoalYears) ? (new Date(goalSubData.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalSubData.differentGoalYears[goalSubData.differentGoalYears.length - 1]).getFullYear()) : '-';
      mapData.goalName = goalSubData.name;
      mapData.gv = goalSubData.futureValue;
      mapData.goalStartDate = goalSubData.differentGoalYears ? goalSubData.differentGoalYears[0] : '-';
      mapData.goalEndDate = goalSubData.differentGoalYears ? goalSubData.differentGoalYears[goalSubData.differentGoalYears.length - 1] : 0;
      mapData.dashboardData = {
        goalYear: new Date(goalSubData.goalEndDate || goalSubData.vacationEndYr).getFullYear(),
        presentValue: goalSubData.presentValue,
        futureValue: goalSubData.futureValue,
        equity_monthly: this.getSumOfJsonMap(goalSubData.sipAmountEquity),
        targetValueOfRequiredFVEquity: this.getSumOfJsonMap(goalSubData.targetValueOfRequiredFVEquity),
        targetValueOfRequiredFVDebt: this.getSumOfJsonMap(goalSubData.targetValueOfRequiredFVDebt),
        debt_monthly: this.getSumOfJsonMap(goalSubData.sipAmountDebt),
        lump_equity: this.getSumOfJsonMap(goalSubData.lumpSumAmountEquity),
        lump_debt: this.getSumOfJsonMap(goalSubData.lumpSumAmountDebt),
        arr_equity_monthly: this.getSumOfJsonMapArr(goalSubData.sipAmountEquity),
        arr_debt_monthly: this.getSumOfJsonMapArr(goalSubData.sipAmountDebt),
        arr_lump_equity: this.getSumOfJsonMapArr(goalSubData.lumpSumAmountEquity),
        arr_goalYrAndFutValues: this.getSumOfJsonMapArr(goalSubData.goalYrAndFutValues),
        arr_lump_debt: this.getSumOfJsonMapArr(goalSubData.lumpSumAmountDebt),
        key_arr_equity_monthly: this.getSumOfJsonMapArrKey(goalSubData.sipAmountEquity),
        key_arr_debt_monthly: this.getSumOfJsonMapArrKey(goalSubData.sipAmountDebt),
        key_arr_lump_equity: this.getSumOfJsonMapArrKey(goalSubData.lumpSumAmountEquity),
        key_arr_lump_debt: this.getSumOfJsonMapArrKey(goalSubData.lumpSumAmountDebt),
        key_goalYrAndFutValues: this.getSumOfJsonMapArrKey(goalSubData.goalYrAndFutValues),
        goalProgress: goalSubData.goalAchievedPercentage,
        achievedValue: goalSubData.achievedValue
      }
      console.log('sip equity', mapData.dashboardData.equity_monthly)
      console.log('sip debt', mapData.dashboardData.debt_monthly)
      console.log('lum equity', mapData.dashboardData.lump_equity)
      console.log('lum debt', mapData.dashboardData.lump_debt)
      console.log('targetValueOfRequiredFVEquity', mapData.dashboardData.targetValueOfRequiredFVEquity)
      if (mapData.dashboardData.equity_monthly == 0 && mapData.dashboardData.lump_equity != 0) {
        mapData.dashboardData.equity_monthly = 'N/A'
      }
      if (mapData.dashboardData.debt_monthly == 0 && mapData.dashboardData.lump_debt != 0) {
        mapData.dashboardData.debt_monthly = 'N/A'
      }
      console.log('mapData.dashboardData.key_arr_equity_monthly', mapData.dashboardData.key_arr_equity_monthly)
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
  getSumOfJsonMapArr(json: Object = {}) {
    let array = [];
    for (let k in json) {
      if (json.hasOwnProperty(k)) {
        array.push(json[k])
      }
    }
    return array;
  }
  getSumOfJsonMapArrKey(json: Object = {}) {
    let array1 = [];
    //   if (Object.keys(json)) {
    //     array.push())
    // }
    return Object.keys(json);
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
          this.loadAllGoals(false);
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
        if (this.selectedGoal.singleOrMulti == 1) {
          fragmentData.componentName = KeyInfoComponent;
          fragmentData.state = 'open35';
          fragmentData.data = this.selectedGoal;
        } else {
          fragmentData.componentName = KeyInfoComponent;
          fragmentData.state = 'open65';
          fragmentData.data = this.selectedGoal;
        }

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
          this.loadAllGoals(false);
        }
        subscription.unsubscribe();
      }
    });
    if (flag == 'openallocations') {
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
    console.log('allocatedList', this.allocatedList)
    this.selectedGoal = goalData;
    this.singleGoalData = this.selectedGoal
    console.log('sip equity', this.singleGoalData.dashboardData.equity_monthly)
    console.log('sip debt', this.singleGoalData.dashboardData.debt_monthly)
    console.log('lum equity', this.singleGoalData.dashboardData.lump_equity)
    console.log('lum debt', this.singleGoalData.dashboardData.lump_debt)
    if (this.singleGoalData.dashboardData.equity_monthly == 0 && this.singleGoalData.dashboardData.lump_equity != 0) {
      this.singleGoalData.dashboardData.equity_monthly = 'N/A'
    }
    if (this.singleGoalData.dashboardData.debt_monthly == 0 && this.singleGoalData.dashboardData.lump_debt != 0) {
      this.singleGoalData.dashboardData.debt_monthly = 'N/A'
    }
    if (this.selectedGoal && this.finPlanObj && this.finPlanObj.obj) {
      this.finPlanObj.obj.dashboardData = {}
      this.selectedGoal = this.finPlanObj.obj
      this.singleGoalData = this.finPlanObj.obj
      this.singleGoalData.dashboardData.equity_monthly = this.finPlanObj.obj.equity_monthly
      this.singleGoalData.dashboardData.debt_monthly = this.finPlanObj.obj.debt_monthly
      this.singleGoalData.dashboardData.achievedValue = this.finPlanObj.obj.achievedValue
      this.singleGoalData.dashboardData.goalProgress = this.finPlanObj.obj.percentCompleted
      this.singleGoalData.dashboardData.lump_debt = this.finPlanObj.obj.lump_debt
      this.singleGoalData.dashboardData.lump_equity = this.finPlanObj.obj.lump_equity
      this.singleGoalData.img = this.finPlanObj.obj.imageUrl
      this.singleGoalData.dashboardData.futureValue = this.finPlanObj.obj.goalFV
      goalData.remainingData.retirementTableValue = this.finPlanObj.obj.retirementTableValue;
      goalData.remainingData.milestoneModels = this.finPlanObj.obj.milestoneModels;
    }
    // this.cd.markForCheck();
    // this.cd.detectChanges();
    console.log(this.selectedGoal)
    this.selectedGoalId = goalData.remainingData.id;
    if (goalData.remainingData.retirementTableValue) {
      this.isRetirementTab = true;
      let goalTableData = goalData.remainingData.retirementTableValue;
      goalTableData.forEach(element => {
        element.goalYear = new Date(element.goalStartDate).getFullYear()
      });
    } else {
      this.isRetirementTab = false;
    }
    this.dataSource = goalData.remainingData.retirementTableValue ? goalData.remainingData.retirementTableValue : [];
    this.dataSource1 = goalData.remainingData.milestoneModels ? goalData.remainingData.milestoneModels : [];
    //this.dataSource.sort = this.sort;
    console.log('table', this.dataSource)
    setTimeout(() => {
      this.createChart(this.selectedGoal);
    }, 100);
    if (this.finPlanObj) {
      this.cd.markForCheck();
      this.cd.detectChanges();
      this.cd.markForCheck();
      this.loaded.emit(this.summaryPlan.nativeElement);
    }

  }
  deleteMilestone(milestone) {
    const dialogData = {
      header: 'DELETE MILESTONE',
      body: 'Are you sure you want to remove milestone?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let obj = {
          milestoneId: milestone.id,
        }
        this.plansService.deleteMilestone({ milestoneId: milestone.id }).subscribe(res => {
          this.allocateOtherAssetService.refreshAssetList.next();
          this.loadAllGoals(false);
          this.eventService.openSnackBar("Milestone deleted successfully");
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
  deleteGoal() {
    const dialogData = {
      header: 'DELETE GOAL',
      body: 'Are you sure you want to delete this goal?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        let deleteObj = {
          goalId: this.selectedGoalId,
          goalType: this.selectedGoal.goalType,
          id: this.selectedGoal.id
        }
        this.plansService.deleteGoal(deleteObj).subscribe((data) => {
          this.eventService.openSnackBar("Goal has been deleted successfully", "Dismiss");
          this.allGoals = this.allGoals.filter(goal => goal.remainingData.id != this.selectedGoalId);
          this.allGoals.forEach(element => element.gv = UtilService.getNumberToWord(element.gv))
          this.selectedGoalId = null;
          if (this.allGoals.length > 0) {
            this.loadSelectedGoalData(this.allGoals[0]);
          } else {
            this.selectedGoal = {};
          }
          // update asset list if user deletes goal and the list is still open
          this.loadAllGoals(false);
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
  deleteLoan(loan) {
    const dialogData = {
      header: 'DELETE LOAN',
      body: 'Are you sure you want to remove loan?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {

        this.plansService.deleteLoan({ loanId: loan.id }).subscribe(res => {
          this.allocateOtherAssetService.refreshAssetList.next();
          this.loadAllGoals(false);
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
  // drag drop for assets brought from allocations tab
  drop(event: CdkDragDrop<string[]>) {
    this.highlight = false
    if (event.previousContainer === event.container || !event.isPointerOverContainer) {
      return;
    }
    if (this.selectedGoal.remainingData.freezed == true) {
      this.Unfreezed()
    } else {
      this.allocateOtherAssetService.allocateOtherAssetToGoal(event, this.advisor_client_id, this.selectedGoal);
      this.loadAllAssets();
      this.loadAllGoals(true);
      setTimeout(() => {
        this.loadAllAssets();
      }, 100)
      this.loaderFn.setFunctionToExeOnZero(this, this.afterDataLoadMethod);
    }

  }
  Unfreezed() {
    const dialogData = {
      header: 'UNFREEZE GOAL',
      body: 'You have frozen the calculations for additional savings required. Allocating an asset will unfreeze the calculations. Are you sure you want to unfreeze?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'UNFREEZE',
      positiveMethod: () => {
        let obj = {
          lumpSumAmountDebt: this.selectedGoal.remainingData.lumpSumAmountDebt,
          lumpSumAmountEquity: this.selectedGoal.remainingData.lumpSumAmountEquity,
          id: this.selectedGoal.remainingData.id,
          goalType: this.selectedGoal.goalType,
          freezed: false,
        }
        this.plansService.freezCalculation(obj).subscribe(res => {
          //this.allocateOtherAssetService.refreshAssetList.next();
          this.loadAllAssets();
          this.eventService.openSnackBar("Goal unfreeze successfully");
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
          const assetIndex = this.allocatedList.findIndex((asset) => asset.assetId == allocation.assetId);
          this.allocatedList.splice(assetIndex, 1);
          this.loadAllGoals(false);
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
  addMilestone(data, obj, flag) {
    const dialogData = {
      data,
      otherData: this.selectedGoal,
      flag: flag,
      singleObj: obj
    }
    this.dialog.open(AddMilestoneComponent, {
      width: '650px',
      height: '300px',
      data: dialogData,
      autoFocus: false,
    });
  }
  reallocateAsset(allocation) {
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
    this.highlight = true
    console.log(e, 'dz method')
  }

  ngOnDestroy() {
    this.subInjectService.closeNewRightSlider({ state: 'close' });
    if (this.otherAssetAllocationSubscription) {
      this.otherAssetAllocationSubscription.unsubscribe();
    }
    this.subscriber.unsubscribe();
  }
  getDefault() {
    let advisorObj = {
      advisorId: AuthService.getAdvisorId()
    }
    this.plansService.getGoalGlobalData(advisorObj).subscribe(
      data => this.getGoalGlobalDataRes(data),
      error => {
        this.eventService.showErrorMessage(error)
        this.defaultGallery = undefined;
      }
    )

  }
  getGoalGlobalDataRes(data) {
    console.log('galary', data)
    this.defaultGallery = data

  }
  openGallery(gallery) {
    let obj = {
      goalId: this.selectedGoalId,
      goalType: this.selectedGoal.goalType,
      imageUrl: gallery
    }
    const dialogRef = this.dialog.open(OpenGalleryPlanComponent, {
      width: '470px',
      height: '280px',
      data: { bank: gallery, animal: obj }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDefault()
      }
    });
  }
}


export interface PeriodicElement {
  details: string;
  value: string;
  month: string;
  lumpsum: string;
  imageUrl: string,
  year: string,
  goalFV: string,
  achievedValue: string,
  equity_monthly: string,
  debt_monthly: string,
  lump_equity: string,
  lump_debt: string,
  goalAssetAllocation: string,
  retirementTableValue: string,
  percentCompleted: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    details: '', value: '', month: '', lumpsum: '', imageUrl: '', year: '',
    goalFV: '', achievedValue: '', equity_monthly: '', debt_monthly: '', lump_equity: '', lump_debt: '',
    goalAssetAllocation: '', retirementTableValue: '', percentCompleted: ''
  }
];