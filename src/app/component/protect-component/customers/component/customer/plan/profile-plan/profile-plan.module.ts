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
import { InsuranceModule } from '../../accounts/insurance/insurance.module';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { EntryComponentsModule } from 'src/app/entry.components.module';
import { AccountEntryModule } from '../../accounts/account.entry.module';
import { PlanEntryModule } from '../plan.entry.module';
import { CustomersRoutingModule } from '../../../../customers-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AdviceEntryModule } from '../../customer-activity/advice-entry.module';
import { CustomerOverviewEntryModule } from '../../customer-overview/customer-overview-entry-module';
import { MatStepperModule } from '@angular/material';
import { TransactionEntryModule } from 'src/app/component/protect-component/AdviserComponent/transactions/transaction.entry.module';
import { CommonComponentModule } from 'src/app/component/protect-component/common-component/common-component.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MutualFundModule } from '../../accounts/assets/mutual-fund/mutual-fund/mutual-fund.module';
import { AssetsModule } from '../../accounts/assets/assets.module';
import { CustomersModule } from '../../../../customers.module';
import { LiabilitiesModule } from '../../accounts/liabilities/liabilities.module';
import { PlanGoalsModule } from '../goals-plan/plan-goals.module';
import { InsurancePlanModule } from '../insurance-plan/insurance-plan.module';


@NgModule({
  declarations: [ProfilePlanComponent, IncomeComponent, RiskProfileComponent, ExpensesComponent, FinacialPlanSectionComponent],
  imports: [
    CommonModule,
    ProfilePlanRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    InsuranceModule,
    MutualFundModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    AssetsModule,
    CustomersModule,
    LiabilitiesModule,
    PlanGoalsModule,
    AssetsModule,
    InsurancePlanModule
  ]
})
export class ProfilePlanModule { }
