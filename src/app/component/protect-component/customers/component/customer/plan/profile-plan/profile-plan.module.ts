import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePlanRoutingModule } from './profile-plan-routing.module';
import { ProfilePlanComponent } from './profile-plan.component';
import { IncomeComponent } from './income/income.component';
import { RiskProfileComponent } from './riskProfile/risk-profile/risk-profile.component';
import { ExpensesComponent } from '../../accounts/expenses/expenses.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { FinacialPlanSectionComponent } from './finacial-plan-section/finacial-plan-section.component';


@NgModule({
  declarations: [ProfilePlanComponent, IncomeComponent, RiskProfileComponent, ExpensesComponent, FinacialPlanSectionComponent],
  imports: [
    CommonModule,
    ProfilePlanRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ]
})
export class ProfilePlanModule { }
