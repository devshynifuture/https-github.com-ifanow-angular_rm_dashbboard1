import { AuthService } from './../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../cashflows-plan.service';
import { CashflowUpperSliderComponent } from './../cashflow-upper-slider/cashflow-upper-slider.component';
import { EventService } from 'src/app/Data-service/event.service';
import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { IncomeTableI, IncometableI } from '../cashflows-plan.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-cashflow-plan-income',
  templateUrl: './cashflow-plan-income.component.html',
  styleUrls: ['./cashflow-plan-income.component.scss']
})
export class CashflowPlanIncomeComponent implements OnInit {
  lastItem: any;
  detailsForMonthlyDistributionGetList: any;

  constructor(private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }
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

  getYearlyCashflowIncomeData() {
    this.isLoading = true;
    this.cashflowService
      .getCashflowYearlyIncomeValues({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        const { cashFlowIncomeOutputList, detailsForMonthlyDistributionGetList, groupHeadAge, spouseAge } = res;
        cashFlowIncomeOutputList.map(item => {
          item.groupHeadAge = groupHeadAge;
          item.spouseAge = spouseAge;
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

  openUpperSlider(element) {
    console.log(this.tableInUse);
    console.log(element);

    element.year = String(element.year);
    element.detailsForMonthlyDistributionGetList = this.detailsForMonthlyDistributionGetList;

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
}


const ELEMENT_DATA: IncometableI[] = [
  { year: null, groupHeadAge: null, spouseAge: null, monthlyIncome: null, view: null },
  { year: null, groupHeadAge: null, spouseAge: null, monthlyIncome: null, view: null },
  { year: null, groupHeadAge: null, spouseAge: null, monthlyIncome: null, view: null },
];