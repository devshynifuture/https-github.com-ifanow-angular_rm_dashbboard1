import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { MaterialModule } from '../../../material/material';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomCommonModule } from '../../../common/custom.common.module';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { MatStepperModule } from '@angular/material/stepper';
import { AdvisorAndOrganizationInfoService } from './resolvers/advisor-and-organization-info.service';
import { MobileRoutingModule } from './mobile-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonComponentModule } from '../common-component/common-component.module';
import { CustomerComponent } from './customer/customer.component';
import { MobileDocumentComponent } from './customer/mobile/document/mobile-document/mobile-document.component';
import { MobilePortfoiloComponent } from './customer/mobile/portfolio/mobile-portfoilo/mobile-portfoilo.component';
import { MobileProfileComponent } from './customer/mobile/profile/mobile-profile/mobile-profile.component';
import { MobileTransactionsComponent } from './customer/mobile/transactions/mobile-transactions/mobile-transactions.component';
import { MobileLeftSidenavComponent } from './customer/mobile/left-side/mobile-left-sidenav/mobile-left-sidenav.component';
import { UploadDocumentComponent } from './customer/mobile/document/mobile-document/upload-document/upload-document.component';
import { EditDocumentPopupComponent } from './customer/mobile/document/mobile-document/edit-document-popup/edit-document-popup.component';
import { MutualFundsComponent } from './customer/mobile/mutual-funds/mutual-funds/mutual-funds.component';
import { MutualFundDetailsComponent } from './customer/mobile/mutual-funds/mutual-fund-details/mutual-fund-details.component';
import { MoveCopyMobileViewComponent } from './customer/mobile/document/mobile-document/move-copy-mobile-view/move-copy-mobile-view.component';
import { FixedIncomeMobComponent } from './customer/mobile/fixed-income-mob/fixed-income-mob.component';
import { MobileViewAddressComponent } from './customer/mobile/profile/mobile-profile/mobile-view-address/mobile-view-address.component';
import { MobileViewBankComponent } from './customer/mobile/profile/mobile-profile/mobile-view-bank/mobile-view-bank.component';
import { MobileViewDematComponent } from './customer/mobile/profile/mobile-profile/mobile-view-demat/mobile-view-demat.component';
import { AddEditBankMobileViewComponent } from './customer/mobile/profile/mobile-profile/add-edit-bank-mobile-view/add-edit-bank-mobile-view.component';
import { AddEditDematMobileViewComponent } from './customer/mobile/profile/mobile-profile/add-edit-demat-mobile-view/add-edit-demat-mobile-view.component';
import { AddEditDocumentMobileViewComponent } from './customer/mobile/profile/mobile-profile/add-edit-document-mobile-view/add-edit-document-mobile-view.component';
import { IndividualMemberFormComponent } from './customer/mobile/profile/mobile-profile/individual-member-form/individual-member-form.component';
import { MinorMemberFormComponent } from './customer/mobile/profile/mobile-profile/minor-member-form/minor-member-form.component';
import { RetirementAccMobComponent } from './customer/mobile/retirement-acc-mob/retirement-acc-mob.component';
import { RealEstateComponent } from './customer/mobile/real-estate/real-estate.component';
import { SmallSavingComponent } from './customer/mobile/small-saving/small-saving.component';
import { CashAndBankComponent } from './customer/mobile/cash-and-bank/cash-and-bank.component';
import { CommoditiesComponent } from './customer/mobile/commodities/commodities.component';
import { LiabilitiesComponent } from './customer/mobile/liabilities/liabilities.component';
import { LifeInsuranceComponent } from './customer/mobile/life-insurance/life-insurance.component';
import { GeneralInsuranceComponent } from './customer/mobile/general-insurance/general-insurance.component';
import { MobileViewMoreInfoComponent } from './customer/mobile/profile/mobile-profile/mobile-view-more-info/mobile-view-more-info.component';
import { CashAndBankMobComponent } from './customer/mobile/cash-and-bank-mob/cash-and-bank-mob.component';
import { StocksMobComponent } from './customer/mobile/stocks-mob/stocks-mob.component';
import { RealEstateMobComponent } from './customer/mobile/real-estate-mob/real-estate-mob.component';
import { SmallSavingMobComponent } from './customer/mobile/small-saving-mob/small-saving-mob.component';
import { CommoditiesMobComponent } from './customer/mobile/commodities-mob/commodities-mob.component';
import { LiabilitiesMobComponent } from './customer/mobile/liabilities-mob/liabilities-mob.component';
import { LifeInsuranceMobComponent } from './customer/mobile/life-insurance-mob/life-insurance-mob.component';
import { GeneralInsuranceMobComponent } from './customer/mobile/general-insurance-mob/general-insurance-mob.component';
import { BankDetailedAssetsComponent } from './customer/mobile/bank-detailed-assets/bank-detailed-assets.component';
import { FixedDepositMobComponent } from './customer/mobile/fixed-income-mob/fixed-deposit-mob/fixed-deposit-mob.component';
import { BondMobComponent } from './customer/mobile/fixed-income-mob/bond-mob/bond-mob.component';
import { RecurringDepositeMobComponent } from './customer/mobile/fixed-income-mob/recurring-deposite-mob/recurring-deposite-mob.component';
import { AddOthersMobComponent } from './customer/mobile/commodities-mob/add-others-mob/add-others-mob.component';
import { EpfMobComponent } from './customer/mobile/retirement-acc-mob/epf-mob/epf-mob.component';
import { NpsMobComponent } from './customer/mobile/retirement-acc-mob/nps-mob/nps-mob.component';
import { GratuityMobComponent } from './customer/mobile/retirement-acc-mob/gratuity-mob/gratuity-mob.component';
import { GetRetirementMobComponent } from './customer/mobile/retirement-acc-mob/get-retirement-mob/get-retirement-mob.component';
import { NscMobComponent } from './customer/mobile/small-saving-mob/nsc-mob/nsc-mob.component';
import { SsyMobComponent } from './customer/mobile/small-saving-mob/ssy-mob/ssy-mob.component';
import { KvpMobComponent } from './customer/mobile/small-saving-mob/kvp-mob/kvp-mob.component';
import { AddBankAccMobComponent } from './customer/mobile/cash-and-bank-mob/add-bank-acc-mob/add-bank-acc-mob.component';
import { AddCashInHandMobComponent } from './customer/mobile/cash-and-bank-mob/add-cash-in-hand-mob/add-cash-in-hand-mob.component';
import { AddRealEstateMobComponent } from './customer/mobile/real-estate-mob/add-real-estate-mob/add-real-estate-mob.component';
import { AddLiabilitiesMobComponent } from './customer/mobile/liabilities-mob/add-liabilities-mob/add-liabilities-mob.component';
import { AddOtherPayablesMobComponent } from './customer/mobile/liabilities-mob/add-other-payables-mob/add-other-payables-mob.component';
import { AddTransactionMobComponent } from './customer/mobile/add-transaction-mob/add-transaction-mob.component';
import { HolderNameMobileViewComponent } from './customer/mobile/profile/mobile-profile/holder-name-mobile-view/holder-name-mobile-view.component';
import { MobInvestComponent } from './customer/mobile/mob-invest/mob-invest.component';
import { GetSmallSavingSchemeComponent } from './customer/mobile/small-saving-mob/get-small-saving-scheme/get-small-saving-scheme.component';
import { PpfMobComponent } from './customer/mobile/small-saving-mob/ppf-mob/ppf-mob.component';
import { ScssMobComponent } from './customer/mobile/small-saving-mob/scss-mob/scss-mob.component';
import { PoSavingsMobComponent } from './customer/mobile/small-saving-mob/po-savings-mob/po-savings-mob.component';
import { PoTdMobComponent } from './customer/mobile/small-saving-mob/po-td-mob/po-td-mob.component';
import { PoRdMobComponent } from './customer/mobile/small-saving-mob/po-rd-mob/po-rd-mob.component';
import { PoMisMobComponent } from './customer/mobile/small-saving-mob/po-mis-mob/po-mis-mob.component';
import { DetailedBondMobComponent } from './customer/mobile/fixed-income-mob/bond-mob/detailed-bond-mob/detailed-bond-mob.component';
import { DetailedFixedDepositMobComponent } from './customer/mobile/fixed-income-mob/fixed-deposit-mob/detailed-fixed-deposit-mob/detailed-fixed-deposit-mob.component';
import { DetailedRecurringDepositMobComponent } from './customer/mobile/fixed-income-mob/recurring-deposite-mob/detailed-recurring-deposit-mob/detailed-recurring-deposit-mob.component';
import { AddGoldMobComponent } from './customer/mobile/commodities-mob/add-gold-mob/add-gold-mob.component';
import { MobNpsComponent } from './customer/mobile/mob-nps/mob-nps.component';
import { AddInsuranceMobComponent } from './customer/mobile/life-insurance-mob/add-insurance-mob/add-insurance-mob.component';
import { AddHealthMobComponent } from './customer/mobile/general-insurance-mob/add-health-mob/add-health-mob.component';
import { AddPersonalAccidentMobComponent } from './customer/mobile/general-insurance-mob/add-personal-accident-mob/add-personal-accident-mob.component';
import { CriticalIllnesMobComponent } from './customer/mobile/general-insurance-mob/critical-illnes-mob/critical-illnes-mob.component';
import { MotorInsuranceMobComponent } from './customer/mobile/general-insurance-mob/motor-insurance-mob/motor-insurance-mob.component';
import { TravelInsuranceMobComponent } from './customer/mobile/general-insurance-mob/travel-insurance-mob/travel-insurance-mob.component';
import { HomeInsuranceMobComponent } from './customer/mobile/general-insurance-mob/home-insurance-mob/home-insurance-mob.component';
import { FireInsuranceMobComponent } from './customer/mobile/general-insurance-mob/fire-insurance-mob/fire-insurance-mob.component';
import { DetailedViewLifeInsuranceMobComponent } from './customer/mobile/life-insurance-mob/detailed-view-life-insurance-mob/detailed-view-life-insurance-mob.component';
import { DetailedViewGeneralInsuranceMobComponent } from './customer/mobile/general-insurance-mob/detailed-view-general-insurance-mob/detailed-view-general-insurance-mob.component';
import { DetailedEpfMobComponent } from './customer/mobile/retirement-acc-mob/epf-mob/detailed-epf-mob/detailed-epf-mob.component';
import { DetailedGrauityMobComponent } from './customer/mobile/retirement-acc-mob/gratuity-mob/detailed-grauity-mob/detailed-grauity-mob.component';
import { DetailedNpsMobComponent } from './customer/mobile/retirement-acc-mob/nps-mob/detailed-nps-mob/detailed-nps-mob.component';
import { DetailedKvpMobComponent } from './customer/mobile/small-saving-mob/kvp-mob/detailed-kvp-mob/detailed-kvp-mob.component';
import { DetailedNscMobComponent } from './customer/mobile/small-saving-mob/nsc-mob/detailed-nsc-mob/detailed-nsc-mob.component';
import { DetailedPoMisMobComponent } from './customer/mobile/small-saving-mob/po-mis-mob/detailed-po-mis-mob/detailed-po-mis-mob.component';
import { DetailedPoRdMobComponent } from './customer/mobile/small-saving-mob/po-rd-mob/detailed-po-rd-mob/detailed-po-rd-mob.component';
import { DetailedPoSavingsComponent } from './customer/mobile/small-saving-mob/po-savings-mob/detailed-po-savings/detailed-po-savings.component';
import { DetailedPoTdMobComponent } from './customer/mobile/small-saving-mob/po-td-mob/detailed-po-td-mob/detailed-po-td-mob.component';
import { DetailedPpfComponent } from './customer/mobile/small-saving-mob/ppf-mob/detailed-ppf/detailed-ppf.component';
import { DetailedScssMobComponent } from './customer/mobile/small-saving-mob/scss-mob/detailed-scss-mob/detailed-scss-mob.component';
import { DetailedSsyMobComponent } from './customer/mobile/small-saving-mob/ssy-mob/detailed-ssy-mob/detailed-ssy-mob.component';
import { CustomerOverviewEntryModule } from './customer/customer-overview/customer-overview-entry-module';
import { MobileMyfeedComponent } from './customer/mobile/mobile-myfeed/mobile-myfeed.component';
import { DetailedViewGoldMobComponent } from './customer/mobile/commodities-mob/add-gold-mob/detailed-view-gold-mob/detailed-view-gold-mob.component';
import { DetailedViewRealEstateMobComponent } from './customer/mobile/real-estate-mob/add-real-estate-mob/detailed-view-real-estate-mob/detailed-view-real-estate-mob.component';
// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';

