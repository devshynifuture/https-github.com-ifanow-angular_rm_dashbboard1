import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ComponentFactory,
  ViewContainerRef,
  ViewChild
} from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { delay } from 'rxjs/operators';
import { IncomeComponent } from '../income/income.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { ExpensesComponent } from '../../../accounts/expenses/expenses.component';
import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MutualFundSummaryComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund.component';
import { MutualFundOverviewComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundUnrealizedTranComponent } from '../../../accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { LiabilitiesComponent } from '../../../accounts/liabilities/liabilities.component';
import { OtherPayablesComponent } from '../../../accounts/liabilities/other-payables/other-payables.component';
import { MatTableDataSource } from '@angular/material';
import { PlanService } from '../../plan.service';
import { GoalsPlanComponent } from '../../goals-plan/goals-plan.component';

// import { InsuranceComponent } from '../../../accounts/insurance/insurance.component';

@Component({
  selector: 'app-finacial-plan-section',
  templateUrl: './finacial-plan-section.component.html',
  styleUrls: ['./finacial-plan-section.component.scss'],
  entryComponents: [
    IncomeComponent,
    ExpensesComponent,
    InsuranceComponent,
    MutualFundSummaryComponent,
    MutualFundOverviewComponent,
    MutualFundUnrealizedTranComponent,
    MutualFundComponent,
    LiabilitiesComponent,
    OtherPayablesComponent,
    GoalsPlanComponent,
  ]
})
export class FinacialPlanSectionComponent implements OnInit {
  loadedSection: any;
  fragmentData = { isSpinner: false };
  @ViewChild('pdfContainer', {
    read: ViewContainerRef,
    static: true
  }) container;
  moduleAdded: any;
  selected = 0;
  isLoading = false;
  panelOpenState = false;
  dataSource: any;
  goalList: any;
  goalSummaryCountObj: any;
  constructor(private util: UtilService, private resolver: ComponentFactoryResolver,
    private planService: PlanService,
    private subInjectService: SubscriptionInject) {
  }


  ngOnInit() {
    this.moduleAdded = [];
    this.getGoalSummaryValues();
  }

  // checkAndLoadPdf(value, sectionName) {
  //   if (value) {
  //     this.loadedSection = sectionName
  //   }
  // }


  getOutput(data) {
    console.log(data);
    this.generatePdf(data, '');
  }

