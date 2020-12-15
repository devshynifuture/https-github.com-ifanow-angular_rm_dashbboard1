import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddExpensesComponent } from '../../../common-component/add-expenses/add-expenses.component';
import { AddBudgetComponent } from '../../../common-component/add-budget/add-budget/add-budget.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ConstantsService } from "../../../../../../../constants/constants.service";
import { PlanService } from '../../plan/plan.service';
import * as Highcharts from 'highcharts';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatSort, MatTableDataSource, MatBottomSheet } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from 'saturn-datepicker'
import { DetailedViewExpensesComponent } from '../../../common-component/detailed-view-expenses/detailed-view-expenses.component';
import { FormControl, FormBuilder } from '@angular/forms';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { RecurringCommitmentsDetailedViewComponent } from '../../../common-component/recurring-commitments-detailed-view/recurring-commitments-detailed-view.component';
import { FileUploadServiceService } from '../assets/file-upload-service.service';
import { BottomSheetComponent } from '../../../common-component/bottom-sheet/bottom-sheet.component';
import { element } from 'protractor';
import { CustomerService } from '../../customer.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';
import { forkJoin } from 'rxjs';
import { SummaryPlanServiceService } from '../../plan/summary-plan/summary-plan-service.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {

  reportDate;
  styleElement: HTMLStyleElement;
  colors: Array<string> = ["#FF8C00", "#00ff00"];

  displayedColumns = ['no', 'expense', 'date', 'desc', 'mode', 'amt', 'icons'];
  displayedColumns1 = ['no', 'expense', 'date', 'desc', 'mode', 'amt', 'icons'];

  dataSource = new MatTableDataSource([{}, {}, {}] as Array<any>);

  displayedColumns4 = ['no', 'expense', 'budget', 'progress', 'spent', 'icons'];
  displayedColumns5 = ['no', 'expense', 'budget', 'progress', 'spent', 'icons'];
  dataSource4 = new MatTableDataSource([] as Array<any>);
  dataSource5 = new MatTableDataSource([] as Array<any>);
  advisorId: any;
  clientId: any;
  viewMode;
  isLoading = false;
  dataSource1 = new MatTableDataSource([{}, {}, {}] as Array<any>);
  noData: string;
  startDate: string;
  endDate: string;
  @ViewChild('transactionExpens', { static: false }) transactionExpens: ElementRef;
  @ViewChild('budgetPdf', { static: false }) budgetPdf: ElementRef;
  @ViewChild('Transaction', { static: false }) TransactionSort: MatSort;
  @ViewChild('recurringTransactionTab', { static: false }) recurringTransactionTabSort: MatSort;
  @ViewChild('Budget', { static: false }) BudgetSort: MatSort;
  @ViewChild('recurringBudget', { static: false }) recurringBudgetSort: MatSort;
  personalProfileData: any;
  userInfo: any;
  clientData: any;
  apiHit = true;
  fragmentData = { isSpinner: false };
  details: any;
  getOrgData: any;
  selectedPeriod = '1';
  selectedDateRange: {};
  filterDate = [];
  startDateDisp: string;
  endDateDisp: string;
  budgetAmount = 0;
  basicAmount: any;
  basicAmountPercent: any;
  rdAmount: any;
  rdAmountPercent: any;
  lifeInsurance: any;
  lifeInsurancePercent: any;
  generalInsurance: any;
  generalInsurancePercent: any;
  liabilities: any;
  liabilitiesPercent: any;
  miscellaneousAmount: any;
  entertainmentAmount: any;
  educationAmount: any;
  transportAmount: any;
  housingAmount: any;
  spent: any;
  recurringTransaction: any;
  transaction: any;
  assetList: { name: string; }[];
  commitedInvestment: any;
  expenditure: any;
  expenseAssetData: any;
  isTabLoaded = false;
  chart: Highcharts.Chart;
  expenseChart: Highcharts.Chart;
  budgetChartSvg: Highcharts.Chart;
  isLoadingUpload: boolean = false;
  myFiles: any;
  fileUploadData: any;
  file: any;
  expenseList: any;
  recurringTrnList: any;
  expenseGraph: void;
  familyList: any;
  clientDob: any;
  billsAndUtilities: any;
  isLoadingBudget = false;
  tab = 'Transactions';
  allExpnseData: any;
  expenseStorage = {};
  storedData: any;
  refreshRequired: any;
  storedDataBudget: string;
  budgetStorage = {};
  refreshRequiredBudget: boolean;
  isAddedExpense: any;
  isAddedBudget: any;
  expenseId: any;
  budgetId: any;
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;
  // periodSelection: any;

  constructor(private fileUpload: FileUploadServiceService, private fb: FormBuilder,
    private datePipe: DatePipe, private subInjectService: SubscriptionInject,
    private planService: PlanService,
    private _bottomSheet: MatBottomSheet,
    private constantService: ConstantsService, private eventService: EventService,
    public dialog: MatDialog, private util: UtilService, public peopleService: PeopleService,
    private summaryPlanService: SummaryPlanServiceService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log(this.finPlanObj);
    this.summaryPlanService.getExpenseData()
      .subscribe(res => {
        this.storedData = '';
        this.storedData = res;
      })
    this.summaryPlanService.getBudgetData()
      .subscribe(res => {
        this.storedDataBudget = '';
        this.storedDataBudget = res;
      })
    this.summaryPlanService.getclientDob()
      .subscribe(res => {
        this.clientDob = res;
      })
    this.summaryPlanService.getFamilyList()
      .subscribe(res => {
        this.familyList = res;
      })
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.selectedPeriod = '1'
    if (this.finPlanObj) {
      this.getFinPlanBasedCall();
      // this.getListFamilyMem()
    } else {
      this.getStartAndEndDate('1');
      this.viewMode = 'Transactions';
      if (this.chekToCallApi()) {
        this.getListFamilyMem()
        // this.getAllExpense();
      } else {
        this.getAllExpenseResposne(this.storedData[this.startDate + '-' + this.endDate][0]);
      }
    }
    this.reportDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy')

    this.styleElement = document.createElement('style');
    this.changeColors();
    this.personalProfileData = AuthService.getProfileDetails();
    this.userInfo = AuthService.getUserInfo();
    this.clientData = AuthService.getClientData();
    this.details = AuthService.getProfileDetails();
    this.getOrgData = AuthService.getOrgDetails();
    // this.getExpenseGraphValue();
    // this.getBudgetGraphValues();
    // this.timePeriodSelection.setValue('1');
    // this.getTimePeriod();
    // this.getTransaction();
    // this.getAssetOfExpense();
    this.filterDate = [{ name: 'period' }]
    this.selectedDateRange = { begin: this.startDate, end: this.endDate };

    // setTimeout(() => {
    //   this.cashFlow('piechartExpense')

    // }, 300);
  }
  // getTimePeriod(){
  //   this.periodSelection = this.fb.group({
  //     timePeriodSelection: ['1'],

  //   });
  // }
  getFinPlanBasedCall() {
    switch (this.finPlanObj.sectionName) {
      case 'Expense This month':
        this.getStartAndEndDate(1);
        break;
      case 'Expense Last month':
        this.getStartAndEndDate(2);
        break;
      case 'Expense This quarter':
        this.getStartAndEndDate(3);
        break;
      case 'Expense Last quarter':
        this.getStartAndEndDate(4);
        break;
      case 'Expense This calender year':
        this.getStartAndEndDate(5);
        break;
      case 'Expense Last calender year':
        this.getStartAndEndDate(6);
        break;
      case 'Expense This financial year':
        this.getStartAndEndDate(7);
        break;
      case 'Expense Last financial year':
        this.getStartAndEndDate(8);
        break;
      case 'Budget This month':
        this.getStartAndEndDate(1);
        break;
      case 'Budget Last month':
        this.getStartAndEndDate(2);
        break;
      case 'Budget This quarter':
        this.getStartAndEndDate(3);
        break;
      case 'Budget Last quarter':
        this.getStartAndEndDate(4);
        break;
      case 'Budget This calender year':
        this.getStartAndEndDate(5);
        break;
      case 'Budget Last calender year':
        this.getStartAndEndDate(6);
        break;
      case 'Budget This financial year':
        this.getStartAndEndDate(7);
        break;
      case 'Budget Last financial year':
        this.getStartAndEndDate(8);
        break;
    }
    this.getListFamilyMem()
  }
  changeColors() {
    const head = document.getElementsByTagName('head')[0];
    const css = `
    .style1 .mat-progress-bar-fill::after {
      background-color: ${this.colors[0]} !important;
    }
  
    .style2 .mat-progress-bar-fill::after {
      background-color: ${this.colors[1]} !important;
    }
    `;
    this.styleElement.innerHTML = '';
    this.styleElement.type = 'text/css';
    this.styleElement.appendChild(document.createTextNode(css));
    head.appendChild(this.styleElement);

  }
  getExpenseGraphValue() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate: this.startDate,
      endDate: this.endDate

    };
    this.planService.getExpenseGraph(obj).subscribe(
      data => {
        if (data) {
          this.basicAmountPercent = data.Basic ? data.Basic.categoryWisePercentage : 0
          this.rdAmountPercent = data.RECURRING_DEPOSIT ? data.RECURRING_DEPOSIT.categoryWisePercentage : 0
          this.lifeInsurancePercent = data.LIFE_INSURANCE ? data.LIFE_INSURANCE.expenseAmount : 0
          this.commitedInvestment = data.COMMITTED_INVESTMENT ? data.COMMITTED_INVESTMENT.expenseAmount : 0
          this.expenditure = data.COMMITTED_EXPENDITURES ? data.COMMITTED_EXPENDITURES.expenseAmount : 0

          this.generalInsurancePercent = data.GENERAL_INSURANCE ? data.GENERAL_INSURANCE.expenseAmount : 0
          this.liabilitiesPercent = data.LIABILITIES ? data.LIABILITIES.expenseAmount : 0
          this.miscellaneousAmount = data.Miscellaneous ? data.Miscellaneous : 0;
          this.entertainmentAmount = data.Entertainment ? data.Entertainment : 0;
          // this.miscellaneousAmount = data.Billes_&_Utilies;
          this.billsAndUtilities = data.billsAndUtilities ? data.billsAndUtilities : 0;
          this.transportAmount = data.Transport ? data.Transport : 0;
          this.housingAmount = data.Housing ? data.Housing : 0;
          // this.spent = data.total ? data.total :0;
          this.cashFlow('piechartExpense')
        } else {
          this.cashFlow('piechartExpense')
        }
        console.log(data);
      }, (error) => {
        this.cashFlow('piechartExpense')

        this.eventService.showErrorMessage(error);

      }
    );
  }
  getAllExpense() {
    // !this.refreshRequired && 
    if (!this.storedData[this.startDate + '-' + this.endDate]) {
      this.dataSource.data = [{}, {}, {}];
      this.dataSource1.data = [{}, {}, {}];
      this.isLoading = true;
    }
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate: this.startDate,
      endDate: this.endDate,
      clientDob: this.clientDob,
      fmDobList: JSON.stringify(this.familyList)
    };
    this.planService.getAllExpense(obj).subscribe(
      data => {
        this.pushArray(data);
        this.getAllExpenseResposne(data);
        // this.isLoading = true;
      }, (error) => {
        this.expenseStorage[this.startDate + '-' + this.endDate] = [];
        this.expenseStorage[this.startDate + '-' + this.endDate].push([])
        this.summaryPlanService.setExpenseData(this.expenseStorage);
        this.dataSource.data = [];
        this.dataSource1.data = [];
        this.isLoading = false;
        this.eventService.showErrorMessage(error);
      }
    );
  }
  pushArray(data) {
    if (data) {
      // data = [...new Map(data.map(item => [item.id, item])).values()];
      // this.globalArray  = this.globalArray.flat();
      // this.pushIfAddOrEdit(data);
      if (this.expenseStorage[this.startDate + '-' + this.endDate] && this.refreshRequired) {
        this.expenseStorage[this.startDate + '-' + this.endDate] = [];
        this.expenseStorage[this.startDate + '-' + this.endDate].push(data)
      } else if (this.expenseStorage[this.startDate + '-' + this.endDate]) {
        this.expenseStorage[this.startDate + '-' + this.endDate].push(data)
      } else {
        this.expenseStorage[this.startDate + '-' + this.endDate] = [];
        this.expenseStorage[this.startDate + '-' + this.endDate].push(data)
      }

      // this.globalArray.push(data);
      // this.globalArray  = this.globalArray.flat();
      this.summaryPlanService.setExpenseData(this.expenseStorage);
    }
    console.log(this.expenseStorage);
  }
  pushIfAddOrEdit(data) {
    if (this.isAddedExpense) {
      if (this.storedData[this.startDate + '-' + this.endDate]) {
        let Obj = this.storedData[this.startDate + '-' + this.endDate][0];
        if (data.continueTill && data.repeatFrequency) {
          Obj.recurringExpenseList.push(data);
          Obj.recurringExpenseList = Obj.recurringExpenseList.flat();
        } else {
          Obj.expenseList.push(data);
          Obj.expenseList = Obj.expenseList.flat();
        }
        this.summaryPlanService.setExpenseData(this.storedData);
      } else {
        this.expenseStorage = {};
        this.expenseStorage[this.startDate + '-' + this.endDate] = [];
        this.expenseStorage[this.startDate + '-' + this.endDate].push(data)
        let Obj = this.expenseStorage[this.startDate + '-' + this.endDate][0];
        if (data.continueTill && data.repeatFrequency) {
          Obj.recurringExpenseList.push(data);
          Obj.recurringExpenseList = Obj.recurringExpenseList.flat();
        } else {
          Obj.expenseList.push(data);
          Obj.expenseList = Obj.expenseList.flat();
        }
        this.summaryPlanService.setExpenseData(this.expenseStorage);
      }
    } else {
      let Obj = this.storedData[this.startDate + '-' + this.endDate][0];
      if (data.continueTill && data.repeatFrequency) {
        Obj.recurringExpenseList = Obj.recurringExpenseList.filter(d => d.id != this.expenseId);
        Obj.recurringExpenseList.push(data);
        Obj.recurringExpenseList = Obj.recurringExpenseList.flat();
      } else {
        Obj.expenseList = Obj.expenseList.filter(d => d.id != this.expenseId);
        Obj.expenseList.push(data);
        Obj.expenseList = Obj.expenseList.flat();
      }
      this.summaryPlanService.setExpenseData(this.storedData);
    }
  }
  pushArrayBudget(data) {
    if (data) {
      // data = [...new Map(data.map(item => [item.id, item])).values()];
      // this.globalArray  = this.globalArray.flat();
      // this.pushIfAddOrEditBudget(data)
      if (this.budgetStorage[this.startDate + '-' + this.endDate] && this.refreshRequiredBudget) {
        this.budgetStorage[this.startDate + '-' + this.endDate] = [];
        this.budgetStorage[this.startDate + '-' + this.endDate].push(data)
      } else if (this.budgetStorage[this.startDate + '-' + this.endDate]) {
        this.budgetStorage[this.startDate + '-' + this.endDate].push(data)
      } else {
        this.budgetStorage[this.startDate + '-' + this.endDate] = [];
        this.budgetStorage[this.startDate + '-' + this.endDate].push(data)
      }

      // this.globalArray.push(data);
      // this.globalArray  = this.globalArray.flat();
      this.summaryPlanService.setBudgetData(this.budgetStorage);
    }
    console.log(this.budgetStorage);
  }
  pushIfAddOrEditBudget(data) {
    if (this.isAddedBudget) {
      if (this.storedDataBudget[this.startDate + '-' + this.endDate]) {
        let Obj = this.storedDataBudget[this.startDate + '-' + this.endDate][0];
        Obj[0].push(data);
        Obj[0] = Obj[0].flat();
        this.summaryPlanService.setBudgetData(this.storedDataBudget);
      } else {
        this.budgetStorage = {};
        this.budgetStorage[this.startDate + '-' + this.endDate] = [];
        this.budgetStorage[this.startDate + '-' + this.endDate].push(data)
        let Obj = this.budgetStorage[this.startDate + '-' + this.endDate][0];
        Obj[0].push(data);
        Obj[0] = Obj[0].flat();
        this.summaryPlanService.setBudgetData(this.budgetStorage);
      }
    } else {
      let Obj = this.storedDataBudget[this.startDate + '-' + this.endDate][0];
      Obj[0] = Obj[0].filter(d => d.id != this.budgetId);
      Obj[0].push(data);
      Obj[0] = Obj[0].flat();
      this.summaryPlanService.setBudgetData(this.storedDataBudget);
    }
  }
  getAllExpenseResposne(data) {
    if (data) {
      this.allExpnseData = data;
      // this.isLoading = true;
      this.expenseList = this.filterExpenseAndRecurring(data.expenseList);
      this.recurringTrnList = this.filterExpenseAndRecurring(data.recurringExpenseList);
      if (this.expenseList.length > 0) {
        this.expenseList.forEach(singleExpense => {
          const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
          if (singleExpenseCategory) {
            singleExpense.expenseType = singleExpenseCategory.expenseType;
          }
        });
      }
      this.transaction = this.expenseList;
      if (this.recurringTrnList.length > 0) {
        this.recurringTrnList.forEach(singleExpense => {
          const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
          if (singleExpenseCategory) {
            singleExpense.expenseType = singleExpenseCategory.expenseType;
          }
        });
      }
      this.recurringTransaction = this.recurringTrnList;
      let mergeArray = [...this.transaction, ...this.recurringTransaction];
      mergeArray = this.sorting(mergeArray, 'expenseType');
      // this.dataSource.data = data;
      this.dataSource.data = mergeArray
      this.dataSource.sort = this.TransactionSort;
      this.expenseGraph = data.expenseGraphData;
      this.isLoading = false;
      this.getExpenseGraphValueNew(this.expenseGraph);
      this.getAssetData(data);
      this.cd.detectChanges()
      if (this.finPlanObj) {
        let name = this.finPlanObj.sectionName;
        if (name == 'Expense This month' || name == 'Expense Last month' || name == 'Expense This quarter' || name == 'Expense Last quarter' || name == 'Expense This calender year' || name == 'Expense Last calender year' || name == 'Expense This financial year' || name == 'Expense Last financial year') {
          // this.loaded.emit(document.getElementById('templateExpense'));
          this.loaded.emit(this.transactionExpens.nativeElement);
        } else {
          this.getBudgetApis();
        }
      }
    }
  }
  sorting(data, filterId) {
    if (data) {
      data.sort((a, b) =>
        a[filterId] > b[filterId] ? 1 : (a[filterId] === b[filterId] ? 0 : -1)
      );
    }
    return data
  }
  filterExpenseAndRecurring(array) {
    if (array) {
      array = array.filter(item => item.totalAmount > 0);
    } else {
      array = [];
    }
    return array
  }
  getAssetData(data) {
    if (data) {
      let finalArray = [];
      let committedInvestmentExpense = this.filterAssetData(data.committedInvestmentExpense);
      let committedExpenditureExpense = this.filterAssetData(data.committedExpenditureExpense);
      let pord = this.filterAssetData(data.pordAsset);
      let lifeInsuranceList = this.filterAssetData(data.lifeInsuranceList);
      let generalInsuranceExpense = this.filterAssetData(data.generalInsurancePremium);
      let ssy = this.filterAssetData(data.ssyAsset);
      let loanExpense = this.filterAssetData(data.loanEmi);
      let recurringDeposit = this.filterAssetData(data.rdAsset);
      let sipExpense = this.filterAssetData(data.mutualFundSipList);
      this.expenseAssetData = data;
      finalArray = [...committedInvestmentExpense, ...committedExpenditureExpense, ...pord, ...lifeInsuranceList, ...generalInsuranceExpense, ...ssy, ...loanExpense, ...recurringDeposit, ...sipExpense];

      console.log(finalArray)
      this.dataSource1.data = finalArray;
      this.dataSource1.sort = this.recurringTransactionTabSort;
      this.dataSource5.data = this.dataSource1.data;
      if (finalArray.length > 0) {
        this.getGraphCalculations();
      }


      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', this.dataSource1.data);
    }
  }
  filterAssetData(data) {
    let obj;
    let filterArray = []
    if (data) {
      if (data[1].name == 'Pord') {
        data[1].name = 'Post office recurring deposits'
        data[0].assetList = data[0].pordList;
      } else if (data[1].name == 'Recurring deposits') {
        data[1].name = 'Bank recurring deposits'
      } else if (data[1].name == 'Sukanya samriddhi yojna') {
        data[0].assetList = data[0].ssyList;
      }
      obj = {
        name: data[1].name, total: data[2].total, assetList: data[0].assetList, progressPercentOther: 0, spentPerOther: 0, budgetPerOther: 0
      }
      obj.progressPercentOther = 0;
      obj.progressPercentOther += (data[2].total / data[2].total) * 100;
      obj.progressPercentOther = Math.round(obj.progressPercentOther);
      if (obj.progressPercentOther > 100) {
        obj.spentPerOther = 100;
        obj.budgetPerOther = obj.progressPercentOther - 100;
      } else {
        obj.spentPerOther = obj.progressPercentOther;
      }
    }
    if (obj) {
      // filterArray.push({name:data[1].name},{total:data[2].total},{});
      filterArray.push(obj);

    }
    return filterArray
  }
  filterAssetDataRd(data) {
    let obj;
    let filterArray = [];
    let mergeArray = [];
    if (data) {
      mergeArray = [...data[0].rdList, ...data[1].ssyList, ...data[2].pordList]
      obj = {
        name: data[3].name, total: data[4].total, assetList: mergeArray, progressPercentOther: 0, spentPerOther: 0, budgetPerOther: 0, dataPord: data[2].pordList, dataSsy: data[1].ssyList, dataRd: data[0].rdList
      }
      obj.progressPercentOther = 0;
      obj.progressPercentOther += (data[4].total / data[4].total) * 100;
      obj.progressPercentOther = Math.round(obj.progressPercentOther);
      if (obj.progressPercentOther > 100) {
        obj.spentPerOther = 100;
        obj.budgetPerOther = obj.progressPercentOther - 100;
      } else {
        obj.spentPerOther = obj.progressPercentOther;
      }
    }
    if (obj) {
      // filterArray.push({name:data[1].name},{total:data[2].total},{});
      filterArray.push(obj);

    }
    return filterArray
  }
  getExpenseGraphValueNew(data) {
    this.basicAmountPercent = data.Basic ? data.Basic.categoryWisePercentage : 0
    this.billsAndUtilities = data.Bills_Utilities ? data.Bills_Utilities.categoryWisePercentage : 0;
    this.educationAmount = data.Education ? data.Education.categoryWisePercentage : 0;
    this.entertainmentAmount = data.Entertainment ? data.Entertainment.categoryWisePercentage : 0;
    this.housingAmount = data.Housing ? data.Housing.categoryWisePercentage : 0;
    this.miscellaneousAmount = data.Miscellaneous ? data.Miscellaneous.categoryWisePercentage : 0;
    this.transportAmount = data.Transport ? data.Transport.categoryWisePercentage : 0;
    this.rdAmountPercent = data.RECURRING_DEPOSIT ? data.RECURRING_DEPOSIT.categoryWisePercentage : 0
    this.lifeInsurancePercent = data.LIFE_INSURANCE ? data.LIFE_INSURANCE.expenseAmount : 0
    this.commitedInvestment = data.committedInvestment ? data.committedInvestment.categoryWisePercentage : 0
    this.expenditure = data.committedExpenditure ? data.committedExpenditure.categoryWisePercentage : 0
    this.generalInsurancePercent = data.GENERAL_INSURANCE ? data.GENERAL_INSURANCE.expenseAmount : 0
    this.liabilitiesPercent = data.LIABILITIES ? data.LIABILITIES.expenseAmount : 0
    // this.miscellaneousAmount = data.Billes_&_Utilies;
    // this.spent = data.total ? data.total : 0;
    if (this.tab == 'Transactions' && this.dataSource.data.length > 0) {
      this.cashFlow('piechartExpense')
    }
  }
  getBudgetGraphValues() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.planService.getBudgetGraph(obj).subscribe(
      data => {
        if (data) {
          this.budgetAmount = data.budgetAmount
          this.budgetChart('bugetChart')
        } else {
          this.budgetChart('bugetChart')
        }

      }, (error) => {
        this.budgetChart('bugetChart')
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getStartAndEndDate(val) {
    var date = new Date();
    if (val == '1') {
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else if (val == '2') {
      var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    } else if (val == '3') {
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 3, 0);

    } else if (val == '4') {
      var firstDay = new Date(date.getFullYear(), date.getMonth() - 3, 1);
      var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 3, 0);
    } else if (val == '5') {
      var firstDay = new Date(date.getFullYear(), 0, 1);
      var lastDay = new Date(date.getFullYear(), 11, 31);
    } else if (val == '6') {
      var firstDay = new Date(date.getFullYear() - 1, 0, 1);
      var lastDay = new Date(date.getFullYear() - 1, 11, 31);
    } else if (val == '7') {
      var firstDay = new Date(date.getFullYear(), 3, 1);
      var lastDay = new Date(date.getFullYear() + 1, 2, 31);
    } else if (val == '8') {
      var firstDay = new Date(date.getFullYear() - 1, 3, 1);
      var lastDay = new Date(date.getFullYear(), 2, 31);
    }

    this.startDate = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    this.startDateDisp = this.datePipe.transform(firstDay, 'dd-MM-yyyy');
    this.endDateDisp = this.datePipe.transform(lastDay, 'dd-MM-yyyy');
    console.log('start Date,,,,,,,,,,,,,,,,', this.startDate);
    console.log('endDate,,,,,,,,,,,,,,,,', this.endDate);

  }
  generatePdf(tmp) {

    let header;
    this.fragmentData.isSpinner = true;
    let para = document.getElementById(tmp);
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);
    if (tmp == 'templateExpense') {
      let expenseSvg = this.expenseChart.getSVG();
      header = this.transactionExpens.nativeElement.innerHTML
      this.util.htmlToPdf('', para.innerHTML, 'Expense', 'true', this.fragmentData, 'showPieChart', expenseSvg, false);

    } else {
      let budgetSvg = this.budgetChartSvg.getSVG();
      header = this.budgetPdf.nativeElement.innerHTML
      this.util.htmlToPdf('', para.innerHTML, 'Budget', 'true', this.fragmentData, 'showPieChart', budgetSvg, false);


    }


  }

  Excel(tableTitle, tmp) {
    setTimeout(() => {
      var blob = new Blob([document.getElementById(tmp).innerHTML], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      saveAs(blob, tableTitle + '.xls');
    }, 200);
    // if (data) {
    //   this.fragmentData.isSpinner = false;
    // }
  }
  budgetChart(id) {
    this.cd.markForCheck();
    this.cd.detectChanges();
    this.budgetChartSvg = Highcharts.chart('bugetChart', {

      title: {
        text: 'Budget'
      },
      xAxis: {
        categories: ['Buget', 'Spent']
      },

      series: [{
        type: 'column',
        colorByPoint: true,
        color: "#5cc644",
        data: [{
          y: this.budgetAmount,
          color: "#5cc644"
        }, {
          y: this.spent,
          color: "#f3ae40"
        }],
        showInLegend: false
      }]

    });
  }
  fetchData(value, fileName, element) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      familyMemberId: element.familyMemberId,
      asset: value
    }
    this.myFiles = [];
    for (let i = 0; i < fileName.target.files.length; i++) {
      this.myFiles.push(fileName.target.files[i]);
    }
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent, {
      data: this.myFiles,
    });
    this.fileUploadData = this.fileUpload.fetchFileUploadData(obj, this.myFiles);
    if (this.fileUploadData) {
      this.file = fileName
      this.fileUpload.uploadFile(fileName)
    }
    setTimeout(() => {
      this.isLoadingUpload = false
    }, 7000);
  }
  getBugetTab(tab) {
    this.tab = tab;
    this.isTabLoaded = true;
    if (tab == 'Budget') {
      if (this.chekToCallApiBudget()) {
        this.getBudgetApis()
      } else {
        this.getBudgetApisResponse(this.storedDataBudget[this.startDate + '-' + this.endDate][0]);
      }
      // this.getBudgetGraphValues();
      // this.getBudgetList();
      // this.getBugetRecurring();

      // this.getBudgetApis();
      // setTimeout(() => {
      //   this.budgetChart('bugetChart')

      // }, 300);
    } else {
      if (this.chekToCallApi()) {
        this.getAllExpense();
      } else {
        this.getAllExpenseResposne(this.storedData[this.startDate + '-' + this.endDate][0]);
      }
      // this.getTransaction();
      // this.getAssetOfExpense();
      // this.getAllExpense();
      // this.getExpenseGraphValue();
      // setTimeout(() => {
      //   this.cashFlow('piechartExpense')

      // }, 300);
    }
  }
  getBudgetApis() {
    // if(!this.refreshRequiredBudget){
    this.dataSource4.data = [{}, {}, {}];
    this.dataSource5.data = [{}, {}, {}];
    this.isLoadingBudget = true;
    // }
    const obj1 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    const obj2 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
      clientDob: this.clientDob,
      fmDobList: JSON.stringify(this.familyList)
    };
    const obj3 = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate: this.startDate,
      endDate: this.endDate
    };
    const budgetList = this.planService.getBudget(obj1);
    const BudgetRecurring = this.planService.otherCommitmentsGet(obj2);
    const BudgetGraph = this.planService.getBudgetGraph(obj3);
    forkJoin(budgetList, BudgetRecurring, BudgetGraph).subscribe(result => {
      this.pushArrayBudget(result);
      this.getBudgetApisResponse(result);
    }, err => {
      // this.eventService.openSnackBar(err, 'Dismiss');
      this.budgetStorage[this.startDate + '-' + this.endDate] = [];
      this.budgetStorage[this.startDate + '-' + this.endDate].push([])
      this.summaryPlanService.setBudgetData(this.budgetStorage);
      this.dataSource4.data = [];
      this.dataSource5.data = [];
      this.budgetChart('bugetChart');
      this.isLoadingBudget = false;
    })
  }
  getBudgetApisResponse(result) {
    let budgetList = this.filterData(result[0]);
    let budgetRecurring = this.filterData(result[1]);
    let mergeArray = [...budgetList, ...budgetRecurring];
    mergeArray = this.sorting(mergeArray, 'expenseType');
    this.dataSource4.data = mergeArray;
    this.dataSource4.sort = this.BudgetSort;
    this.dataSource5.data = this.dataSource1.data;
    this.dataSource5.sort = this.recurringBudgetSort;
    this.isLoadingBudget = false;
    if (this.allExpnseData) {
      this.getAssetData(this.allExpnseData);
    }
    this.getGraphCalculations();
    // this.loaded.emit(document.getElementById('template2'));
    this.loaded.emit(this.budgetPdf.nativeElement);

    // if (result[2]) {
    //   this.budgetAmount = result[2].budgetAmount
    //   this.budgetChart('bugetChart');
    // } else {
    //   this.budgetChart('bugetChart');
    // }

  }
  getGraphCalculations() {
    if (this.dataSource4.data.length > 0) {
      let mergeSpentArray = [...this.dataSource4.data, ...this.dataSource5.data];
      this.spent = 0;
      this.budgetAmount = 0;
      mergeSpentArray.forEach(element => {
        this.spent += (element.spent == 0) ? 0 : element.spent ? element.spent : element.total ? element.total : 0
        this.budgetAmount += (element.totalAmount == 0) ? 0 : element.totalAmount ? element.totalAmount : element.total ? element.total : 0
      })
      if (this.tab == 'Budget') {
        this.budgetChart('bugetChart');
      }
    }
  }
  filterData(array) {
    if (array) {
      array = array.filter(item => item.totalAmount > 0);
      array.forEach(singleExpense => {
        singleExpense.progressPercent = 0;
        singleExpense.progressPercent += (singleExpense.spent / singleExpense.amount) * 100;
        singleExpense.progressPercent = Math.round(singleExpense.progressPercent);
        if (singleExpense.progressPercent > 100) {
          singleExpense.spentPer = 100;
          singleExpense.budgetPer = singleExpense.progressPercent - 100;
        } else {
          singleExpense.spentPer = singleExpense.progressPercent;
        }
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.budgetCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
    } else {
      array = [];
    }

    return array;
  }
  getListFamilyMem() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        if (data) {
          let array = [];
          data.forEach(element => {
            if (element.familyMemberId == 0) {
              this.clientDob = this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd');
            } else {
              const obj = {
                'dob': this.datePipe.transform(new Date(element.dateOfBirth), 'yyyy-MM-dd'),
                'id': element.familyMemberId
              }
              array.push(obj);
            }

          });
          this.familyList = array.map(function (obj, ind) {
            let val = obj.id;
            obj[val] = obj['dob']
            delete obj['dob'];
            delete obj['id'];
            return obj;
          });
          this.summaryPlanService.setclientDob(this.clientDob);
          this.summaryPlanService.setFamilyList(this.familyList);

        }
        if (!this.finPlanObj) {
          if (this.chekToCallApi()) {
            this.getAllExpense();
          } else {
            this.getAllExpenseResposne(this.storedData[this.startDate + '-' + this.endDate][0]);
          }
        } else {
          let name = this.finPlanObj.sectionName;
          if (name == 'Expense This month' || name == 'Expense Last month' || name == 'Expense This quarter' || name == 'Expense Last quarter' || name == 'Expense This calender year' || name == 'Expense Last calender year' || name == 'Expense This financial year' || name == 'Expense Last financial year') {
            this.viewMode = 'Transactions';
            this.getAllExpense();
          } else {
            this.viewMode = 'Budget';
            this.getAllExpense();
          }
        }


      }, err => {
        this.getAllExpense();
      }
    );

    // this.isLoading = true;

  }
  removeDate(item) {
    this.filterDate.splice(item, 1);


  }
  chekToCallApi() {
    return this.storedData && this.storedData[this.startDate + '-' + this.endDate] ? false : true
  }
  chekToCallApiBudget() {
    return this.storedDataBudget && this.storedDataBudget[this.startDate + '-' + this.endDate] ? false : true
  }
  cashFlow(id) {
    this.cd.markForCheck();
    this.cd.detectChanges();
    console.log(id);
    this.expenseChart = Highcharts.chart('piechartExpense', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: 0,
          endAngle: 360,
          center: ['50%', '50%'],
          size: '85%',
          showInLegend: true
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        data: [
          {
            name: 'Basic',
            y: this.basicAmountPercent,
            color: "#1F78B4",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Bills & Utilities',
            y: this.billsAndUtilities,
            color: "#A6CEE3",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Transport',
            y: this.transportAmount,
            color: "#B2DF8A",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Education',
            y: this.educationAmount,
            color: "#33A02C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Housing',
            y: this.housingAmount,
            color: "#FB9A99",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Entertainment',
            y: this.entertainmentAmount,
            color: "#E31A1C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Miscellaneous',
            y: this.miscellaneousAmount,
            color: "#FDBF6F",
            dataLabels: {
              enabled: false
            }
          },
          {
            name: 'Committed investment',
            y: this.commitedInvestment,
            color: "#f46a4e",
            dataLabels: {
              enabled: false
            }
          },
          {
            name: 'Committed expenditure',
            y: this.expenditure,
            color: "#FFFF00",
            dataLabels: {
              enabled: false
            }
          },
          // {
          //   name: 'General insurance',
          //   y: this.generalInsurancePercent,
          //   color: "#FF5733",
          //   dataLabels: {
          //     enabled: false
          //   }
          // },
          // {
          //   name: 'Liabilities',
          //   y: this.liabilitiesPercent,
          //   color: "#ECFF33",
          //   dataLabels: {
          //     enabled: false
          //   }
          // },

        ]
      }]
    });
  }
  getBudgetList() {
    this.isLoadingBudget = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    this.dataSource4.data = [{}, {}, {}];
    this.planService.getBudget(obj).subscribe(
      data => this.getBudgetRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource4.data = [];
        this.noData = 'No data found';
        this.isLoadingBudget = false;
      }
    );
  }
  getBudgetRes(data) {
    if (data == undefined) {
      this.noData = 'No data found';
      this.dataSource4.data = [];
    }
    if (data) {
      data.forEach(singleExpense => {
        singleExpense.progressPercent = 0;
        singleExpense.progressPercent += (singleExpense.spent / singleExpense.amount) * 100;
        singleExpense.progressPercent = Math.round(singleExpense.progressPercent);
        if (singleExpense.progressPercent > 100) {
          singleExpense.spentPer = 100;
          singleExpense.budgetPer = singleExpense.progressPercent - 100;
        } else {
          singleExpense.spentPer = singleExpense.progressPercent;
        }
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.budgetCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.dataSource4.data = data;
      this.dataSource4.sort = this.BudgetSort;
    }
    this.isLoadingBudget = false;
    console.log('getBudgetRes', data)
  }
  getBugetRecurring() {
    this.isLoadingBudget = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
      clientDob: this.clientDob,
      fmDobList: JSON.stringify(this.familyList)
    };
    this.dataSource5.data = [{}, {}, {}];
    this.planService.otherCommitmentsGet(obj).subscribe(
      data => this.otherCommitmentsGetRes(data), (error) => {
        // this.eventService.showErrorMessage(error);
        this.dataSource5.data = [];
        this.noData = 'No data found';
        this.isLoadingBudget = false;
      }
    );
  }
  otherCommitmentsGetRes(data) {
    if (data == undefined || data == 304) {
      this.noData = 'No data found';
      this.dataSource5.data = [];
    }
    if (data) {
      data.forEach(singleExpense => {
        singleExpense.progressPercentOther = 0;
        singleExpense.progressPercentOther += (singleExpense.spent / singleExpense.amount) * 100;
        singleExpense.progressPercentOther = Math.round(singleExpense.progressPercentOther);
        if (singleExpense.progressPercentOther > 100) {
          singleExpense.spentPerOther = 100;
          singleExpense.budgetPerOther = singleExpense.progressPercentOther - 100;
        } else {
          singleExpense.spentPerOther = singleExpense.progressPercentOther;
        }
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.budgetCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.dataSource5.data = data;
      this.dataSource5.sort = this.recurringBudgetSort;
    } else {
      this.noData = 'No data found';
      this.dataSource5.data = [];
    }
    this.isLoadingBudget = false;
    console.log('otherCommitmentsGetRes', data)
  }
  addFilterPeriod(value) {
    let val = value.value
    this.getStartAndEndDate(val);
    // this.getTransaction();
    // this.getRecuringTransactions();
    if (this.chekToCallApi()) {
      this.getAllExpense();
    } else {
      this.getAllExpenseResposne(this.storedData[this.startDate + '-' + this.endDate][0]);
    }
    if (this.chekToCallApiBudget()) {
      this.getBudgetApis()
    } else {
      this.getBudgetApisResponse(this.storedDataBudget[this.startDate + '-' + this.endDate][0]);
    }
    // this.getAllExpense();
    // this.getBudgetList();
    // this.getBugetRecurring();
    this.selectedDateRange = { begin: this.startDate, end: this.endDate };
  }
  getRecuringTransactions() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    // this.dataSource1.data = [{}, {}, {}];
    this.planService.getRecuringExpense(obj).subscribe(
      data => this.getRecuringExpenseRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.noData = 'No data found';
        this.isLoading = false;
      }
    );
  }
  getRecuringExpenseRes(data) {
    if (!data) {
      this.noData = 'No data found';
      this.recurringTransaction = data;
      if (this.recurringTransaction && this.transaction) {
        this.dataSource.data = [...this.transaction, ...this.recurringTransaction];
      } else {
        this.dataSource.data = [...this.transaction];
      }

      // this.dataSource.data = data;
      this.dataSource.sort = this.TransactionSort;
      // this.dataSource1.data = [];
    }
    console.log(data);
    if (data) {
      data.forEach(singleExpense => {
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.recurringTransaction = data;
      this.dataSource.data = [...this.transaction, ...this.recurringTransaction];

      // this.dataSource.data = data;
      this.dataSource.sort = this.TransactionSort;
      // this.dataSource1.data = data;

      // this.dataSource1.sort = this.sort;
    }
    this.isLoading = false;

    // this.cashFlow('piechartExpense')
  }
  getTransaction() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate: this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    this.isLoading = true;
    // this.dataSource.data = [{}, {}, {}];
    this.planService.getTransactionExpense(obj).subscribe(
      data => this.getTransactionExpenseRes(data), (error) => {
        this.getRecuringTransactions();
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.noData = 'No data found';
        this.isLoading = false;
      }
    );
  }
  getTransactionExpenseRes(data) {
    this.getRecuringTransactions();
    // this.cashFlow('piechartExpense')
    if (data == undefined) {
      this.noData = 'No data found';
      this.dataSource.data = [];
    }
    // this.isLoading = false;
    console.log(data);
    if (data) {
      data.forEach(singleExpense => {
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.transaction = data;
      // this.dataSource.data = data;
      // this.dataSource.sort = this.sort;

    } else {
      this.noData = 'No data found';
      this.dataSource.data = [];
    }
    this.cashFlow('piechartExpense')

  }
  getAssetOfExpense() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      endDate: this.endDate,
      startDate: this.startDate,
    };
    this.isLoading = true;
    // this.dataSource1.data = [{}, {}, {}];
    this.planService.getAssetsOfExpense(obj).subscribe(
      data => {
        if (data) {
          this.expenseAssetData = data;
          let finalArray = [];
          let dataAsset = data;
          this.assetList = [{ name: 'pord' }, { name: 'ssy' }, { name: 'recurringDeposit' }, { name: 'mutualfund' }]
          Object.entries(this.assetList).forEach(([key, value]) => {

            let obj = value.name
            let assetData = dataAsset[obj];
            if (assetData) {
              assetData.forEach(element => {
                finalArray.push(element)
              });
            }

            console.log(key, value);
          });
          this.dataSource1.data = finalArray;
          this.dataSource1.sort = this.recurringTransactionTabSort;


          console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', this.dataSource1.data);
        }
      }, (error) => {
        this.getRecuringTransactions();
        this.eventService.showErrorMessage(error);
        this.dataSource1.data = [];
        this.noData = 'No data found';
        this.isLoading = false;
      }
    );
  }
  deleteModal(value, data) {
    let deletedId = data.id;
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (value == 'expense' && data.repeatFrequency && data.continueTill) {
          this.planService.deleteExpenseRecurring(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Recurring expense transaction is deleted', 'Dismiss');
              this.refreshRequired = true;
              this.expenseStorage = {};
              this.storedData = "";
              this.getAllExpense();
              dialogRef.close();
              // this.getRecuringTransactions();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'expense' && !data.repeatFrequency && !data.continueTill) {
          this.planService.deleteExpenseTransaction(data.id).subscribe(
            data => {
              // this.refreshRequired = true;
              // this.expenseStorage = {};
              // this.storedData = "";
              this.deleteId(deletedId);
              this.eventService.openSnackBar('Expense transaction is deleted', 'Dismiss');
              // this.getAllExpense();
              dialogRef.close();
              // this.getTransaction();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'budget' && data.repeatFrequency && data.continueTill) {
          this.planService.deleteRecuringBudget(data.id).subscribe(
            data => {
              this.deleteIdBudget(deletedId);
              this.eventService.openSnackBar('Buget is deleted', 'Dismiss');
              dialogRef.close();
              // this.refreshRequiredBudget = true;
              // this.budgetStorage = {};
              // this.storedDataBudget = "";
              // this.getBudgetApis();
              // this.getBudgetList();
              // this.getBugetRecurring();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.planService.deletBudget(data.id).subscribe(
            data => {
              this.deleteIdBudget(deletedId);
              this.eventService.openSnackBar('Recurring budget is deleted', 'Dismiss');
              dialogRef.close();
              // this.refreshRequiredBudget = true;
              // this.budgetStorage = {};
              // this.storedDataBudget = "";
              // this.getBudgetApis();
              // this.getBudgetList();
              // this.getBugetRecurring();
            },
            error => this.eventService.showErrorMessage(error)
          );
        }
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteId(id) {
    let Obj = this.storedData;
    Object.keys(Obj).map(key => {
      Obj[key].forEach((singleData) => {
        if (singleData.expenseList) {
          singleData.expenseList = singleData.expenseList.filter(d => d.id != id);
        }
        if (singleData.recurringExpenseList) {
          singleData.recurringExpenseList = singleData.recurringExpenseList.filter(d => d.id != id);
        }
      });
    });
    this.summaryPlanService.setExpenseData(Obj);
    this.getAllExpenseResposne(this.storedData[this.startDate + '-' + this.endDate][0]);
  }
  deleteIdBudget(id) {
    let Obj = this.storedDataBudget;
    Object.keys(Obj).map(key => {
      Obj[key].forEach((singleData) => {
        if (singleData[0]) {
          singleData[0] = singleData[0].filter(d => d.id != id);
        }
        if (singleData[1]) {
          singleData[1] = singleData[1].filter(d => d.id != id);
        }
      });
    });
    this.summaryPlanService.setBudgetData(Obj);
    this.getBudgetApisResponse(this.storedDataBudget[this.startDate + '-' + this.endDate][0]);
  }
  openExpenses(value, data) {
    if (data == null) {
      data = {}
      data.flag = value
    } else {
      data.flag = value
    }
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open35',
      componentName: AddExpensesComponent
    };
    fragmentData.data.getData = {
      expenseList: this.dataSource.data,
      budgetList: this.dataSource4.data,
      otherCommitments: this.dataSource5.data
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {

            if (sideBarData.value == 'editExpense' || sideBarData.value == 'addExpense' || sideBarData.value == 'addRecurringTrn' || sideBarData.value == 'editRecurringTrn') {
              // this.getTransaction();
              this.isAddedExpense = sideBarData.isAdded;
              this.expenseId = sideBarData.data;
              this.refreshRequired = sideBarData.refreshRequired;
              this.expenseStorage = {};
              this.storedData = "";
              this.getAllExpense();
              // this.getExpenseGraphValue();
            } else if (sideBarData.value == 'editBudget' || sideBarData.value == 'addBudget') {
              // this.getBudgetList();
              this.isAddedBudget = sideBarData.isAdded;
              this.budgetId = sideBarData.data;
              this.refreshRequiredBudget = sideBarData.refreshRequired;
              this.budgetStorage = {};
              this.storedDataBudget = "";
              this.getBudgetApis();
              // this.getBudgetGraphValues();
            } else {
              this.isAddedBudget = sideBarData.isAdded;
              this.refreshRequiredBudget = sideBarData.refreshRequired;
              this.budgetId = sideBarData.data;
              this.budgetStorage = {};
              this.storedDataBudget = "";
              this.getBudgetApis();
              // this.getBugetRecurring();
              // this.getBudgetGraphValues();
            }
            console.log('this is sidebardata in subs subs 2: ', sideBarData);
          }

          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  detailedViewExpense(data, value) {
    const fragmentData = {
      flag: 'detailedView',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewExpensesComponent
    };
    if (this.tab == 'Transactions' && data.continueTill && data.repeatFrequency) {
      fragmentData.data.value = 'Recurring transaction';
    } else if (this.tab == 'Budget' && data.continueTill && data.repeatFrequency) {
      fragmentData.data.value = 'Budget';
    } else if (this.tab == 'Transactions' && !data.continueTill && !data.repeatFrequency) {
      fragmentData.data.value = 'Transactions';
    } else {
      fragmentData.data.value = 'Budget';
    }

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
  detailedViewRecurring(data, value) {
    data.startDate = this.startDateDisp;
    data.endDate = this.endDateDisp;

    const fragmentData = {
      flag: 'detailedView',
      data: data,
      id: 1,
      state: 'open50',
      componentName: RecurringCommitmentsDetailedViewComponent
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
  openExpensesBuget(value) {
    const fragmentData = {
      flag: value,
      id: 1,
      state: 'open35',
      componentName: AddExpensesComponent
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

export interface PeriodicElement {
  no: string;
  expense: string;
  date: string;
  desc: string;
  mode: string;
  amt: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { no: '1', expense: 'Groceries', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600' },
  {
    no: '2',
    expense: 'Driver’s salary',
    date: '27/09/2019',
    desc: 'IIN/RFND/I-Debit/Make My',
    mode: 'Cash',
    amt: '4,600'
  },
  { no: '3', expense: 'School fees', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600' },
  { no: '4', expense: 'Dining out', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600' },
  { no: '5', expense: 'Groceries', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600' },
];


export interface PeriodicElement4 {
  no: string;
  expense: string;
  budget: string;
  progress: string;
  spent: string;
  icons: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { no: '1', expense: 'Groceries', budget: '49,000', progress: ' ', spent: '8,400', icons: '' },
  { no: '2', expense: 'Transportation', budget: '8,000', progress: ' ', spent: '7,200', icons: '' },
  { no: '3', expense: 'School fees', budget: '5,600', progress: ' ', spent: '5,600', icons: '' },
  { no: '4', expense: 'Dining out', budget: '3,000', progress: ' ', spent: '3,700', icons: '' },
  { no: '5', expense: 'Leisure & Entertainment', budget: '2,000', progress: ' ', spent: '0', icons: '' },

];



