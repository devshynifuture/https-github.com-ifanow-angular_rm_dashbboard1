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
import { MobileRoutingModule } from './mobile-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { EditDocumentPopupComponent } from './component/customer/mobile/document/mobile-document/edit-document-popup/edit-document-popup.component';
import { UploadDocumentComponent } from './component/customer/mobile/document/mobile-document/upload-document/upload-document.component';
import { MutualFundsComponent } from './component/customer/mobile/mutual-funds/mutual-funds/mutual-funds.component';
import { MutualFundDetailsComponent } from './component/customer/mobile/mutual-funds/mutual-fund-details/mutual-fund-details.component';
import { MoveCopyMobileViewComponent } from './component/customer/mobile/document/mobile-document/move-copy-mobile-view/move-copy-mobile-view.component';
import { FixedIncomeMobComponent } from './component/customer/mobile/fixed-income-mob/fixed-income-mob.component';
import { MobileViewAddressComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-address/mobile-view-address.component';
import { MobileViewBankComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-bank/mobile-view-bank.component';
import { MobileViewDematComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-demat/mobile-view-demat.component';
import { AddEditBankMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/add-edit-bank-mobile-view/add-edit-bank-mobile-view.component';
import { AddEditDocumentMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/add-edit-document-mobile-view/add-edit-document-mobile-view.component';
import { AddEditDematMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/add-edit-demat-mobile-view/add-edit-demat-mobile-view.component';
import { IndividualMemberFormComponent } from './component/customer/mobile/profile/mobile-profile/individual-member-form/individual-member-form.component';
import { MinorMemberFormComponent } from './component/customer/mobile/profile/mobile-profile/minor-member-form/minor-member-form.component';
import { RetirementAccMobComponent } from './component/customer/mobile/retirement-acc-mob/retirement-acc-mob.component';




// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [CustomerComponent, TransactionSuccessfulComponent, MobileMyfeedComponent, MobileDocumentComponent, MobilePortfoiloComponent, MobileProfileComponent, MobileTransactionsComponent, MobileLeftSidenavComponent, UploadDocumentComponent, EditDocumentPopupComponent, MutualFundsComponent, MutualFundDetailsComponent, MoveCopyMobileViewComponent, FixedIncomeMobComponent, MobileViewAddressComponent, MobileViewBankComponent, MobileViewDematComponent, AddEditBankMobileViewComponent, AddEditDematMobileViewComponent, AddEditDocumentMobileViewComponent, IndividualMemberFormComponent, MinorMemberFormComponent,RetirementAccMobComponent],
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
      MobileRoutingModule,
    SlickCarouselModule,
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
  entryComponents: [EntryComponentsModule.getComponentList(), AccountEntryModule.getComponentList(), AdviceEntryModule.getComponentList(),
  PlanEntryModule.getComponentList(), CustomerOverviewEntryModule.getComponentList(), UploadDocumentComponent, EditDocumentPopupComponent]
})
export class CustomersModule {
}
