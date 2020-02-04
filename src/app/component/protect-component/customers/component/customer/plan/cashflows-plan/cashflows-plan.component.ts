import { MatTableDataSource } from '@angular/material';
import { PlanService } from './../plan.service';
import { DatePipe } from '@angular/common';
import { CashFlowsPlanService } from './cashflows-plan.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { chart } from './highChart';
import { CashflowUpperSliderComponent } from './cashflow-upper-slider/cashflow-upper-slider.component';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-cashflows-plan',
  templateUrl: './cashflows-plan.component.html',
  styleUrls: ['./cashflows-plan.component.scss']
})
export class CashflowsPlanComponent implements OnInit {

  displayedColumns: string[] = ['year', 'groupHeadAge', 'spouseAge', 'monthlyIncome', 'view'];
  dataSource;

  displayedColumns1: string[] = ['financialYear', 'ageH', 'ageW', 'originalSurplus', 'surplusAllocated', 'balanceSurplus', 'view'];

  dataSourceSurplus = SURPLUS_DATA;

  showSurplusTable: boolean = false;

  tableInUse: string = 'income';
  cashflowIncomeValue: any;
  groupHeadAge: number;
  listOfIncomeArray: IncometableI[] = [];

  constructor(
    private eventService: EventService,
    private cashflowService: CashFlowsPlanService,
    private datePipe: DatePipe
  ) { }
  isLoading = false;
  ngOnInit() {
    this.cashFlow('surplus');
    this.filterCashFlowTableUsing('income');
    this.getCashflowIncomeData();
    this.getCashflowExpenseData();
  }

  getCashflowExpenseData() {
    const data = {
      advisorId: AuthService.getUserInfo().advisorId,
      clientId: AuthService.getClientId()
    }
    console.log(data);
    this.cashflowService.getCashflowExpenseValues(data).subscribe(res => {
      console.log("value of cashflow income data, ", res);
    }, err => {
      console.error("error in getting cashflow income data, ", err)
    });
  }

  getCashflowIncomeData() {
    const data = {
      advisorId: AuthService.getUserInfo().advisorId,
      clientId: AuthService.getClientId()
    }
    console.log(data.clientId);
    this.cashflowService.getCashflowIncomeValues(data).subscribe(res => {
      console.log("value of cashflow income data, ", res);
      this.cashflowIncomeValue = res;

      res.forEach(item => {
        const { familyMemberId, monthlyIncome, incomeEndYear } = item;
        this.getFamilyMemberDetailsAndCalculateAge(familyMemberId, { monthlyIncome, incomeEndYear });

      });


    }, err => {
      console.error("error in getting cashflow income data, ", err)
    });
  }

  getFamilyMemberDetailsAndCalculateAge(familyMemberId, data) {
    // call family member detail api
    const requestJSON = {
      advisorId: AuthService.getUserInfo().advisorId,
      clientId: AuthService.getClientId(),
      familyMemberId,
    }
    let birthDate = [];
    this.cashflowService.getFamilyMemberData(requestJSON).subscribe(res => {
      // console.log(res);

      res.familyMembersList.forEach(item => {
        const { dateOfBirth } = item;
        birthDate.push(
          this.ageCalculation(
            UtilService.convertDateObjectToDateString(this.datePipe, dateOfBirth).slice(0, 4)
          )
        );

        this.groupHeadAge = Math.max(...birthDate);
        if (item.relationshipId == 2) {
          this.listOfIncomeArray.push({
            year: data.incomeEndYear,
            groupHeadAge: this.groupHeadAge,
            spouseAge: item.relationshipId == 2 ? this.ageCalculation(
              UtilService.convertDateObjectToDateString(this.datePipe, item.dateOfBirth).slice(0, 4)
            ) : 0,
            monthlyIncome: data.monthlyIncome,
            view: 'view'
          });
        }
      });

      this.dataSource = new MatTableDataSource(this.listOfIncomeArray);
      console.log(this.listOfIncomeArray);
    });

  }

  ageCalculation(birthYear) {
    const year = new Date().getFullYear();
    return year - birthYear;
  }

  // get

  filterCashFlowTableUsing(flag: string): void {
    this.tableInUse = flag;

    if (flag !== 'surplus') {
      this.showSurplusTable = false;
    }

    switch (flag) {
      case 'income': this.dataSource = ELEMENT_DATA;
        break;
      case 'expenses': this.dataSource = ELEMENT_DATA1;
        break;
      case 'insurance': this.dataSource = ELEMENT_DATA2;
        break;
      case 'liabilities': this.dataSource = ELEMENT_DATA3;
        break;
      case 'assets': this.dataSource = ELEMENT_DATA4;
        break;
      case 'commited-outflows': this.dataSource = ELEMENT_DATA5;
        break;
      case 'goals': this.dataSource = ELEMENT_DATA6;
        break;
      case 'surplus': this.showSurplusTable = true;
        break;
      default: this.dataSource = ELEMENT_DATA;
    }

    // this.dataSource =
    // call api and consume data

    // update table dataSource

  }

