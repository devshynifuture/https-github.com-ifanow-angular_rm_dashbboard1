import { AuthService } from './../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../cashflows-plan.service';
import { SurplusInterface } from './../cashflows-plan.component';
import { EventService } from './../../../../../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { CashflowUpperSliderComponent } from '../cashflow-upper-slider/cashflow-upper-slider.component';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-cashflow-plan-surplus',
  templateUrl: './cashflow-plan-surplus.component.html',
  styleUrls: ['./cashflow-plan-surplus.component.scss']
})
export class CashflowPlanSurplusComponent implements OnInit {

  constructor(private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }
  tableInUse: string = 'surplus';

  dataSource: MatTableDataSource<SurplusInterface>;
  displayedColumns: string[] = ['financialYear', 'ageH', 'ageW', 'originalSurplus', 'surplusAllocated', 'balanceSurplus', 'view'];
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  ngOnInit() {
    this.dataSource = new MatTableDataSource(SURPLUS_DATA);
    // api not created
    // this.getCashflowSurplusYearlyData();
  }

  getCashflowSurplusYearlyData() {
    this.cashflowService
      .getCashflowYearlySurplusValues({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
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
