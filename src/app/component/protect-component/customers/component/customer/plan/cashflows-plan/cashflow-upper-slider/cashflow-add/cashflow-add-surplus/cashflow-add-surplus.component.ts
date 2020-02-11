import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from './../../../../../../../../../../Data-service/event.service';
import { ValidatorType } from './../../../../../../../../../../services/util.service';
import { UpperTableBox } from './../../../cashflow.interface';
import { Component, OnInit } from '@angular/core';
import { GoalTableI, loanTableI } from '../../../cashflow.interface';
import { CashFlowsPlanService } from '../../../cashflows-plan.service';

@Component({
  selector: 'app-cashflow-add-surplus',
  templateUrl: './cashflow-add-surplus.component.html',
  styleUrls: ['./cashflow-add-surplus.component.scss']
})
export class CashflowAddSurplusComponent implements OnInit {
  constructor(private cashflowService: CashFlowsPlanService) { }

  dataSource1: GoalTableI[] = ELEMENT_DATA1;
  dataSource2: loanTableI[] = ELEMENT_DATA2;
  displayedColumns1: string[] = ['goal', 'goalYear', "monthlyRequired", 'lumpsumRequired', 'allocate'];
  displayedColumns2: string[] = ['loan', 'loanYear', "monthlyRequired", 'lumpsumRequired', 'allocate'];

  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();

  ngOnInit() {
  }

  cashflowAddSurplusData() {
    this.cashflowService
      .cashflowAddSurplusData({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }

  cashflowEditSurplusData(data) {
    this.cashflowService
      .cashflowEditSurplusData({ advisorId: this.advisorId, clientId: this.clientId })
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      });
  }
}

export const ELEMENT_DATA1: GoalTableI[] = [
  { goal: 'deasvikandk', goalYear: '2020', monthlyRequired: '83494', lumpsumRequired: '2409809', allocate: "" }
]

export const ELEMENT_DATA2: loanTableI[] = [
  { loan: "adhvgbha", loanYear: '2020', monthlyRequired: '48978', lumpsumRequired: '948735', allocate: '' }
]
