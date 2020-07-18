import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { MaterialModule } from '../../../material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
// import { CustomerComponent } from './component/customer/customer.component';
// import { CustomCommonModule } from '../../../common/custom.common.module';
// import { EntryComponentsModule } from '../../../entry.components.module';
// import { AccountEntryModule } from './component/customer/accounts/account.entry.module';
// import { PlanEntryModule } from './component/customer/plan/plan.entry.module';
// import { DynamicComponentService } from '../../../services/dynamic-component.service';
// import { AdviceEntryModule } from './component/customer/customer-activity/advice-entry.module';
// import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
// import { CustomerOverviewEntryModule } from './component/customer/customer-overview/customer-overview-entry-module';
// import { TransactionSuccessfulComponent } from './component/customer/transaction-successful/transaction-successful.component';
// import { MatStepperModule } from '@angular/material/stepper';
// import { AdvisorAndOrganizationInfoService } from './resolvers/advisor-and-organization-info.service';
// import { TransactionEntryModule } from '../AdviserComponent/transactions/transaction.entry.module';
// import { SubscriptionEntry } from '../AdviserComponent/Subscriptions/subscription.entry.module';
// import { SubscriptionUpperEntry } from '../AdviserComponent/Subscriptions/subscription-upper-entry-module';
// import { MobileMyfeedComponent } from './component/customer/mobile/myfeed/mobile-myfeed/mobile-myfeed.component';
// import { MobileDocumentComponent } from './component/customer/mobile/document/mobile-document/mobile-document.component';
// import { MobilePortfoiloComponent } from './component/customer/mobile/portfolio/mobile-portfoilo/mobile-portfoilo.component';
// import { MobileProfileComponent } from './component/customer/mobile/profile/mobile-profile/mobile-profile.component';
// import { MobileTransactionsComponent } from './component/customer/mobile/transactions/mobile-transactions/mobile-transactions.component';
// import { MobileLeftSidenavComponent } from './component/customer/mobile/left-side/mobile-left-sidenav/mobile-left-sidenav.component';
// import { MobileRoutingModule } from './mobile-routing.module';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
// import { EditDocumentPopupComponent } from './component/customer/mobile/document/mobile-document/edit-document-popup/edit-document-popup.component';
// import { UploadDocumentComponent } from './component/customer/mobile/document/mobile-document/upload-document/upload-document.component';
// import { MutualFundsComponent } from './component/customer/mobile/mutual-funds/mutual-funds/mutual-funds.component';
// import { MutualFundDetailsComponent } from './component/customer/mobile/mutual-funds/mutual-fund-details/mutual-fund-details.component';
// import { MoveCopyMobileViewComponent } from './component/customer/mobile/document/mobile-document/move-copy-mobile-view/move-copy-mobile-view.component';
// import { FixedIncomeMobComponent } from './component/customer/mobile/fixed-income-mob/fixed-income-mob.component';
// import { MobileViewAddressComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-address/mobile-view-address.component';
// import { MobileViewBankComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-bank/mobile-view-bank.component';
// import { MobileViewDematComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-demat/mobile-view-demat.component';
// import { AddEditBankMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/add-edit-bank-mobile-view/add-edit-bank-mobile-view.component';
// import { AddEditDocumentMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/add-edit-document-mobile-view/add-edit-document-mobile-view.component';
// import { AddEditDematMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/add-edit-demat-mobile-view/add-edit-demat-mobile-view.component';
// import { IndividualMemberFormComponent } from './component/customer/mobile/profile/mobile-profile/individual-member-form/individual-member-form.component';
// import { MinorMemberFormComponent } from './component/customer/mobile/profile/mobile-profile/minor-member-form/minor-member-form.component';
// import { RetirementAccMobComponent } from './component/customer/mobile/retirement-acc-mob/retirement-acc-mob.component';
import { RealEstateComponent } from './component/customer/mobile/real-estate/real-estate.component';
import { SmallSavingComponent } from './component/customer/mobile/small-saving/small-saving.component';
import { CashAndBankComponent } from './component/customer/mobile/cash-and-bank/cash-and-bank.component';
import { CommoditiesComponent } from './component/customer/mobile/commodities/commodities.component';
import { LiabilitiesComponent } from './component/customer/mobile/liabilities/liabilities.component';
import { LifeInsuranceComponent } from './component/customer/mobile/life-insurance/life-insurance.component';
import { GeneralInsuranceComponent } from './component/customer/mobile/general-insurance/general-insurance.component';
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
import { SubscriptionEntry } from '../AdviserComponent/Subscriptions/subscription.entry.module';
import { SubscriptionUpperEntry } from '../AdviserComponent/Subscriptions/subscription-upper-entry-module';
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
// import { MobileViewMoreInfoComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-more-info/mobile-view-more-info.component';
import { CashAndBankMobComponent } from './component/customer/mobile/cash-and-bank-mob/cash-and-bank-mob.component';
import { StocksMobComponent } from './component/customer/mobile/stocks-mob/stocks-mob.component';
import { RealEstateMobComponent } from './component/customer/mobile/real-estate-mob/real-estate-mob.component';
import { SmallSavingMobComponent } from './component/customer/mobile/small-saving-mob/small-saving-mob.component';
import { CommoditiesMobComponent } from './component/customer/mobile/commodities-mob/commodities-mob.component';
import { LiabilitiesMobComponent } from './component/customer/mobile/liabilities-mob/liabilities-mob.component';
import { LifeInsuranceMobComponent } from './component/customer/mobile/life-insurance-mob/life-insurance-mob.component';
import { GeneralInsuranceMobComponent } from './component/customer/mobile/general-insurance-mob/general-insurance-mob.component';
import { AddGoldMobComponent } from './component/customer/mobile/commodities-mob/add-gold-mob/add-gold-mob.component';


