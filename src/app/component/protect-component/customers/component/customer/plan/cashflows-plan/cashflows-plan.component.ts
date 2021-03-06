import { MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { CashFlowsPlanService } from './cashflows-plan.service';
import { UtilService } from 'src/app/services/util.service';
import { Component, OnInit } from '@angular/core';
import { chart } from './highChart';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-cashflows-plan',
  templateUrl: './cashflows-plan.component.html',
  styleUrls: ['./cashflows-plan.component.scss']
})
export class CashflowsPlanComponent implements OnInit {

  displayedColumns: string[] = ['year', 'groupHeadAge', 'spouseAge', 'monthlyIncome', 'view'];
  dataSource;
  dataSourceIncome;
  dataSourceExpense;
  dataSourceLiabilities;
  dataSourceInsurance;
  dataSourceAssets;

  displayedColumns1: string[] = ['financialYear', 'ageH', 'ageW', 'originalSurplus', 'surplusAllocated', 'balanceSurplus', 'view'];

  dataSourceSurplus = SURPLUS_DATA;

  showSurplusTable: boolean = false;

  tableInUse: string = 'income';
  cashflowIncomeValue: any;
  groupHeadAge: number;
  listOfIncomeArray: IncometableI[] = [];
  advisorId = AuthService.getUserInfo().advisorId;
  clientId = AuthService.getClientId()

  constructor(
    private cashflowService: CashFlowsPlanService,
    private datePipe: DatePipe
  ) { }
  isLoading: boolean = false;
  ngOnInit() {
    this.cashFlow('surplus');
    this.filterCashFlowTableUsing('income');
  }

  getCashflowLiabilitiesData() {
    this.cashflowService.getCashflowYearlyLiabilitiesValues({ advisorId: this.advisorId, clientId: this.clientId }).subscribe(res => {
      console.log("this is cashflow liabilities value::::::::", res);
      this.dataSource = new MatTableDataSource(ELEMENT_DATA3);

    }, err => {
      console.log(err);
    });
  }

  getCashflowExpenseData() {
    this.cashflowService.getCashflowYearlyExpensesValues({ advisorId: this.advisorId, clientId: this.clientId }).subscribe(res => {
      console.log("value of cashflow expense Value data, ", res);
    }, err => {
      console.error("error in getting cashflow expenses data, ", err)
    });
  }

  getCashflowIncomeData() {
    this.cashflowService.getCashflowYearlyIncomeValues({ advisorId: this.advisorId, clientId: this.clientId }).subscribe(res => {
      console.log("value of cashflow income data, ", res);
      this.cashflowIncomeValue = res;

      res.forEach(item => {
        const { familyMemberId, monthlyIncome, incomeEndYear } = item;
        this.getFamilyMemberDetailsAndCalculateAge(familyMemberId, { monthlyIncome, incomeEndYear });

      });
      this.isLoading = false;
    }, err => {
      console.error("error in getting cashflow income data, ", err)
    });
  }

  getFamilyMemberDetailsAndCalculateAge(familyMemberId, data) {
    // call family member detail api MatTableDataSource<IncomeTableI>;


    const requestJSON = {
      advisorId: this.advisorId,
      clientId: this.clientId,
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
        // if (item.relationshipId == 2) {
        //   this.listOfIncomeArray.push({
        //     year: data.incomeEndYear,
        //     groupHeadAge: this.groupHeadAge,
        //     spouseAge: item.relationshipId == 2 ? this.ageCalculation(
        //       UtilService.convertDateObjectToDateString(this.datePipe, item.dateOfBirth).slice(0, 4)
        //     ) : 0,
        //     monthlyIncome: data.monthlyIncome,
        //     view: 'view'
        //   });
        // }
      });

      this.dataSource = new MatTableDataSource(this.listOfIncomeArray);

      // console.log(this.listOfIncomeArray);
    });
  }

  ageCalculation(birthYear) {
    const year = new Date().getFullYear();
    return year - birthYear;
  }

  // get

  filterCashFlowTableUsing(flag: string): void {
    this.tableInUse = flag;
  }


  cashFlow(id) {
    chart();
  }

}

export interface IncometableI {
  year: string,
  groupHeadAge: string,
  spouseAge: string,
  monthlyIncome: string,
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
let ELEMENT_DATA3: IncomeTableI[] = [
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

