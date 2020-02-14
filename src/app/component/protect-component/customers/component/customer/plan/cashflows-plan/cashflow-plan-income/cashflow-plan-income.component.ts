import { AuthService } from './../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../cashflows-plan.service';
import { CashflowUpperSliderComponent } from './../cashflow-upper-slider/cashflow-upper-slider.component';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { IncomeTableI, IncometableI } from '../cashflows-plan.component';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cashflow-plan-income',
  templateUrl: './cashflow-plan-income.component.html',
  styleUrls: ['./cashflow-plan-income.component.scss']
})
export class CashflowPlanIncomeComponent implements OnInit {
  lastItem: any;
  detailsForMonthlyDistributionGetList: any;
  familyMemberList: any;

  constructor(private eventService: EventService,
    private cashflowService: CashFlowsPlanService,
    private datePipe: DatePipe) { }
  isLoading: boolean = false;

  dataSource: MatTableDataSource<IncometableI>;
  displayedColumns: string[] = ['year', 'groupHeadAge', 'spouseAge', 'totalIncome', 'view'];
  tableInUse: string = 'income';
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    // if income api is created 
    // get yearly income 

    this.getYearlyCashflowIncomeData();
  }

  ageCalculation(timeStamp) {
    const dob = UtilService.convertDateObjectToDateString(this.datePipe, timeStamp).slice(0, 4);
    const year = new Date().getFullYear();
    return year - parseInt(dob);
  }

  getYearlyCashflowIncomeData() {
    this.isLoading = true;
    this.cashflowService
      .getCashflowYearlyIncomeValues({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        const { cashFlowIncomeOutputList, detailsForMonthlyDistributionGetList, groupHeadAge, spouseAge } = res;
        cashFlowIncomeOutputList.map(item => {
          item.groupHeadAge = this.ageCalculation(groupHeadAge);
          item.spouseAge = this.ageCalculation(spouseAge);
          item.view = 'view';
        });

        this.detailsForMonthlyDistributionGetList = detailsForMonthlyDistributionGetList;

        console.log(res);
        this.dataSource = new MatTableDataSource(cashFlowIncomeOutputList);
        this.isLoading = false;
      },
        err => {
          console.error(err);
        });
  }

  getFamilyMemberListData() {
    this.cashflowService
      .getFamilyMemberData({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        this.familyMemberList = res.familyMembersList;
      })
  }

  openUpperSlider(element) {
    this.getFamilyMemberListData();
    console.log(this.tableInUse);
    console.log(element);

    element.year = String(element.year);
    element.detailsForMonthlyDistributionGetList = this.detailsForMonthlyDistributionGetList;

    const fragmentData = {
      flag: 'openCashFlowUpper',
      id: 1,
      data: { ...element, familyMemberList: this.familyMemberList, tableInUse: this.tableInUse },
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
}


const ELEMENT_DATA: IncometableI[] = [
  { year: null, groupHeadAge: null, spouseAge: null, monthlyIncome: null, view: null },
  { year: null, groupHeadAge: null, spouseAge: null, monthlyIncome: null, view: null },
  { year: null, groupHeadAge: null, spouseAge: null, monthlyIncome: null, view: null },
];