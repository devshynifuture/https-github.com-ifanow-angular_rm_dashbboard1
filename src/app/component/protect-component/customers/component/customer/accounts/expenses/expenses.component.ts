import {Component, OnInit} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {AddExpensesComponent} from '../../../common-component/add-expenses/add-expenses.component';
import {AddBudgetComponent} from '../../../common-component/add-budget/add-budget/add-budget.component';
import {AuthService} from 'src/app/auth-service/authService';
import {ConstantsService} from "../../../../../../../constants/constants.service";
import {MatTableDataSource} from "@angular/material/table";
import { PlanService } from '../../plan/plan.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {


  displayedColumns = ['no', 'expense', 'date', 'desc', 'mode', 'amt', 'icons'];

  dataSource = new MatTableDataSource([] as Array<any>);

  displayedColumns4 = ['no', 'expense', 'budget', 'progress', 'spent', 'icons'];
  dataSource4 = ELEMENT_DATA4;
  advisorId: any;
  clientId: any;
  viewMode;
  dataSource1= new MatTableDataSource([] as Array<any>);

  constructor(private subInjectService: SubscriptionInject, private planService: PlanService,
              private constantService: ConstantsService) {
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
  
budgetChart(id){
  var chart = Highcharts.chart('budget', {

    title: {
        text: 'Chart.update'
    },

    subtitle: {
        text: 'Plain'
    },

    xAxis: {
        categories: ['Jan', 'Feb']
    },

    series: [{
        type: 'column',
        colorByPoint: true,
        data: [29.9, 71.5, ],
        showInLegend: false
    }]

});
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
          size: '85%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        data: [
          {
            name: 'Equity',
            y: 23,
            color: "#A6CEE3",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Debt',
            y: 13,
            color: "#1F78B4",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Hybrid',
            y: 25.42,
            color: "#B2DF8A",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            y: 12.61,
            color: "#33A02C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#FB9A99",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#E31A1C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#FDBF6F",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#FF7F00",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#CAB2D6",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
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
  getRecuringTransactions(){
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
    this.dataSource.data = [{}, {}, {}];
    this.planService.getRecuringExpense(obj).subscribe(
      data => this.getRecuringExpenseRes(data)
    );
  }
  getRecuringExpenseRes(data){
    console.log(data)
    // this.dataSource1 = data
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
    this.dataSource.data = [{}, {}, {}];
    this.planService.getTransactionExpense(obj).subscribe(
      data => this.getTransactionExpenseRes(data)
    );
  }
  getTransactionExpenseRes(data) {
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

    }
  }

  openExpenses(value,data) {
    const fragmentData = {
      flag: value,
      data:data,
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
  openExpensesB(value) {
    const fragmentData = {
      flag: value,
      id: 1,
      state: 'open35',
      componentName: AddBudgetComponent
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
  {no: '1', expense: 'Groceries', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600'},
  {
    no: '2',
    expense: 'Driver’s salary',
    date: '27/09/2019',
    desc: 'IIN/RFND/I-Debit/Make My',
    mode: 'Cash',
    amt: '4,600'
  },
  {no: '3', expense: 'School fees', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600'},
  {no: '4', expense: 'Dining out', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600'},
  {no: '5', expense: 'Groceries', date: '27/09/2019', desc: '-', mode: 'Cash', amt: '4,600'},
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
  {no: '1', expense: 'Groceries', budget: '49,000', progress: ' ', spent: '8,400', icons: ''},
  {no: '2', expense: 'Transportation', budget: '8,000', progress: ' ', spent: '7,200', icons: ''},
  {no: '3', expense: 'School fees', budget: '5,600', progress: ' ', spent: '5,600', icons: ''},
  {no: '4', expense: 'Dining out', budget: '3,000', progress: ' ', spent: '3,700', icons: ''},
  {no: '5', expense: 'Leisure & Entertainment', budget: '2,000', progress: ' ', spent: '0', icons: ''},

];



