import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDocumentsComponent } from "./customer-documents/customer-documents.component";
import { AddProfileSummaryComponent } from "../../common-component/add-profile-summary/add-profile-summary.component";
import { CustomersRoutingModule } from "../../../customers-routing.module";
import { MutualFundsCapitalComponent } from "./mutual-funds-capital/mutual-funds-capital.component";
import { DocumentsComponent } from "./documents/documents.component";
import { InsuranceComponent } from "./insurance/insurance.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerComponent } from "../customer.component";
import { MaterialModule } from "../../../../../../material/material";
import { AddInsuranceComponent } from "../../common-component/add-insurance/add-insurance.component";
import { AccountsComponent } from "./accounts.component";
import { AddLiabilitiesComponent } from "../../common-component/add-liabilities/add-liabilities.component";
import { AssetsComponent } from "./assets/assets.component";
import { SchemeLevelTransactionComponent } from "../../common-component/scheme-level-transaction/scheme-level-transaction.component";
import { FixedDepositComponent } from "./assets/fixedIncome/fixed-deposit/fixed-deposit.component";
import { ExpensesComponent } from "./expenses/expenses.component";
import { SummaryComponent } from "./summary/summary.component";
import { BottomSheetComponent } from "../../common-component/bottom-sheet/bottom-sheet.component";
import { LibilitiesRightComponent } from "./liabilities/libilities-right/libilities-right.component";
import { IncomeComponent } from "./income/income.component";
import { LiabilitiesComponent } from "./liabilities/liabilities.component";
import { ChartModule } from "angular-highcharts";
import { FactShitComponent } from '../../common-component/fact-shit/fact-shit.component';
import { TransactionsComponent } from '../../common-component/transactions/transactions.component';
import { UpperCustomerComponent } from '../../common-component/upper-customer/upper-customer.component';
import { RightFilterComponent } from '../../common-component/right-filter/right-filter.component';
import { FixedIncomeComponent } from './assets/fixedIncome/fixed-income/fixed-income.component';
import { RecuringDepositComponent } from './assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { BondsComponent } from './assets/fixedIncome/bonds/bonds.component';
import { AddIncomeComponent } from '../../common-component/add-income/add-income.component';
import { IncomeDetailComponent } from '../../common-component/income-detail/income-detail.component';
import { OwnerComponentComponent } from './owner-component/owner-component.component';
import { DetailedViewComponent } from '../../common-component/detailed-view/detailed-view.component';
import { LiabilitiesDetailComponent } from '../../common-component/liabilities-detail/liabilities-detail.component';
import { RetirementAccountComponent } from './assets/retirementAccounts/retirement-account/retirement-account.component';
import { AddEPFComponent } from './assets/retirementAccounts/add-epf/add-epf.component';
import { AddSuperannuationComponent } from './assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { AddEPSComponent } from './assets/retirementAccounts/add-eps/add-eps.component';
import { AddGratuityComponent } from './assets/retirementAccounts/add-gratuity/add-gratuity.component';
import { AddNPSComponent } from './assets/retirementAccounts/add-nps/add-nps.component';
import { PPFSchemeComponent } from './assets/smallSavingScheme/ppf-scheme/ppf-scheme.component';
import { NscSchemeComponent } from './assets/smallSavingScheme/nsc-scheme/nsc-scheme.component';
import { SsySchemeComponent } from './assets/smallSavingScheme/ssy-scheme/ssy-scheme.component';
import { KvpSchemeComponent } from './assets/smallSavingScheme/kvp-scheme/kvp-scheme.component';
import { ScssSchemeComponent } from './assets/smallSavingScheme/scss-scheme/scss-scheme.component';
import { PoSavingsComponent } from './assets/smallSavingScheme/po-savings/po-savings.component';
import { PoRdSchemeComponent } from './assets/smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import { PoTdSchemeComponent } from './assets/smallSavingScheme/po-td-scheme/po-td-scheme.component';
import { PoMisSchemeComponent } from './assets/smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import { SmallSavingSchemeComponent } from './assets/smallSavingScheme/small-saving-scheme/small-saving-scheme.component';
import { RealEstateComponent } from './assets/realEstate/real-estate/real-estate.component';
import { AddRealEstateComponent } from './assets/realEstate/add-real-estate/add-real-estate.component';
import { NpsSummaryPortfolioComponent } from './assets/retirementAccounts/add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { NpsSchemeHoldingComponent } from './assets/retirementAccounts/add-nps/nps-scheme-holding/nps-scheme-holding.component';
import { AddExpensesComponent } from '../../common-component/add-expenses/add-expenses.component';

@NgModule({
  declarations: [
    SchemeLevelTransactionComponent,
    IncomeComponent,
    CustomerDocumentsComponent,
    CustomerComponent,
    AccountsComponent,
    SummaryComponent,
    AssetsComponent,
    LiabilitiesComponent,
    InsuranceComponent,
    ExpensesComponent,
    AddProfileSummaryComponent,
    IncomeComponent,
    DocumentsComponent,
    MutualFundsCapitalComponent,
    BottomSheetComponent,
    AddLiabilitiesComponent,
    AddInsuranceComponent,
    LibilitiesRightComponent,
    FixedDepositComponent,
    FactShitComponent,
    TransactionsComponent,
    UpperCustomerComponent,
    RightFilterComponent,
    FixedIncomeComponent,
    RecuringDepositComponent,
    BondsComponent,
    AddIncomeComponent,
    IncomeDetailComponent,
    OwnerComponentComponent,
    DetailedViewComponent,
    LiabilitiesDetailComponent,
    RetirementAccountComponent,
    AddEPFComponent,
    AddSuperannuationComponent,
    AddEPSComponent,
    AddGratuityComponent,
    AddNPSComponent,
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
    AddRealEstateComponent,
    NpsSummaryPortfolioComponent,
    NpsSchemeHoldingComponent,
    AddExpensesComponent
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddLiabilitiesComponent, AddInsuranceComponent,NpsSchemeHoldingComponent, NpsSummaryPortfolioComponent, LibilitiesRightComponent, FixedDepositComponent, AddSuperannuationComponent,AddEPSComponent,AddGratuityComponent, AddNPSComponent,AddEPFComponent, OwnerComponentComponent, RecuringDepositComponent, BondsComponent, ReactiveFormsModule, AddIncomeComponent, IncomeDetailComponent, ReactiveFormsModule, FactShitComponent, TransactionsComponent, UpperCustomerComponent, RightFilterComponent, DetailedViewComponent, LiabilitiesDetailComponent,AddRealEstateComponent,RealEstateComponent,AddExpensesComponent],
  entryComponents: [BottomSheetComponent]
})
export class AccountModule {
}
