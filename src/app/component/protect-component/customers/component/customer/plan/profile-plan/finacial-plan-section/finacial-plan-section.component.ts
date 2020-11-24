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
import { CommoditiesComponent } from '../../../accounts/assets/commodities/commodities/commodities.component';
import { RealEstateComponent } from '../../../accounts/assets/realEstate/real-estate/real-estate.component';
import { AssetStocksComponent } from '../../../accounts/assets/asset-stocks/asset-stocks.component';
import { CashAndBankComponent } from '../../../accounts/assets/cash&bank/cash-and-bank/cash-and-bank.component';
import { FixedIncomeComponent } from '../../../accounts/assets/fixedIncome/fixed-income/fixed-income.component';
import { RetirementAccountComponent } from '../../../accounts/assets/retirementAccounts/retirement-account/retirement-account.component';
import { PoMisSchemeComponent } from '../../../accounts/assets/smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import { PoTdSchemeComponent } from '../../../accounts/assets/smallSavingScheme/po-td-scheme/po-td-scheme.component';
import { PoRdSchemeComponent } from '../../../accounts/assets/smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import { PoSavingsComponent } from '../../../accounts/assets/smallSavingScheme/po-savings/po-savings.component';
import { ScssSchemeComponent } from '../../../accounts/assets/smallSavingScheme/scss-scheme/scss-scheme.component';
import { KvpSchemeComponent } from '../../../accounts/assets/smallSavingScheme/kvp-scheme/kvp-scheme.component';
import { SsySchemeComponent } from '../../../accounts/assets/smallSavingScheme/ssy-scheme/ssy-scheme.component';
import { NscSchemeComponent } from '../../../accounts/assets/smallSavingScheme/nsc-scheme/nsc-scheme.component';
import { PPFSchemeComponent } from '../../../accounts/assets/smallSavingScheme/ppf-scheme/ppf-scheme.component';
import { LifeInsuranceComponent } from '../../insurance-plan/mainInsuranceScreen/life-insurance/life-insurance.component';
import { HttpService } from 'src/app/http-service/http-service';
import { HttpHeaders } from '@angular/common/http';

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
    CommoditiesComponent,
    RealEstateComponent,
    AssetStocksComponent,
    CashAndBankComponent,
    FixedIncomeComponent,
    RetirementAccountComponent,
    PoMisSchemeComponent,
    PoTdSchemeComponent,
    PoRdSchemeComponent,
    PoSavingsComponent,
    ScssSchemeComponent,
    KvpSchemeComponent,
    SsySchemeComponent,
    NscSchemeComponent,
    PPFSchemeComponent,
    LifeInsuranceComponent
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
  advisorId: any;
  clientId: any;
  insuranceList: any;
  insurancePlanningList: any;
  constructor(private http: HttpService, private util: UtilService, private resolver: ComponentFactoryResolver,
    private planService: PlanService,
    private subInjectService: SubscriptionInject) {
    this.advisorId = AuthService.getAdvisorId(),
      this.clientId = AuthService.getClientId()
  }


  ngOnInit() {
    this.moduleAdded = [];
    this.getGoalSummaryValues();
    this.getInsuranceList();
  }

  // checkAndLoadPdf(value, sectionName) {
  //   if (value) {
  //     this.loadedSection = sectionName
  //   }
  // }




  generatePdf(data, sectionName, displayName) {
    this.fragmentData.isSpinner = true;
    // let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);
    this.util.htmlToPdf('', data.innerHTML, sectionName, 'true', this.fragmentData, 'showPieChart', '', false);
    this.moduleAdded.push({ name: displayName });
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

  checkAndLoadPdf(value: any, sectionName: any, obj: any, displayName: any) {
    let factory;
    if (value) {
      this.fragmentData.isSpinner = true;
      switch (sectionName) {
        case 'income':
          factory = this.resolver.resolveComponentFactory(IncomeComponent);
          break;
        case 'Expense This month':
        case 'Expense Last month':
        case 'Expense This quarter':
        case 'Expense Last quarter':
        case 'Expense This calender year':
        case 'Expense Last calender year':
        case 'Expense This financial year':
        case 'Expense Last financial year':
        case 'Budget This month':
        case 'Budget Last month':
        case 'Budget This quarter':
        case 'Budget Last quarter':
        case 'Budget This calender year':
        case 'Budget Last calender year':
        case 'Budget This financial year':
        case 'Budget Last financial year':
          factory = this.resolver.resolveComponentFactory(ExpensesComponent);
          break;
        case 'All life insurances':
        case 'Term insurance':
        case 'Traditional insurance':
        case 'Ulip insurance':
        case 'All General insurance':
        case 'Health insurance':
        case 'Personal accident':
        case 'Critical illness':
        case 'Motor insurance':
        case 'Travel insurance':
        case 'Home insurance':
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
        case 'Gold':
        case 'OthersComm':
          factory = this.resolver.resolveComponentFactory(CommoditiesComponent);
          break;
        case 'Real estate':
          factory = this.resolver.resolveComponentFactory(RealEstateComponent);
          break;
        case 'Stocks':
          factory = this.resolver.resolveComponentFactory(AssetStocksComponent);
          break;
        case 'Bank accounts':
        case 'Cash in hand':
          factory = this.resolver.resolveComponentFactory(CashAndBankComponent);
          break;
        case 'Fixed deposit':
        case 'Recurring deposits':
        case 'Bonds':
          factory = this.resolver.resolveComponentFactory(FixedIncomeComponent);
          break;
        case 'EPF':
        case 'NPS':
        case 'Gratuity':
          factory = this.resolver.resolveComponentFactory(RetirementAccountComponent);
          break;
        case 'PPF':
          factory = this.resolver.resolveComponentFactory(PPFSchemeComponent);
          break;
        case 'NSC':
          factory = this.resolver.resolveComponentFactory(NscSchemeComponent);
          break;
        case 'SSY':
          factory = this.resolver.resolveComponentFactory(SsySchemeComponent);
          break;
        case 'KVP':
          factory = this.resolver.resolveComponentFactory(KvpSchemeComponent);
          break;
        case 'SCSS':
          factory = this.resolver.resolveComponentFactory(ScssSchemeComponent);
          break;
        case 'PoSaving':
          factory = this.resolver.resolveComponentFactory(PoSavingsComponent);
          break;
        case 'PO RD':
          factory = this.resolver.resolveComponentFactory(PoRdSchemeComponent);
          break;
        case 'PO TD':
          factory = this.resolver.resolveComponentFactory(PoTdSchemeComponent);
          break;
        case 'PO MIS':
          factory = this.resolver.resolveComponentFactory(PoMisSchemeComponent);
          break;
        case 'PO MIS':
          factory = this.resolver.resolveComponentFactory(PoMisSchemeComponent);
          break;
        case 'Life insurance':
          factory = this.resolver.resolveComponentFactory(LifeInsuranceComponent);
          break;

      }
      const pdfContentRef = this.container.createComponent(factory);
      const pdfContent = pdfContentRef.instance;
      if (sectionName == 'Goal') {
        pdfContent.finPlanObj = { hideForFinPlan: true, obj };
      } else if (sectionName == 'Life insurance') {
        obj.dataLoaded = true;
        pdfContent.finPlanObj = { hideForFinPlan: true, data: obj, allInsuranceList: this.insurancePlanningList };
      } else {
        pdfContent.finPlanObj = { hideForFinPlan: true, sectionName };
      }
      const sub = pdfContent.loaded
        .pipe(delay(1))
        .subscribe(data => {
          //console.log(data.innerHTML);
          this.fragmentData.isSpinner = false;
          this.generatePdf(data, sectionName, displayName);
          this.uploadFile(data, sectionName, displayName);
          console.log(pdfContent.loaded);
          sub.unsubscribe();
        });
    }


  }
  uploadFile(innerHtmlData, sectionName, displayName) {
    const obj = {
      clientId: this.clientId,
      name: sectionName + '.html',
      htmlInput: String(innerHtmlData.innerHTML)
    };
    this.planService.getFinPlanFileUploadUrl(obj).subscribe(
      data => this.uploadFileRes(data, innerHtmlData)
    );
  }
  uploadFileRes(data, innerHtmlData) {
    console.log(data);
  }
  getGoalSummaryValues() {
    let data = {
      advisorId: this.advisorId,
      clientId: this.clientId,
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
                futureValue: goalValueObj.goalFV,
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
  getInsuranceList() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.planService.getInsurancePlaningList(obj).subscribe(
      data => this.getInsurancePlaningListRes(data),
      err => {
        console.error(err);
      }
    );
  }
  getInsurancePlaningListRes(data) {
    if (data) {
      data.forEach(singleInsuranceData => {
        if (singleInsuranceData.owners.length > 0) {
          singleInsuranceData.displayHolderName = singleInsuranceData.owners[0].holderName;
          if (singleInsuranceData.owners.length > 1) {
            for (let i = 1; i < singleInsuranceData.owners.length; i++) {
              if (singleInsuranceData.owners[i].holderName) {
                const firstName = (singleInsuranceData.owners[i].holderName as string).split(' ')[0];
                singleInsuranceData.displayHolderName += ', ' + firstName;
              }
            }
          }
        } else {
          singleInsuranceData.displayHolderName = '';
        }
      });
      this.dataSource = data
      this.dataSource.forEach(element => {
        if (element.insuranceType == 1) {
          element.header = 'Add Life insurance'
          element.heading = 'Life insurance'
          element.logo = '/assets/images/svg/LIsmall.svg'
        } else if (element.insuranceType == 5) {
          element.value = '1';
          element.header = 'Add Health insurance'
          element.heading = 'Health insurance'
          element.logo = '/assets/images/svg/HIsmall.svg'
        } else if (element.insuranceType == 6) {
          element.value = '2';
          element.header = 'Add Critical insurance'
          element.heading = 'Critical illness'
          element.logo = '/assets/images/svg/CIsmall.svg'
        } else if (element.insuranceType == 10) {
          element.value = '6';
          element.header = 'Add Fire insurance'
          element.heading = 'Fire insurance'
          element.logo = '/assets/images/svg/FIsmall.svg'
        } else if (element.insuranceType == 9) {
          element.value = '5';
          element.header = 'Add Home insurance'
          element.heading = 'Home insurance'
          element.logo = '/assets/images/svg/Hsmall.svg'
        } else if (element.insuranceType == 7) {
          element.value = '4';
          element.header = 'Add Personal accident'
          element.heading = 'Personal accident'
          element.logo = '/assets/images/svg/PAsmall.svg'
        } else if (element.insuranceType == 8) {
          element.value = '7';
          element.header = 'Add Travel insurance'
          element.heading = 'Travel insurance'
          element.logo = '/assets/images/svg/PAsmall.svg'
        } else if (element.insuranceType == 4) {
          element.value = '8';
          element.header = 'Add Motor insurance'
          element.heading = 'Motor insurance'
          element.logo = '/assets/images/svg/PAsmall.svg'
        }
      });
      console.log(this.dataSource)
      this.insuranceList = this.dataSource
      this.insurancePlanningList = this.dataSource;
    }
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