  generatePdf(data, sectionName) {
    this.fragmentData.isSpinner = true;
    // let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);
    this.util.htmlToPdf('', data.innerHTML, sectionName, 'true', this.fragmentData, '', '', false);
    this.moduleAdded.push({ name: sectionName });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.moduleAdded, event.previousIndex, event.currentIndex);
    console.log(this.moduleAdded);
  }

  removeModule(module, i) {
    this.moduleAdded.splice(i, 1);
  }

  download() {
    // let list = [{ url: 'pdf/summary', id: 1 }, { url: 'pdf/allTransactions', id: 2 }, { url: 'pdf/unrealisedTransactions', id: 3 },]
    // list.forEach(element => {
    //   if (element.id == 1) {
    //     element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18'
    //     window.open(element.url)
    //   } else if (element.id == 2) {
    //     element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18' + '&' + 'fromDate=2019%2F11%2F18'
    //     window.open(element.url)
    //   } else if (element.id == 3) {
    //     element.url = 'http://localhost:4200/' + element.url + '?' + 'advisorId=' + AuthService.getAdvisorId() + '&' + 'clientId=' + AuthService.getClientId() + '&' + 'parentId=0' + '&' + 'toDate=2020%2F11%2F18'
    //     window.open(element.url)
    //   }
    // });

  }

  checkAndLoadPdf(value: any, sectionName: any, obj: any) {
    let factory;
    if (value) {
      this.fragmentData.isSpinner = true;
      switch (sectionName) {
        case 'income':
          factory = this.resolver.resolveComponentFactory(IncomeComponent);
          break;
        case 'expense':
        case 'budget':
          factory = this.resolver.resolveComponentFactory(ExpensesComponent);
          break;
        // case 'All life insurances':
        // case 'Term insurance':
        // case 'Traditional insurance':
        // case 'Ulip insurance':
        // case 'All General insurance':
        // case 'Health insurance':
        // case 'Personal accident':
        // case 'Critical illness':
        // case 'Motor insurance':
        // case 'Travel insurance':
        // case 'Home insurance':
        case 'Fire & special perils':
          factory = this.resolver.resolveComponentFactory(InsuranceComponent);
          break;
        case 'Mutual fund summary':
          factory = this.resolver.resolveComponentFactory(MutualFundSummaryComponent);
          break;
        case 'Mutual fund unrealised transaction':
          factory = this.resolver.resolveComponentFactory(MutualFundUnrealizedTranComponent);
          break;
        case 'Mutual fund all transaction':
          factory = this.resolver.resolveComponentFactory(MutualFundUnrealizedTranComponent);
          break;
        case 'Mutual fund overview':
          factory = this.resolver.resolveComponentFactory(MutualFundOverviewComponent);
          break;
        case 'All Liabltities':
        case 'Home':
        case 'Vehicle':
        case 'Education':
        case 'Personal':
        case 'Credit card':
        case 'Mortgage':
          factory = this.resolver.resolveComponentFactory(LiabilitiesComponent);
          break;
        case 'Others':
          factory = this.resolver.resolveComponentFactory(OtherPayablesComponent);
        case 'Goal':
          factory = this.resolver.resolveComponentFactory(GoalsPlanComponent);
          break;
      }
      const pdfContentRef = this.container.createComponent(factory);
      const pdfContent = pdfContentRef.instance;
      if (sectionName == 'Goal') {
        pdfContent.finPlanObj = { hideForFinPlan: true, obj };
      } else {
        pdfContent.finPlanObj = { hideForFinPlan: true, sectionName };
      }
      const sub = pdfContent.loaded
        .pipe(delay(1))
        .subscribe(data => {
          console.log(data.innerHTML);
          this.fragmentData.isSpinner = false;
          this.generatePdf(data, sectionName);
          console.log(pdfContent.loaded);
          sub.unsubscribe();
        });
    }


  }
  getGoalSummaryValues() {
    let data = {
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId()
    }
    //this.isLoadingGoals = true;
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    this.planService.getGoalSummaryPlanData(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          this.goalSummaryCountObj = res;
          this.goalList = res.goalList;
          let arr = [];
          this.goalList.forEach(item => {
            if (!!item.singleOrMulti && item.singleOrMulti === 1) {
              let goalValueObj = item.singleGoalModel,
                lumpsumDeptKey = Object.keys(goalValueObj.lumpSumAmountDebt)[0],
                lumpsumEquityKey = Object.keys(goalValueObj.lumpSumAmountEquity)[0],
                lumpsum = Math.round(goalValueObj.lumpSumAmountDebt[lumpsumDeptKey] + goalValueObj.lumpSumAmountEquity[lumpsumEquityKey]),
                sipDebtKey = Object.keys(goalValueObj.sipAmountDebt)[0],
                sipEquityKey = Object.keys(goalValueObj.sipAmountEquity)[0],
                month = Math.round(goalValueObj.sipAmountDebt[sipDebtKey] + goalValueObj.sipAmountEquity[sipEquityKey]),
                year = (new Date(goalValueObj.goalStartDate).getFullYear()).toString();
              if (goalValueObj.goalType == 1) {
                year = (goalValueObj.differentGoalYears) ? (new Date(goalValueObj.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalValueObj.goalEndDate).getFullYear()) : '-';
              }
              let goalFV = goalValueObj.goalFV
              if (goalValueObj.retirementTableValue) {
                goalValueObj.retirementTableValue.forEach(element => {
                  element.goalYear = new Date(element.goalStartDate).getFullYear()
                });
              }

              arr.push({
                details: !!goalValueObj.goalName ? goalValueObj.goalName : '',
                value: !!goalValueObj.goalFV ? Math.round(goalValueObj.goalFV) : '',
                month,
                lumpsum,
                percentCompleted: Math.round(!!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage : 0),
                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl : '',
                year: year,
                goalFV: UtilService.getNumberToWord(!!goalValueObj.goalFV ? goalValueObj.goalFV : 0),
                achievedValue: UtilService.getNumberToWord(!!goalValueObj.achievedValue ? goalValueObj.achievedValue : 0),
                equity_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountEquity) || 0,
                debt_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountDebt) || 0,
                lump_equity: this.getSumOfJsonMap(goalValueObj.lumpSumAmountEquity) || 0,
                lump_debt: this.getSumOfJsonMap(goalValueObj.lumpSumAmountDebt) || 0,
                goalAssetAllocation: item.goalAssetAllocation,
                retirementTableValue: goalValueObj.retirementTableValue
              });
            } else if (!!item.singleOrMulti && item.singleOrMulti === 2) {
              let goalValueObj = item.multiYearGoalPlan,
                lumpsumDebt = 0,
                lumpsumEquity = 0,
                lumpsum = 0,
                sipDebtSum = 0,
                sipEquitySum = 0,
                month = 0;
              for (const key in goalValueObj.lumpSumAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountDebt, key)) {
                  const element = goalValueObj.lumpSumAmountDebt[key];
                  lumpsumDebt += element;
                }
              }
              for (const key in goalValueObj.lumpSumAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.lumpSumAmountEquity, key)) {
                  const element = goalValueObj.lumpSumAmountEquity[key];
                  lumpsumEquity += element;
                }
              }
              lumpsum = Math.round(lumpsumDebt + lumpsumEquity);

              for (const key in goalValueObj.sipAmountDebt) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountDebt, key)) {
                  const element = goalValueObj.sipAmountDebt[key];
                  sipDebtSum += element;
                }
              }

              for (const key in goalValueObj.sipAmountEquity) {
                if (Object.prototype.hasOwnProperty.call(goalValueObj.sipAmountEquity, key)) {
                  const element = goalValueObj.sipAmountEquity[key];
                  sipEquitySum += element;
                }
              }

              month = Math.round(sipEquitySum + sipDebtSum);
              let year;
              year = (new Date(goalValueObj.goalStartDate).getFullYear()).toString();
              if (goalValueObj.goalType == 1) {
                year = (goalValueObj.differentGoalYears) ? (new Date(goalValueObj.differentGoalYears[0]).getFullYear()) + ' - ' + (new Date(goalValueObj.goalEndDate).getFullYear()) : '-';
              }
              if (goalValueObj.retirementTableValue) {
                goalValueObj.retirementTableValue.forEach(element => {
                  element.goalYear = new Date(element.goalStartDate).getFullYear()
                });
              }
              arr.push({
                details: goalValueObj.name,
                month,
                lumpsum,
                percentCompleted: Math.round(!!goalValueObj.goalAchievedPercentage ? goalValueObj.goalAchievedPercentage : 0),
                imageUrl: !!goalValueObj.imageUrl ? goalValueObj.imageUrl : '',
                value: !!goalValueObj.futureValue ? Math.round(goalValueObj.futureValue) : '',
                year: year,
                goalFV: UtilService.getNumberToWord(!!goalValueObj.goalFV ? goalValueObj.goalFV : 0),
                achievedValue: UtilService.getNumberToWord(!!goalValueObj.achievedValue ? goalValueObj.achievedValue : 0),
                equity_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountEquity) || 0,
                debt_monthly: this.getSumOfJsonMap(goalValueObj.sipAmountDebt) || 0,
                lump_equity: this.getSumOfJsonMap(goalValueObj.lumpSumAmountEquity) || 0,
                lump_debt: this.getSumOfJsonMap(goalValueObj.lumpSumAmountDebt) || 0,
                goalAssetAllocation: item.goalAssetAllocation,
                retirementTableValue: goalValueObj.retirementTableValue
              });
            }
          });
          this.dataSource.data = arr;
          //this.isLoadingGoals = false;
          // this.dataSource.paginator = this.paginator;
        }
      }, err => {
        //this.goalSummaryCountObj = ''
        //   this.isLoadingGoals = false;
        console.error(err);
        // this.eventService.openSnackBar("Something went wrong", "DISMISS")
      })


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
