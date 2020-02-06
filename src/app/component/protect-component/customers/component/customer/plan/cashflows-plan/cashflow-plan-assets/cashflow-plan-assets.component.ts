import { AuthService } from './../../../../../../../../auth-service/authService';
import { CashFlowsPlanService } from './../cashflows-plan.service';
import { EventService } from './../../../../../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { IncometableI } from '../cashflows-plan.component';
import { MatTableDataSource } from '@angular/material';
import { UtilService } from 'src/app/services/util.service';
import { CashflowUpperSliderComponent } from '../cashflow-upper-slider/cashflow-upper-slider.component';

@Component({
  selector: 'app-cashflow-plan-assets',
  templateUrl: './cashflow-plan-assets.component.html',
  styleUrls: ['./cashflow-plan-assets.component.scss']
})
export class CashflowPlanAssetsComponent implements OnInit {
  tableInUse: string = 'assets';

  constructor(private eventService: EventService,
    private cashflowService: CashFlowsPlanService) { }
  isLoading: boolean = false;

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  dataSource: MatTableDataSource<IncometableI>;
  displayedColumns: string[] = ['year', 'groupHeadAge', 'spouseAge', 'monthlyIncome', 'view'];

  ngOnInit() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);

    // api not ready
    // this.getCashflowYearlyAssetsData();
  }

  getCashflowYearlyAssetsData() {
    this.cashflowService
      .getCashflowYearlyAssetsValue({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      },
        err => {
          console.error(err);
        }
      );
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

const ELEMENT_DATA: IncometableI[] = [
  { year: '2020', groupHeadAge: '25', spouseAge: '21', monthlyIncome: '210000', view: 'view' },
  { year: '2021', groupHeadAge: '26', spouseAge: '22', monthlyIncome: '210400', view: 'view' },
  { year: '2022', groupHeadAge: '27', spouseAge: '23', monthlyIncome: '230000', view: 'view' },
  { year: '2023', groupHeadAge: '28', spouseAge: '24', monthlyIncome: '210000', view: 'view' },
  { year: '2024', groupHeadAge: '29', spouseAge: '25', monthlyIncome: '240000', view: 'view' },
  { year: '2025', groupHeadAge: '30', spouseAge: '26', monthlyIncome: '280000', view: 'view' },
  { year: '2026', groupHeadAge: '31', spouseAge: '27', monthlyIncome: '220000', view: 'view' },
];
