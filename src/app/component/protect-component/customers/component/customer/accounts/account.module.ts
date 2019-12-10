import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerDocumentsComponent} from './customer-documents/customer-documents.component';
import {AddProfileSummaryComponent} from '../../common-component/add-profile-summary/add-profile-summary.component';
import {MutualFundsCapitalComponent} from './mutual-funds-capital/mutual-funds-capital.component';
import {DocumentsComponent} from './documents/documents.component';
import {InsuranceComponent} from './insurance/insurance.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {CustomerComponent} from '../customer.component';
import {MaterialModule} from '../../../../../../material/material';
import {AccountsComponent} from './accounts.component';
import {AssetsComponent} from './assets/assets.component';
import {SchemeLevelTransactionComponent} from '../../common-component/scheme-level-transaction/scheme-level-transaction.component';
import {SummaryComponent} from './summary/summary.component';
import {BottomSheetComponent} from '../../common-component/bottom-sheet/bottom-sheet.component';
import {LibilitiesRightComponent} from './liabilities/libilities-right/libilities-right.component';
import {LiabilitiesComponent} from './liabilities/liabilities.component';
import {ChartModule} from 'angular-highcharts';
import {RightFilterComponent} from '../../common-component/right-filter/right-filter.component';
import {FixedIncomeComponent} from './assets/fixedIncome/fixed-income/fixed-income.component';
import {IncomeDetailComponent} from '../../common-component/income-detail/income-detail.component';
import {DetailedViewComponent} from '../../common-component/detailed-view/detailed-view.component';
import {RetirementAccountComponent} from './assets/retirementAccounts/retirement-account/retirement-account.component';
import {PPFSchemeComponent} from './assets/smallSavingScheme/ppf-scheme/ppf-scheme.component';
import {NscSchemeComponent} from './assets/smallSavingScheme/nsc-scheme/nsc-scheme.component';
import {SsySchemeComponent} from './assets/smallSavingScheme/ssy-scheme/ssy-scheme.component';
import {KvpSchemeComponent} from './assets/smallSavingScheme/kvp-scheme/kvp-scheme.component';
import {ScssSchemeComponent} from './assets/smallSavingScheme/scss-scheme/scss-scheme.component';
import {PoSavingsComponent} from './assets/smallSavingScheme/po-savings/po-savings.component';
import {PoRdSchemeComponent} from './assets/smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import {PoTdSchemeComponent} from './assets/smallSavingScheme/po-td-scheme/po-td-scheme.component';
import {PoMisSchemeComponent} from './assets/smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import {SmallSavingSchemeComponent} from './assets/smallSavingScheme/small-saving-scheme/small-saving-scheme.component';
import {RealEstateComponent} from './assets/realEstate/real-estate/real-estate.component';
import {OtherPayablesComponent} from './liabilities/other-payables/other-payables.component';
// import {PlanComponent} from '../plan/plan.component';
// import {SummaryPlanComponent} from '../plan/summary-plan/summary-plan.component';
// import {ProfilePlanComponent} from '../plan/profile-plan/profile-plan.component';
// import {InsurancePlanComponent} from '../plan/insurance-plan/insurance-plan.component';
// import {GoalsPlanComponent} from '../plan/goals-plan/goals-plan.component';
// import {TexesPlanComponent} from '../plan/texes-plan/texes-plan.component';
// import {CashflowsPlanComponent} from '../plan/cashflows-plan/cashflows-plan.component';
// import {InvestmentsPlanComponent} from '../plan/investments-plan/investments-plan.component';
// import {ScenariosPlanComponent} from '../plan/scenarios-plan/scenarios-plan.component';

import {CashAndBankComponent} from './assets/cash&bank/cash-and-bank/cash-and-bank.component';
import {CommoditiesComponent} from './assets/commodities/commodities/commodities.component';
import {SkeletonLoadingDirective} from 'src/app/skeleton-loading.directive';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {DocumentNewFolderComponent} from '../../common-component/document-new-folder/document-new-folder.component';
import {AccountRoutingModule} from "./account-routing.module";
import {AccountCommonModule} from "./account.common.module";
// import {PDFExportModule} from "@progress/kendo-angular-pdf-export";
import { AssetStocksComponent } from './assets/asset-stocks/asset-stocks.component';
@NgModule({
  declarations: [
    SchemeLevelTransactionComponent,
    CustomerDocumentsComponent,
    AccountsComponent,
    SummaryComponent,
    AssetsComponent,
    LiabilitiesComponent,
    InsuranceComponent,
    AddProfileSummaryComponent,
    DocumentsComponent,
    MutualFundsCapitalComponent,
    BottomSheetComponent,
    // AddLiabilitiesComponent,
    // AddInsuranceComponent,
    LibilitiesRightComponent,
    // FixedDepositComponent,
    // FactShitComponent,
    // TransactionsComponent,
    // UpperCustomerComponent ,
    RightFilterComponent,
    FixedIncomeComponent,
    //BondsComponent,
    IncomeDetailComponent,
    DetailedViewComponent,
    //LiabilitiesDetailComponent,
    RetirementAccountComponent,
    PPFSchemeComponent,
    NscSchemeComponent,
    SsySchemeComponent,
    KvpSchemeComponent,
    ScssSchemeComponent,
    PoSavingsComponent,
    PoRdSchemeComponent,
    PoTdSchemeComponent,
    PoMisSchemeComponent,
    SmallSavingSchemeComponent,
    RealEstateComponent,
    // AddRealEstateComponent,
    // NpsSummaryPortfolioComponent,
    // AddPpfComponent,
    // AddNscComponent,
    // AddSsyComponent,
    // AddKvpComponent,
    // AddScssComponent,
    // AddPoSavingComponent,
    // AddPoTdComponent,
    // AddPoMisComponent,
    // AddPoRdComponent,
    OtherPayablesComponent,
    CashAndBankComponent,
    CommoditiesComponent,
    // GoldComponent,
    // OthersComponent,
    // BankAccountsComponent,
    // CashInHandComponent,
    // AddTransactionComponent,
    SkeletonLoadingDirective,
    FormatNumberDirective,
    DocumentNewFolderComponent,
    AssetStocksComponent,
  ],
  imports: [
    AccountRoutingModule,
    AccountCommonModule,
    // BrowserModule,
    // OwnerComponentModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    // PDFExportModule,
    MaterialModule
  ],
  exports: [
    AccountsComponent,
    CashAndBankComponent,
    CommoditiesComponent,
    LibilitiesRightComponent,
    // AddSuperannuationComponent,
    // AddEPSComponent,
    // AddGratuityComponent,
    ReactiveFormsModule,
    IncomeDetailComponent,
    ReactiveFormsModule,
    // FactShitComponent,
    // TransactionsComponent,
    // UpperCustomerComponent,
    RightFilterComponent,
    DetailedViewComponent,
    // LiabilitiesDetailComponent,
    RealEstateComponent,
    // AddPpfComponent,
    // AddNscComponent,
    // AddSsyComponent,
    // AddKvpComponent,
    // AddScssComponent,
    // AddPoSavingComponent,
    // AddPoMisComponent,
    // AddPoTdComponent,
    // AddPoRdComponent,
    OtherPayablesComponent,
    // EntryComponentsModule
  ],
  entryComponents: [BottomSheetComponent, DocumentNewFolderComponent]
})
export class AccountModule {
}