import { BankDetailedAssetsComponent } from './component/customer/mobile/bank-detailed-assets/bank-detailed-assets.component';
import { FixedDepositMobComponent } from './component/customer/mobile/fixed-income-mob/fixed-deposit-mob/fixed-deposit-mob.component';
import { BondMobComponent } from './component/customer/mobile/fixed-income-mob/bond-mob/bond-mob.component';
import { RecurringDepositeMobComponent } from './component/customer/mobile/fixed-income-mob/recurring-deposite-mob/recurring-deposite-mob.component';
import { MobileViewMoreInfoComponent } from './component/customer/mobile/profile/mobile-profile/mobile-view-more-info/mobile-view-more-info.component';
import { AddOthersMobComponent } from './component/customer/mobile/commodities-mob/add-others-mob/add-others-mob.component';
import { EpfMobComponent } from './component/customer/mobile/retirement-acc-mob/epf-mob/epf-mob.component';
import { NpsMobComponent } from './component/customer/mobile/retirement-acc-mob/nps-mob/nps-mob.component';
import { GratuityMobComponent } from './component/customer/mobile/retirement-acc-mob/gratuity-mob/gratuity-mob.component';
import { GetRetirementMobComponent } from './component/customer/mobile/retirement-acc-mob/get-retirement-mob/get-retirement-mob.component';
import { HolderNameMobileViewComponent } from './component/customer/mobile/profile/mobile-profile/holder-name-mobile-view/holder-name-mobile-view.component';
import { CommonComponentModule } from '../common-component/common-component.module';
import { MobInvestComponent } from './component/customer/mobile/mob-invest/mob-invest.component';
import { AddBankAccMobComponent } from './component/customer/mobile/cash-and-bank-mob/add-bank-acc-mob/add-bank-acc-mob.component';
import { AddCashInHandMobComponent } from './component/customer/mobile/cash-and-bank-mob/add-cash-in-hand-mob/add-cash-in-hand-mob.component';
import { GetSmallSavingSchemeComponent } from './component/customer/mobile/small-saving-mob/get-small-saving-scheme/get-small-saving-scheme.component';
import { PpfMobComponent } from './component/customer/mobile/small-saving-mob/ppf-mob/ppf-mob.component';
import { NscMobComponent } from './component/customer/mobile/small-saving-mob/nsc-mob/nsc-mob.component';
import { SsyMobComponent } from './component/customer/mobile/small-saving-mob/ssy-mob/ssy-mob.component';
import { KvpMobComponent } from './component/customer/mobile/small-saving-mob/kvp-mob/kvp-mob.component';
import { ScssMobComponent } from './component/customer/mobile/small-saving-mob/scss-mob/scss-mob.component';
import { PoSavingsMobComponent } from './component/customer/mobile/small-saving-mob/po-savings-mob/po-savings-mob.component';
import { PoTdMobComponent } from './component/customer/mobile/small-saving-mob/po-td-mob/po-td-mob.component';
import { PoRdMobComponent } from './component/customer/mobile/small-saving-mob/po-rd-mob/po-rd-mob.component';
import { PoMisMobComponent } from './component/customer/mobile/small-saving-mob/po-mis-mob/po-mis-mob.component';
import { AddRealEstateMobComponent } from './component/customer/mobile/real-estate-mob/add-real-estate-mob/add-real-estate-mob.component';
import { AddLiabilitiesMobComponent } from './component/customer/mobile/liabilities-mob/add-liabilities-mob/add-liabilities-mob.component';
import { AddOtherPayablesMobComponent } from './component/customer/mobile/liabilities-mob/add-other-payables-mob/add-other-payables-mob.component';
import { MobNpsComponent } from './component/customer/mobile/mob-nps/mob-nps.component';
import { AddTransactionMobComponent } from './component/customer/mobile/add-transaction-mob/add-transaction-mob.component';
import { DetailedBondMobComponent } from './component/customer/mobile/fixed-income-mob/bond-mob/detailed-bond-mob/detailed-bond-mob.component';
import { DetailedFixedDepositMobComponent } from './component/customer/mobile/fixed-income-mob/fixed-deposit-mob/detailed-fixed-deposit-mob/detailed-fixed-deposit-mob.component';
import { DetailedRecurringDepositMobComponent } from './component/customer/mobile/fixed-income-mob/recurring-deposite-mob/detailed-recurring-deposit-mob/detailed-recurring-deposit-mob.component';
import { AddInsuranceMobComponent } from './component/customer/mobile/life-insurance-mob/add-insurance-mob/add-insurance-mob.component';
import { AddHealthMobComponent } from './component/customer/mobile/general-insurance-mob/add-health-mob/add-health-mob.component';
import { AddPersonalAccidentMobComponent } from './component/customer/mobile/general-insurance-mob/add-personal-accident-mob/add-personal-accident-mob.component';
import { CriticalIllnesMobComponent } from './component/customer/mobile/general-insurance-mob/critical-illnes-mob/critical-illnes-mob.component';
import { MotorInsuranceMobComponent } from './component/customer/mobile/general-insurance-mob/motor-insurance-mob/motor-insurance-mob.component';
import { TravelInsuranceMobComponent } from './component/customer/mobile/general-insurance-mob/travel-insurance-mob/travel-insurance-mob.component';
import { HomeInsuranceMobComponent } from './component/customer/mobile/general-insurance-mob/home-insurance-mob/home-insurance-mob.component';
import { FireInsuranceMobComponent } from './component/customer/mobile/general-insurance-mob/fire-insurance-mob/fire-insurance-mob.component';
import { DetailedViewLifeInsuranceMobComponent } from './component/customer/mobile/life-insurance-mob/detailed-view-life-insurance-mob/detailed-view-life-insurance-mob.component';
import { DetailedViewGeneralInsuranceMobComponent } from './component/customer/mobile/general-insurance-mob/detailed-view-general-insurance-mob/detailed-view-general-insurance-mob.component';
import { DetailedEpfMobComponent } from './component/customer/mobile/retirement-acc-mob/epf-mob/detailed-epf-mob/detailed-epf-mob.component';
import { DetailedGrauityMobComponent } from './component/customer/mobile/retirement-acc-mob/gratuity-mob/detailed-grauity-mob/detailed-grauity-mob.component';
import { DetailedNpsMobComponent } from './component/customer/mobile/retirement-acc-mob/nps-mob/detailed-nps-mob/detailed-nps-mob.component';
import { DetailedKvpMobComponent } from './component/customer/mobile/small-saving-mob/kvp-mob/detailed-kvp-mob/detailed-kvp-mob.component';
import { DetailedNscMobComponent } from './component/customer/mobile/small-saving-mob/nsc-mob/detailed-nsc-mob/detailed-nsc-mob.component';
import { DetailedPoMisMobComponent } from './component/customer/mobile/small-saving-mob/po-mis-mob/detailed-po-mis-mob/detailed-po-mis-mob.component';
import { DetailedPoRdMobComponent } from './component/customer/mobile/small-saving-mob/po-rd-mob/detailed-po-rd-mob/detailed-po-rd-mob.component';
import { DetailedPoSavingsComponent } from './component/customer/mobile/small-saving-mob/po-savings-mob/detailed-po-savings/detailed-po-savings.component';
import { DetailedPoTdMobComponent } from './component/customer/mobile/small-saving-mob/po-td-mob/detailed-po-td-mob/detailed-po-td-mob.component';
import { DetailedPpfComponent } from './component/customer/mobile/small-saving-mob/ppf-mob/detailed-ppf/detailed-ppf.component';
import { DetailedScssMobComponent } from './component/customer/mobile/small-saving-mob/scss-mob/detailed-scss-mob/detailed-scss-mob.component';
import { DetailedSsyMobComponent } from './component/customer/mobile/small-saving-mob/ssy-mob/detailed-ssy-mob/detailed-ssy-mob.component';


// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [CustomerComponent, TransactionSuccessfulComponent,
    MobileMyfeedComponent, MobileDocumentComponent, MobilePortfoiloComponent,
    MobileProfileComponent, MobileTransactionsComponent, MobileLeftSidenavComponent,
    UploadDocumentComponent, EditDocumentPopupComponent, MutualFundsComponent,
    MutualFundDetailsComponent, MoveCopyMobileViewComponent, FixedIncomeMobComponent,
    MobileViewAddressComponent, MobileViewBankComponent, MobileViewDematComponent,
    AddEditBankMobileViewComponent, AddEditDematMobileViewComponent,
    AddEditDocumentMobileViewComponent, IndividualMemberFormComponent,
    MinorMemberFormComponent, RetirementAccMobComponent, RealEstateComponent, SmallSavingComponent, CashAndBankComponent, CommoditiesComponent, LiabilitiesComponent, LifeInsuranceComponent, GeneralInsuranceComponent,
    MobileViewMoreInfoComponent,
    CashAndBankMobComponent, StocksMobComponent, RealEstateMobComponent, SmallSavingMobComponent, CommoditiesMobComponent, LiabilitiesMobComponent, LifeInsuranceMobComponent, GeneralInsuranceMobComponent,
    BankDetailedAssetsComponent, FixedDepositMobComponent, BondMobComponent,
    RecurringDepositeMobComponent, AddOthersMobComponent, EpfMobComponent, NpsMobComponent, GratuityMobComponent,
    GetRetirementMobComponent,
    NscMobComponent, SsyMobComponent, KvpMobComponent, AddBankAccMobComponent, AddCashInHandMobComponent, AddRealEstateMobComponent, AddLiabilitiesMobComponent, AddOtherPayablesMobComponent, AddTransactionMobComponent, BankDetailedAssetsComponent, FixedDepositMobComponent, BondMobComponent, RecurringDepositeMobComponent, AddOthersMobComponent, EpfMobComponent, NpsMobComponent, GratuityMobComponent, GetRetirementMobComponent, HolderNameMobileViewComponent, MobInvestComponent, GetSmallSavingSchemeComponent, PpfMobComponent, NscMobComponent, SsyMobComponent, KvpMobComponent, ScssMobComponent, PoSavingsMobComponent, PoTdMobComponent, PoRdMobComponent, PoMisMobComponent, AddBankAccMobComponent, AddCashInHandMobComponent, AddRealEstateMobComponent, AddLiabilitiesMobComponent, AddOtherPayablesMobComponent, DetailedBondMobComponent, DetailedFixedDepositMobComponent, DetailedRecurringDepositMobComponent,
    AddGoldMobComponent, MobNpsComponent,
    HolderNameMobileViewComponent, NscMobComponent,
    SsyMobComponent, KvpMobComponent,
    PoRdMobComponent, PoMisMobComponent, AddBankAccMobComponent, AddCashInHandMobComponent, AddRealEstateMobComponent,
    AddLiabilitiesMobComponent, AddOtherPayablesMobComponent, AddTransactionMobComponent, BankDetailedAssetsComponent,
    FixedDepositMobComponent, BondMobComponent, RecurringDepositeMobComponent, AddOthersMobComponent,
    NpsMobComponent, GratuityMobComponent, MobInvestComponent,
    GetSmallSavingSchemeComponent, PpfMobComponent, NscMobComponent, SsyMobComponent, KvpMobComponent, ScssMobComponent,
    PoSavingsMobComponent, PoTdMobComponent, AddBankAccMobComponent,
    AddCashInHandMobComponent, AddRealEstateMobComponent, AddLiabilitiesMobComponent, AddOtherPayablesMobComponent,
    AddInsuranceMobComponent, AddHealthMobComponent, AddPersonalAccidentMobComponent, CriticalIllnesMobComponent,
    MotorInsuranceMobComponent, TravelInsuranceMobComponent, HomeInsuranceMobComponent, FireInsuranceMobComponent,
    DetailedViewLifeInsuranceMobComponent, DetailedViewGeneralInsuranceMobComponent, DetailedEpfMobComponent, DetailedGrauityMobComponent, DetailedNpsMobComponent, DetailedKvpMobComponent, DetailedNscMobComponent, DetailedPoMisMobComponent, DetailedPoRdMobComponent, DetailedPoSavingsComponent, DetailedPoTdMobComponent, DetailedPpfComponent, DetailedScssMobComponent, DetailedSsyMobComponent],
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
    CommonComponentModule

    // PlanModule
  ],
  exports: [],
  providers: [DynamicComponentService, AdvisorAndOrganizationInfoService],
  entryComponents: [EntryComponentsModule.getComponentList(),
  AccountEntryModule.getComponentList(), AdviceEntryModule.getComponentList(),
  PlanEntryModule.getComponentList(), CustomerOverviewEntryModule.getComponentList(),
    UploadDocumentComponent, EditDocumentPopupComponent, AddTransactionMobComponent]
})
export class CustomersModule {
}