// TransactionSuccessfulComponent

@NgModule({
  declarations: [CustomerComponent, MobileDocumentComponent, MobilePortfoiloComponent,
    MobileProfileComponent, MobileTransactionsComponent, MobileLeftSidenavComponent,
    UploadDocumentComponent, EditDocumentPopupComponent,
    MoveCopyMobileViewComponent, FixedIncomeMobComponent,
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
    DetailedViewLifeInsuranceMobComponent, DetailedViewGeneralInsuranceMobComponent, DetailedEpfMobComponent, DetailedGrauityMobComponent, DetailedNpsMobComponent, DetailedKvpMobComponent, DetailedNscMobComponent, DetailedPoMisMobComponent, DetailedPoRdMobComponent, DetailedPoSavingsComponent, DetailedPoTdMobComponent, DetailedPpfComponent, DetailedScssMobComponent, DetailedSsyMobComponent, MobileMyfeedComponent,
    MutualFundsComponent, MutualFundDetailsComponent, DetailedViewGoldMobComponent, DetailedViewRealEstateMobComponent],
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

    CustomersRoutingModule,
    MobileRoutingModule,
    SlickCarouselModule,
    CustomerOverviewEntryModule,
    CustomDirectiveModule,
    MatStepperModule,

    CommonComponentModule

    // PlanModule
  ],
  exports: [],
  providers: [DynamicComponentService, AdvisorAndOrganizationInfoService],
  entryComponents: [CustomerOverviewEntryModule.getComponentList(),
    UploadDocumentComponent, EditDocumentPopupComponent, AddTransactionMobComponent]
})
export class CustomersModule {
}
