import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddExpensesComponent } from '../../../common-component/add-expenses/add-expenses.component';
import { AddBudgetComponent } from '../../../common-component/add-budget/add-budget/add-budget.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ConstantsService } from "../../../../../../../constants/constants.service";
import { PlanService } from '../../plan/plan.service';
import * as Highcharts from 'highcharts';
import { EventService } from 'src/app/Data-service/event.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {


  displayedColumns = ['no', 'expense', 'date', 'desc', 'mode', 'amt', 'icons'];

  dataSource = new MatTableDataSource([] as Array<any>);

  displayedColumns4 = ['no', 'expense', 'budget', 'progress', 'spent', 'icons'];
  dataSource4 = new MatTableDataSource([] as Array<any>);
  dataSource5 = new MatTableDataSource([] as Array<any>);
  advisorId: any;
  clientId: any;
  viewMode;
  isLoading = false;
  dataSource1 = new MatTableDataSource([] as Array<any>);
  noData: string;

  constructor(private subInjectService: SubscriptionInject, private planService: PlanService,
    private constantService: ConstantsService, private eventService: EventService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.viewMode = 'Transactions';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getTransaction();
    this.getRecuringTransactions();
    setTimeout(() => {
      this.cashFlow('piechartExpense')

    }, 300);
  }

  budgetChart(id) {
    var chart = Highcharts.chart('bugetChart', {

      title: {
        text: 'Buget'
      },
      xAxis: {
        categories: ['Buget', 'Spent']
      },

      series: [{
        type: 'column',
        colorByPoint: true,
        color: "#5cc644",
        data: [{
          y: 60000,
          color: "#5cc644"
        }, {
          y: 30000,
          color: "#f3ae40"
        }],
        showInLegend: false
      }]

    });
  }
  getBugetTab(tab) {
    if (tab == 'Budget') {
      this.getBudgetList();
      this.getBugetRecurring();
      setTimeout(() => {
        this.budgetChart('bugetChart')

      }, 300);
    } else {
      this.getTransaction();
      this.getRecuringTransactions();
      setTimeout(() => {
        this.cashFlow('piechartExpense')

      }, 300);
    }
  }
  cashFlow(id) {
    Highcharts.chart('piechartExpense', {
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
            name: 'Food & Groceries',
            y: 23,
            color: "#A6CEE3",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Clothing',
            y: 13,
            color: "#1F78B4",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Medical expenses',
            y: 25.42,
            color: "#B2DF8A",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Shopping',
            y: 12.61,
            color: "#33A02C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Basic misc.',
            y: 23.42,
            color: "#FB9A99",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Mobile',
            y: 23.42,
            color: "#E31A1C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Internet',
            y: 23.42,
            color: "#FDBF6F",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Electricity',
            y: 23.42,
            color: "#FF7F00",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'DTH',
            y: 23.42,
            color: "#CAB2D6",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Telephone',
            y: 23.42,
            color: "#6A3D9A",
            dataLabels: {
              enabled: false
            }
          }
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
      endDate: '2020-01-30',
      startDate: '2020-01-01',
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
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.budgetCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.dataSource4.data = data;
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
      endDate: '2020-01-30',
      startDate: '2020-01-01',
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
    } else {
      this.noData = 'No data found';
      this.dataSource5.data = [];
    }
    this.isLoading = false;
    console.log('otherCommitmentsGetRes', data)
  }
  getRecuringTransactions() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: '2020-01-30',
      startDate: '2020-01-01',
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    this.dataSource1.data = [{}, {}, {}];
    this.planService.getRecuringExpense(obj).subscribe(
      data => this.getRecuringExpenseRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource1.data = [];
        this.noData = 'No data found';
        this.isLoading = false;
      }
    );
  }
  getRecuringExpenseRes(data) {
    if (data == undefined) {
      this.noData = 'No data found';
      this.dataSource1.data = [];
    }
    this.isLoading = false;
    console.log(data);
    if (data) {
      data.forEach(singleExpense => {
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.dataSource1.data = data;
    } else {
      this.noData = 'No data found';
      this.dataSource1.data = [];
    }
  }
  getTransaction() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      allOrSingle: 1,
      endDate: '2020-01-30',
      startDate: '2020-01-01',
      limit: 10,
      offset: 1,
      familyMemberId: 0,
    };
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.planService.getTransactionExpense(obj).subscribe(
      data => this.getTransactionExpenseRes(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.noData = 'No data found';
        this.isLoading = false;
      }
    );
  }
  getTransactionExpenseRes(data) {
    if (data == undefined) {
      this.noData = 'No data found';
      this.dataSource.data = [];
    }
    this.isLoading = false;
    console.log(data);
    if (data) {
      data.forEach(singleExpense => {
        const singleExpenseCategory = this.constantService.expenseJsonMap[singleExpense.expenseCategoryId];
        if (singleExpenseCategory) {
          singleExpense.expenseType = singleExpenseCategory.expenseType;
        }
      });
      this.dataSource.data = data;
    } else {
      this.noData = 'No data found';
      this.dataSource.data = [];
    }
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        if (value == 'expense') {
          this.planService.deleteExpenseTransaction(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Expense transaction is deleted', 'dismiss');
              dialogRef.close();
              this.getTransaction();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'expenseRecuring') {
          this.planService.deleteExpenseRecurring(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Recurring expense transaction is deleted', 'dismiss');
              dialogRef.close();
              this.getRecuringTransactions();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else if (value == 'budget') {
          this.planService.deletBudget(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Buget is deleted', 'dismiss');
              dialogRef.close();
              this.getRecuringTransactions();
            },
            error => this.eventService.showErrorMessage(error)
          );
        } else {
          this.planService.deleteRecuringBudget(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Recurring budget is deleted', 'dismiss');
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
    if(data == null){
      data = {}
      data.flag = value
    }else{
      data.flag = value
    }
    const fragmentData = {
      flag: value,
      data: data,
      id: 1,
      state: 'open35',
      componentName: AddExpensesComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getTransaction();
          this.getRecuringTransactions();
          this.getBudgetList();
          this.getBugetRecurring();
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



