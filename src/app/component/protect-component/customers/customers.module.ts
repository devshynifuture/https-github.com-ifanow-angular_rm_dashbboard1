import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersRoutingModule} from './customers-routing.module';
import {MaterialModule} from '../../../material/material';
import {BottomSheetComponent} from './component/common-component/bottom-sheet/bottom-sheet.component';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import {AccountModule} from './component/customer/accounts/account.module';
import {SummaryPlanComponent} from './component/customer/plan/summary-plan/summary-plan.component';
import {ProfilePlanComponent} from './component/customer/plan/profile-plan/profile-plan.component';
import {InsurancePlanComponent} from './component/customer/plan/insurance-plan/insurance-plan.component';
import {GoalsPlanComponent} from './component/customer/plan/goals-plan/goals-plan.component';
import {TexesPlanComponent} from './component/customer/plan/texes-plan/texes-plan.component';
import {CashflowsPlanComponent} from './component/customer/plan/cashflows-plan/cashflows-plan.component';
import {InvestmentsPlanComponent} from './component/customer/plan/investments-plan/investments-plan.component';
import {ScenariosPlanComponent} from './component/customer/plan/scenarios-plan/scenarios-plan.component';
import {PlanModule} from './component/customer/plan/plan.module';
import {CustomerComponent} from "./component/customer/customer.component";
import {AddLiabilitiesComponent} from "./component/common-component/add-liabilities/add-liabilities.component";



// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [CustomerComponent],
  imports: [
    // BrowserModule,
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    AccountModule,
    PlanModule
  ],
  exports: [],
  entryComponents: [BottomSheetComponent]
})
export class CustomersModule {
}
 