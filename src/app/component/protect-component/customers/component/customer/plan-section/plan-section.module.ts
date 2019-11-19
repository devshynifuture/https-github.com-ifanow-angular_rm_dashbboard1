import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan/plan.component';
import { SummaryComponent } from './plan/summary/summary.component';
import { ProfileComponent } from './plan/profile/profile.component';
import { InsuranceComponent } from './plan/insurance/insurance.component';
import { GoalsComponent } from './plan/goals/goals.component';
import { TaxesComponent } from './plan/taxes/taxes.component';
import { CashFlowsComponent } from './plan/cash-flows/cash-flows.component';
import { InvestmentsComponent } from './plan/investments/investments.component';
import { ScenariosComponent } from './plan/scenarios/scenarios.component';



@NgModule({
  declarations: [PlanComponent, SummaryComponent, ProfileComponent, InsuranceComponent, GoalsComponent, TaxesComponent, CashFlowsComponent, InvestmentsComponent, ScenariosComponent],
  imports: [
    CommonModule
  ]
})
export class PlanSectionModule { }