  openUpperSlider(element) {
    console.log(this.tableInUse);
    console.log(element);

    const fragmentData = {
      flag: 'openCashFlowUpper',
      id: 1,
      data: { ...element, tableInUse: this.tableInUse },
      direction: 'top',
      componentName: CashflowUpperSliderComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  cashFlow(id) {
    chart();
  }
  // cashFlow(id) {
  //   var chart1 = new Highcharts.Chart('surplus', {
  //     chart: {
  //       type: 'bar'
  //     },
  //     title: {
  //       text: 'Bar chart with negative values'
  //     },
  //     xAxis: {
  //       categories: []
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     plotOptions: {
  //       series: {
  //         stacking: 'normal',
  //         pointWidth: 10
  //       }
  //     },
  //     series: [{
  //       name: 'Income',
  //       data: [-1, -2, -2, -7, -2, -1, -1, -2, -3, -4, -5, -5, -6, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 2, 3],
  //       color: '#5DC644'
  //     }, {
  //       name: 'Expenses',
  //       data: [1, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  //       color: '#FFC100'
  //     }, {
  //       name: 'Liabilities',
  //       data: [1, 2, 3, 4, 2, -1, -1, -1, -1, -1, -1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, -3, -3, -4, -5],
  //       color: '#FF6823'
  //     }, {
  //       name: 'Insurance',
  //       data: [1, 2, 3, 3, 2, 1, 2, 3, 4, 5, 5, 6, 6, 0, 0, 0, -1, -2, -3, -4, -5, -6, -7],
  //       color: '#7B50FF'
  //     }, {
  //       name: 'Assets',
  //       data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 7, 2],
  //       color: '#BCC6CA'
  //     }, {
  //       type: 'spline',
  //       name: 'Surplus',
  //       marker: {
  //         enabled: false
  //       },
  //       color: '#000000',
  //       dashStyle: 'shortdot',
  //       data: [1, 1, 1, 1., 1., 2, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1],
  //     }]
  //   });
  // }
}

export interface IncometableI {
  year: number,
  groupHeadAge: number,
  spouseAge: number,
  monthlyIncome: number,
  view: string
}

export interface IncomeTableI {
  year: string;
  age: string;
  age2: string;
  total: string;
  view: string;
}

export interface SurplusInterface {
  financialYear: string,
  ageH: string,
  ageW: string,
  originalSurplus: string,
  surplusAllocated: string,
  balanceSurplus: string
}

const SURPLUS_DATA: SurplusInterface[] = [
  { financialYear: "2020", ageH: '39', ageW: '30', originalSurplus: '3020', surplusAllocated: '88000', balanceSurplus: "3500" },
  { financialYear: "2021", ageH: '40', ageW: '31', originalSurplus: '2000', surplusAllocated: '18000', balanceSurplus: "3300" },
  { financialYear: "2022", ageH: '41', ageW: '32', originalSurplus: '5000', surplusAllocated: '28000', balanceSurplus: "3400" },
  { financialYear: "2023", ageH: '42', ageW: '33', originalSurplus: '7000', surplusAllocated: '38000', balanceSurplus: "3700" },
  { financialYear: "2024", ageH: '43', ageW: '34', originalSurplus: '4000', surplusAllocated: '78000', balanceSurplus: "8000" },
  { financialYear: "2025", ageH: '44', ageW: '35', originalSurplus: '2030', surplusAllocated: '68000', balanceSurplus: "9000" },
  { financialYear: "2026", ageH: '45', ageW: '36', originalSurplus: '9000', surplusAllocated: '4030', balanceSurplus: "5000" },
  { financialYear: "2027", ageH: '46', ageW: '37', originalSurplus: '37000', surplusAllocated: '4300', balanceSurplus: "3000" },
  { financialYear: "2028", ageH: '47', ageW: '38', originalSurplus: '5600', surplusAllocated: '4000', balanceSurplus: "9800" },
  { financialYear: "2029", ageH: '48', ageW: '39', originalSurplus: '54400', surplusAllocated: '8000', balanceSurplus: "2300" },
];

const ELEMENT_DATA: IncomeTableI[] = [
  { year: '2020', age: '25', age2: '21', total: '2,10,000', view: 'view' },
  { year: '2021', age: '26', age2: '22', total: '2,10,400', view: 'view' },
  { year: '2022', age: '27', age2: '23', total: '2,30,000', view: 'view' },
  { year: '2023', age: '28', age2: '24', total: '2,10,000', view: 'view' },
  { year: '2024', age: '29', age2: '25', total: '2,40,000', view: 'view' },
  { year: '2025', age: '30', age2: '26', total: '2,80,000', view: 'view' },
  { year: '2026', age: '31', age2: '27', total: '2,20,000', view: 'view' },
];


const ELEMENT_DATA1: IncomeTableI[] = [
  { year: '2023', age: '28', age2: '24', total: '2,10,000', view: 'view' },
  { year: '2022', age: '27', age2: '23', total: '2,30,000', view: 'view' },
  { year: '2024', age: '29', age2: '25', total: '2,40,000', view: 'view' },
  { year: '2020', age: '25', age2: '21', total: '2,10,000', view: 'view' },
  { year: '2021', age: '26', age2: '22', total: '2,10,400', view: 'view' },
  { year: '2026', age: '31', age2: '27', total: '2,20,000', view: 'view' },
  { year: '2025', age: '30', age2: '26', total: '2,80,000', view: 'view' },
];

const ELEMENT_DATA2: IncomeTableI[] = [
  { year: '2120', age: '25', age2: '21', total: '2,10,000', view: 'view' },
  { year: '2121', age: '26', age2: '22', total: '2,10,400', view: 'view' },
  { year: '2122', age: '27', age2: '23', total: '2,30,000', view: 'view' },
  { year: '2123', age: '28', age2: '24', total: '2,10,000', view: 'view' },
  { year: '2124', age: '29', age2: '25', total: '2,40,000', view: 'view' },
  { year: '2125', age: '30', age2: '26', total: '2,80,000', view: 'view' },
  { year: '2126', age: '31', age2: '27', total: '2,20,000', view: 'view' },
];
const ELEMENT_DATA3: IncomeTableI[] = [
  { year: '2020', age: '15', age2: '21', total: '2,10,000', view: 'view' },
  { year: '2021', age: '16', age2: '22', total: '2,10,400', view: 'view' },
  { year: '2022', age: '17', age2: '23', total: '2,30,000', view: 'view' },
  { year: '2023', age: '18', age2: '24', total: '2,10,000', view: 'view' },
  { year: '2024', age: '19', age2: '25', total: '2,40,000', view: 'view' },
  { year: '2025', age: '10', age2: '26', total: '2,80,000', view: 'view' },
  { year: '2026', age: '11', age2: '27', total: '2,20,000', view: 'view' },
];

const ELEMENT_DATA4: IncomeTableI[] = [
  { year: '2020', age: '25', age2: '1', total: '2,10,000', view: 'view' },
  { year: '2021', age: '26', age2: '2', total: '2,10,400', view: 'view' },
  { year: '2022', age: '27', age2: '3', total: '2,30,000', view: 'view' },
  { year: '2023', age: '28', age2: '4', total: '2,10,000', view: 'view' },
  { year: '2024', age: '29', age2: '5', total: '2,40,000', view: 'view' },
  { year: '2025', age: '30', age2: '6', total: '2,80,000', view: 'view' },
  { year: '2026', age: '31', age2: '7', total: '2,20,000', view: 'view' },
];

const ELEMENT_DATA5: IncomeTableI[] = [
  { year: '2020', age: '25', age2: '21', total: '2000', view: 'view' },
  { year: '2021', age: '26', age2: '22', total: '2400', view: 'view' },
  { year: '2022', age: '27', age2: '23', total: '2,30,000', view: 'view' },
  { year: '2023', age: '28', age2: '24', total: '2000', view: 'view' },
  { year: '2024', age: '29', age2: '25', total: '2,40,000', view: 'view' },
  { year: '2025', age: '30', age2: '26', total: '2000', view: 'view' },
  { year: '2026', age: '31', age2: '27', total: '2,20,000', view: 'view' },
];

const ELEMENT_DATA6: IncomeTableI[] = [
  { year: '2020', age: '25', age2: '21', total: '2,10', view: 'view' },
  { year: '2021', age: '26', age2: '22', total: '2,100', view: 'view' },
  { year: '2022', age: '27', age2: '23', total: '2,30,000', view: 'view' },
  { year: '2023', age: '28', age2: '24', total: '2,10', view: 'view' },
  { year: '2024', age: '29', age2: '25', total: '2,40,000', view: 'view' },
  { year: '2025', age: '30', age2: '26', total: '200', view: 'view' },
  { year: '2026', age: '31', age2: '27', total: '2,200', view: 'view' },
];

