import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { MaterialModule } from '../../../material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { CustomerComponent } from './component/customer/customer.component';

import { CustomCommonModule } from '../../../common/custom.common.module';
import { EntryComponentsModule } from '../../../entry.components.module';
import { AccountEntryModule } from './component/customer/accounts/account.entry.module';
import { PlanEntryModule } from './component/customer/plan/plan.entry.module';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { AdviceEntryModule } from './component/customer/customer-activity/advice-entry.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomerOverviewEntryModule } from './component/customer/customer-overview/customer-overview-entry-module';


// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [CustomerComponent],
  imports: [
    // BrowserModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    // AccountModule,
    // PlanModule,
    CustomCommonModule,
    // DynamicComponentModule,
    EntryComponentsModule,
    AccountEntryModule,
    PlanEntryModule,
    CustomersRoutingModule,
    AdviceEntryModule,
    CustomerOverviewEntryModule,
    CustomDirectiveModule
    // PlanModule
  ],
  exports: [],
  providers: [DynamicComponentService],
  entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), AdviceEntryModule.getComponentList()
    , PlanEntryModule.getComponentList(), CustomerOverviewEntryModule.getComponentList()]
})
export class CustomersModule {
}
