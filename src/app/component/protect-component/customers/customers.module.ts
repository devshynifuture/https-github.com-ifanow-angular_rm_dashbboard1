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
import { TransactionSuccessfulComponent } from './component/customer/transaction-successful/transaction-successful.component';
import { MatStepperModule } from '@angular/material/stepper';
import { AdvisorAndOrganizationInfoService } from './resolvers/advisor-and-organization-info.service';
import { TransactionEntryModule } from '../AdviserComponent/transactions/transaction.entry.module';
import { SubscriptionEntry } from "../AdviserComponent/Subscriptions/subscription.entry.module";
import { SubscriptionUpperEntry } from "../AdviserComponent/Subscriptions/subscription-upper-entry-module";
import { MobileMyfeedComponent } from './component/customer/mobile/myfeed/mobile-myfeed/mobile-myfeed.component';
import { MobileDocumentComponent } from './component/customer/mobile/document/mobile-document/mobile-document.component';
import { MobilePortfoiloComponent } from './component/customer/mobile/portfolio/mobile-portfoilo/mobile-portfoilo.component';
import { MobileProfileComponent } from './component/customer/mobile/profile/mobile-profile/mobile-profile.component';
import { MobileTransactionsComponent } from './component/customer/mobile/transactions/mobile-transactions/mobile-transactions.component';
import { MobileLeftSidenavComponent } from './component/customer/mobile/left-side/mobile-left-sidenav/mobile-left-sidenav.component';


// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [CustomerComponent, TransactionSuccessfulComponent, MobileMyfeedComponent, MobileDocumentComponent, MobilePortfoiloComponent, MobileProfileComponent, MobileTransactionsComponent, MobileLeftSidenavComponent],
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
   // MobileRoutingModule,
   
    AdviceEntryModule,
    CustomerOverviewEntryModule,
    CustomDirectiveModule,
    MatStepperModule,
    TransactionEntryModule,
    SubscriptionEntry,
    SubscriptionUpperEntry,

    // PlanModule
  ],
  exports: [],
  providers: [DynamicComponentService, AdvisorAndOrganizationInfoService],
  entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), AdviceEntryModule.getComponentList()
    , PlanEntryModule.getComponentList(), CustomerOverviewEntryModule.getComponentList()]
})
export class CustomersModule {
}
