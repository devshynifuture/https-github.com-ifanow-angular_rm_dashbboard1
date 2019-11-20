import {NgModule} from '@angular/core';
import {ScenariosPlanComponent} from './scenarios-plan/scenarios-plan.component';
import {CashflowsPlanComponent} from './cashflows-plan/cashflows-plan.component';
import {ProfilePlanComponent} from './profile-plan/profile-plan.component';
import {InvestmentsPlanComponent} from './investments-plan/investments-plan.component';
import {GoalsPlanComponent} from './goals-plan/goals-plan.component';
import {SummaryPlanComponent} from './summary-plan/summary-plan.component';
import {InsurancePlanComponent} from './insurance-plan/insurance-plan.component';
import {PlanComponent} from './plan.component';
import {TexesPlanComponent} from './texes-plan/texes-plan.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../../../material/material';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';


// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [
    PlanComponent,
    SummaryPlanComponent,
    ProfilePlanComponent,
    InsurancePlanComponent,
    GoalsPlanComponent,
    CashflowsPlanComponent,
    InvestmentsPlanComponent,
    ScenariosPlanComponent,
    TexesPlanComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [PlanComponent],
  entryComponents: []
})
export class PlanModule {
}
