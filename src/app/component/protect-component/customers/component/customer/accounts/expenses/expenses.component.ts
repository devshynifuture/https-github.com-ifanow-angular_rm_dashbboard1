import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import {DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter} from 'saturn-datepicker'
import { DetailedViewExpensesComponent } from '../../../common-component/detailed-view-expenses/detailed-view-expenses.component';
import { FormControl, FormBuilder } from '@angular/forms';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { RecurringCommitmentsDetailedViewComponent } from '../../../common-component/recurring-commitments-detailed-view/recurring-commitments-detailed-view.component';
import { FileUploadServiceService } from '../assets/file-upload-service.service';
import { BottomSheetComponent } from '../../../common-component/bottom-sheet/bottom-sheet.component';
import { element } from 'protractor';

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
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
    dateInput: 'input',
    monthYearLabel: {year: 'numeric', month: 'short'},
    dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
    monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  
  reportDate;
  // styleElement: HTMLStyleElement;
  // colors : Array<string> = ["#FF8C00", "#00ff00"];

  displayedColumns = ['no', 'expense', 'date', 'desc', 'mode', 'amt', 'icons'];
  displayedColumns1 = ['no', 'expense', 'date', 'desc', 'mode', 'amt','icons'];

  dataSource = new MatTableDataSource([] as Array<any>);

  displayedColumns4 = ['no', 'expense', 'budget', 'progress', 'spent', 'icons'];
  displayedColumns5 = ['no', 'expense', 'budget', 'progress', 'spent', 'icons'];
  dataSource4 = new MatTableDataSource([] as Array<any>);
  dataSource5 = new MatTableDataSource([] as Array<any>);
  advisorId: any;
  clientId: any;
  viewMode;
  isLoading = false;
  dataSource1 = new MatTableDataSource([] as Array<any>);
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
  fragmentData = { isSpinner: false };
  details: any;
  getOrgData: any;
  selectedPeriod: string;
  selectedDateRange: {};
  filterDate =[];
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

  // periodSelection: any;

  constructor(private fileUpload: FileUploadServiceService,private fb: FormBuilder,
    private datePipe: DatePipe,private subInjectService: SubscriptionInject, 
    private planService: PlanService,
    private _bottomSheet : MatBottomSheet,
    private constantService: ConstantsService, private eventService: EventService,
     public dialog: MatDialog,private util:UtilService) {
  }

  ngOnInit() {
    this.selectedPeriod = '1'
    this.viewMode = 'Transactions';
  // this.styleElement = document.createElement('style');
  // this.changeColors();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.personalProfileData = AuthService.getProfileDetails();
    this.userInfo = AuthService.getUserInfo();
    this.clientData = AuthService.getClientData();
    this.details = AuthService.getProfileDetails();
    this.getOrgData = AuthService.getOrgDetails();
    this.getStartAndEndDate('1');
    this.getAllExpense();
    // this.getExpenseGraphValue();
    // this.getBudgetGraphValues();
    // this.timePeriodSelection.setValue('1');
    // this.getTimePeriod();
    // this.getTransaction();
    // this.getAssetOfExpense();
    this.filterDate = [{name:'period'}]
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
  // changeColors() {
  //   const head = document.getElementsByTagName('head')[0];
  //   const css = `
  //   .style1 .mat-progress-bar-fill::after {
  //     background-color: ${this.colors[0]} !important;
  //   }
  
  //   .style2 .mat-progress-bar-fill::after {
  //     background-color: ${this.colors[1]} !important;
  //   }
  //   `;
  //   this.styleElement.innerHTML = '';
  //   this.styleElement.type = 'text/css';
  //   this.styleElement.appendChild(document.createTextNode(css));
  //   head.appendChild(this.styleElement);
  
  // }
  getExpenseGraphValue(){
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate : this.startDate, 
      endDate: this.endDate
     
    };
    this.planService.getExpenseGraph(obj).subscribe(
      data => {
        if(data){
          this.basicAmountPercent =  data.Basic ? data.Basic.categoryWisePercentage : 0
          this.rdAmountPercent =  data.RECURRING_DEPOSIT ? data.RECURRING_DEPOSIT.categoryWisePercentage : 0
          this.lifeInsurancePercent = data.LIFE_INSURANCE ? data.LIFE_INSURANCE.expenseAmount : 0
          this.commitedInvestment = data.COMMITTED_INVESTMENT ? data.COMMITTED_INVESTMENT.expenseAmount : 0
          this.expenditure = data.COMMITTED_EXPENDITURES ? data.COMMITTED_EXPENDITURES.expenseAmount : 0

          this.generalInsurancePercent = data.GENERAL_INSURANCE ? data.GENERAL_INSURANCE.expenseAmount : 0
          this.liabilitiesPercent = data.LIABILITIES ? data.LIABILITIES.expenseAmount : 0
          this.miscellaneousAmount = data.Miscellaneous;
          this.entertainmentAmount = data.Entertainment;
          this.educationAmount = data.Education;
          // this.miscellaneousAmount = data.Billes_&_Utilies;
          this.transportAmount = data.Transport;
          this.housingAmount = data.Housing;
          this.spent = data.total;
          this.cashFlow('piechartExpense')
        }else{
          this.cashFlow('piechartExpense')
        }
        console.log(data);
      }, (error) => {
        this.cashFlow('piechartExpense')

        this.eventService.showErrorMessage(error);
        
      }
    );
  }
  getAllExpense(){
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.dataSource1.data = [{}, {}, {}];
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate:this.startDate, 
      endDate:this.endDate
    };
    this.planService.getAllExpense(obj).subscribe(
      data => {
        if(data){
          this.expenseList = data.expenseList;
          this.recurringTrnList = data.recurringExpenseList;
          this.expenseList.forEach(singleExpense => {
            const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
            if (singleExpenseCategory) {
              singleExpense.expenseType = singleExpenseCategory.expenseType;
            }
          });
          this.transaction = this.expenseList;
          this.recurringTrnList.forEach(singleExpense => {
            const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
            if (singleExpenseCategory) {
              singleExpense.expenseType = singleExpenseCategory.expenseType;
            }
          });
          this.recurringTransaction = this.recurringTrnList;
          this.dataSource.data = [ ...this.transaction, ...this.recurringTransaction];
    
          // this.dataSource.data = data;
          this.dataSource.sort = this.TransactionSort;
          this.expenseGraph = data.expenseGraphData;
          this.getExpenseGraphValueNew(this.expenseGraph);
          this.getAssetData(data);
          console.log('All expense data',data);
        }
        this.isLoading = false;
      }, (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getAssetData(data){
    if(data){
      let finalArray=[];
      let committedInvestmentExpense =  this.filterAssetData(data.committedInvestmentExpense);
      let committedExpenditureExpense =  this.filterAssetData(data.committedExpenditureExpense);
      let pord =  this.filterAssetData(data.pord);
      let lifeInsuranceList=  this.filterAssetData(data.lifeInsuranceList);
      let generalInsuranceExpense = this.filterAssetData(data.generalInsurancePremium);
      let ssy = this.filterAssetData(data.ssy);
      let loanExpense = this.filterAssetData(data.loanEmi);
      let recurringDeposit = this.filterAssetData(data.recurringAssetList);
      let sipExpense = this.filterAssetData(data.mutualFundSipList);
      this.expenseAssetData = data;
       finalArray = [...committedInvestmentExpense, ...committedExpenditureExpense,...pord,...lifeInsuranceList,...generalInsuranceExpense,...ssy,...loanExpense,...recurringDeposit,...sipExpense];

      console.log(finalArray)
      this.dataSource1.data = finalArray;
       this.dataSource1.sort = this.recurringTransactionTabSort;


      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',this.dataSource1.data);
    }
  }
  filterAssetData(data){
    let obj;
    let filterArray =[]
    if(data){
       obj={
        name:data[1].name,total:data[2].total,assetList:data[0].assetList
       }
    }
    if(obj){
      // filterArray.push({name:data[1].name},{total:data[2].total},{});
      filterArray.push(obj);

    }
    return filterArray
  }
  getExpenseGraphValueNew(data){
    this.basicAmountPercent =  data.Basic ? data.Basic.categoryWisePercentage : 0
    this.rdAmountPercent =  data.RECURRING_DEPOSIT ? data.RECURRING_DEPOSIT.categoryWisePercentage : 0
    this.lifeInsurancePercent = data.LIFE_INSURANCE ? data.LIFE_INSURANCE.expenseAmount : 0
    this.commitedInvestment = data.COMMITTED_INVESTMENT ? data.COMMITTED_INVESTMENT.expenseAmount : 0
    this.expenditure = data.COMMITTED_EXPENDITURES ? data.COMMITTED_EXPENDITURES.expenseAmount : 0

    this.generalInsurancePercent = data.GENERAL_INSURANCE ? data.GENERAL_INSURANCE.expenseAmount : 0
    this.liabilitiesPercent = data.LIABILITIES ? data.LIABILITIES.expenseAmount : 0
    this.miscellaneousAmount = data.Miscellaneous;
    this.entertainmentAmount = data.Entertainment;
    this.educationAmount = data.Education;
    // this.miscellaneousAmount = data.Billes_&_Utilies;
    this.transportAmount = data.Transport;
    this.housingAmount = data.Housing;
    this.spent = data.total;
    this.cashFlow('piechartExpense')
  }
  getBudgetGraphValues(){
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      startDate:this.startDate, 
      endDate:this.endDate
    };
    this.planService.getBudgetGraph(obj).subscribe(
      data => {
        if(data){
          this.budgetAmount = data.budgetAmount
          this.budgetChart('bugetChart')
        }else{
          this.budgetChart('bugetChart')
        }

      }, (error) => {
        this.budgetChart('bugetChart')
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getStartAndEndDate(val){
    var date = new Date();
    if(val == '1'){
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }else if(val == '2'){
      var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    }else if(val == '3'){
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth()+3, 1);

    }else if(val == '4'){
      var firstDay = new Date(date.getFullYear(), date.getMonth()-3, 1);
      var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth()+3, 1);
    }else if(val == '5'){
      var firstDay = new Date(date.getFullYear(), 0, 1);
      var lastDay = new Date(date.getFullYear(), 11, 31);
    }else if(val == '6'){
      var firstDay = new Date(date.getFullYear()-1, 0, 1);
      var lastDay = new Date(date.getFullYear()-1, 11, 31);
    }else if(val == '7'){
      var firstDay = new Date(date.getFullYear(), 3, 1);
      var lastDay = new Date(date.getFullYear()+1, 2, 31);
    }else if(val == '8'){
      var firstDay = new Date(date.getFullYear()-1, 3, 1);
      var lastDay = new Date(date.getFullYear(), 2, 31);
    }

    this.startDate = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    this.startDateDisp = this.datePipe.transform(firstDay, 'dd-MM-yyyy');
    this.endDateDisp = this.datePipe.transform(lastDay, 'dd-MM-yyyy');
    console.log('start Date,,,,,,,,,,,,,,,,',this.startDate);
    console.log('endDate,,,,,,,,,,,,,,,,',this.endDate);

  }
  generatePdf(tmp) {

    let header;
    this.fragmentData.isSpinner = true;
    let para = document.getElementById(tmp);
    // this.util.htmlToPdf(para.innerHTML, 'Test',this.fragmentData);
    if(tmp == 'template'){
      let expenseSvg = this.expenseChart.getSVG();
       header = this.transactionExpens.nativeElement.innerHTML
       this.util.htmlToPdf('',para.innerHTML, 'Expense', 'true', this.fragmentData, 'showPieChart', expenseSvg);

    }else{
      let budgetSvg = this.budgetChartSvg.getSVG();
       header = this.budgetPdf.nativeElement.innerHTML
       this.util.htmlToPdf('',para.innerHTML, 'Budget', 'true', this.fragmentData, 'showPieChart', budgetSvg);


    }


  }

  Excel(tableTitle,tmp) {
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
  fetchData(value, fileName) {
    this.isLoadingUpload = true
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      familyMemberId: this.clientData.familyMemberId,
      asset: value
    }
    this.myFiles = fileName.target.files[0]
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
    this.isTabLoaded = true;
    if (tab == 'Budget') {
       this.getBudgetGraphValues();
      this.getBudgetList();
      this.getBugetRecurring();
      // setTimeout(() => {
      //   this.budgetChart('bugetChart')

      // }, 300);
    } else {
      // this.getTransaction();
      // this.getAssetOfExpense();
      this.getAllExpense();
      // this.getExpenseGraphValue();
      // setTimeout(() => {
      //   this.cashFlow('piechartExpense')

      // }, 300);
    }
  }
  removeDate(item) {
    this.filterDate.splice(item, 1);


  }
  cashFlow(id) {
   this.expenseChart= Highcharts.chart('piechartExpense', {
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
            color: "#A6CEE3",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Bills & Utilities',
            y: 13,
            color: "#1F78B4",
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
            name: 'Expenditure',
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
    this.dataSource4.data = [{}, {}, {}];
    this.planService.getBudget(obj).subscribe(
      data => this.getBudgetRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource4.data = [];
        this.noData = 'No data found';
        this.isLoading = false;
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
        singleExpense.progressPercent += (singleExpense.spent/singleExpense.amount)*100;
        singleExpense.progressPercent = Math.round(singleExpense.progressPercent);
        if(singleExpense.progressPercent > 100){
          singleExpense.spentPer = 100;
          singleExpense.budgetPer = singleExpense.progressPercent - 100;
        }else{
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
    this.isLoading = false;
    console.log('getBudgetRes', data)
  }
  getBugetRecurring() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: this.endDate,
      startDate:this.startDate,
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    this.dataSource5.data = [{}, {}, {}];
    this.planService.otherCommitmentsGet(obj).subscribe(
      data => this.otherCommitmentsGetRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource5.data = [];
        this.noData = 'No data found';
        this.isLoading = false;
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
    this.isLoading = false;
    console.log('otherCommitmentsGetRes', data)
  }
  addFilterPeriod(value){
    let val=value.value
    this.getStartAndEndDate(val);
    // this.getTransaction();
    // this.getRecuringTransactions();
    this.getBudgetList();
    this.getBugetRecurring();
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
      this.recurringTransaction =data;
      if(this.recurringTransaction && this.transaction){
        this.dataSource.data = [ ...this.transaction, ...this.recurringTransaction];
      }else{
        this.dataSource.data = [ ...this.transaction];
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
      this.dataSource.data = [ ...this.transaction, ...this.recurringTransaction];

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
    this.dataSource.data = [{}, {}, {}];
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
  getAssetOfExpense(){
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      endDate: this.endDate,
      startDate: this.startDate,
    };                                                    
    this.isLoading = true;
    this.dataSource1.data = [{}, {}, {}];
    this.planService.getAssetsOfExpense(obj).subscribe(
      data => {
        if(data){
          this.expenseAssetData = data;
          let finalArray=[];
          let dataAsset =data;
          this.assetList =[{name:'pord'},{name:'ssy'},{name:'recurringDeposit'},{name:'mutualfund'}]
          Object.entries(this.assetList).forEach(([key, value]) => {

            let  obj = value.name
            let assetData= dataAsset[obj];
            if(assetData){
              assetData.forEach(element => {
                finalArray.push(element)
              });
            }

            console.log(key,value);
          });
          this.dataSource1.data = finalArray;
           this.dataSource1.sort = this.recurringTransactionTabSort;


          console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',this.dataSource1.data);
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
              this.getAllExpense();
              dialogRef.close();
              // this.getRecuringTransactions();
            },
            error => this.eventService.showErrorMessage(error)
          );
        }else  if (value == 'expense' && !data.repeatFrequency && !data.continueTill) {
          this.planService.deleteExpenseTransaction(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Expense transaction is deleted', 'Dismiss');
              this.getAllExpense();
              dialogRef.close();
              // this.getTransaction();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'budget') {
          this.planService.deletBudget(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Buget is deleted', 'Dismiss');
              dialogRef.close();
              this.getRecuringTransactions();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.planService.deleteRecuringBudget(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Recurring budget is deleted', 'Dismiss');
              dialogRef.close();
              this.getRecuringTransactions();
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
      expenseList:this.dataSource.data,
      budgetList:this.dataSource4.data,
      otherCommitments:this.dataSource5.data
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            if(sideBarData.value == 'editExpense' || sideBarData.value == 'addExpense' || sideBarData.value == 'addRecurringTrn' || sideBarData.value == 'editRecurringTrn'){
              // this.getTransaction();
              this.getAllExpense();
              // this.getExpenseGraphValue();
            }else if(sideBarData.value == 'editBudget' || sideBarData.value == 'addBudget'){
              this.getBudgetList();
              this.getBudgetGraphValues();
            }else{
              this.getBugetRecurring();
              this.getBudgetGraphValues();
            }
            console.log('this is sidebardata in subs subs 2: ', sideBarData);
          }

          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  detailedViewExpense(data,value) {
    const fragmentData = {
      flag: 'detailedView',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewExpensesComponent
    };
    if (data.continueTill && data.repeatFrequency) {
      fragmentData.data.value = 'Recurring transaction';
    } else {
      fragmentData.data.value = 'Transaction';

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
  detailedViewRecurring(data,value){
    data.startDate = this.startDateDisp;
    data.endDate = this.endDateDisp;

    const fragmentData = {
      flag: 'detailedView',
      data:data,
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



