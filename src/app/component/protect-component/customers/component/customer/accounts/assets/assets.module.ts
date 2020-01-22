import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent } from './assets.component';
import { MutualFundComponent } from './mutual-fund/mutual-fund/mutual-fund.component';
import { AssetStocksComponent } from './asset-stocks/asset-stocks.component';
import { RealEstateComponent } from './realEstate/real-estate/real-estate.component';
import { RetirementAccountComponent } from './retirementAccounts/retirement-account/retirement-account.component';
import { SmallSavingSchemeComponent } from './smallSavingScheme/small-saving-scheme/small-saving-scheme.component';
import { CashAndBankComponent } from './cash&bank/cash-and-bank/cash-and-bank.component';
import { CommoditiesComponent } from './commodities/commodities/commodities.component';
import { FixedIncomeComponent } from './fixedIncome/fixed-income/fixed-income.component';
import { MutualFundsCapitalComponent } from './mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { MutualFundOverviewComponent } from './mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundSummaryComponent } from './mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundAllTransactionComponent } from './mutual-fund/mutual-fund/mutual-fund-all-transaction/mutual-fund-all-transaction.component';
import { MutualFundUnrealizedTranComponent } from './mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { MutualFundGoalLinkageComponent } from './mutual-fund/mutual-fund/mutual-fund-goal-linkage/mutual-fund-goal-linkage.component';
import { PPFSchemeComponent } from './smallSavingScheme/ppf-scheme/ppf-scheme.component';
import { NscSchemeComponent } from './smallSavingScheme/nsc-scheme/nsc-scheme.component';
import { SsySchemeComponent } from './smallSavingScheme/ssy-scheme/ssy-scheme.component';
import { KvpSchemeComponent } from './smallSavingScheme/kvp-scheme/kvp-scheme.component';
import { ScssSchemeComponent } from './smallSavingScheme/scss-scheme/scss-scheme.component';
import { PoSavingsComponent } from './smallSavingScheme/po-savings/po-savings.component';
import { PoRdSchemeComponent } from './smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import { PoTdSchemeComponent } from './smallSavingScheme/po-td-scheme/po-td-scheme.component';
import { PoMisSchemeComponent } from './smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';


@NgModule({
  declarations: [
    AssetsComponent,
    MutualFundComponent,
    AssetStocksComponent,
    AssetStocksComponent,
    RealEstateComponent,
    RetirementAccountComponent,
    SmallSavingSchemeComponent,
    CashAndBankComponent,
    CommoditiesComponent,
    FixedIncomeComponent,
    MutualFundsCapitalComponent,
    MutualFundOverviewComponent,
    MutualFundSummaryComponent,
    MutualFundAllTransactionComponent,
    MutualFundUnrealizedTranComponent,
    MutualFundGoalLinkageComponent,
    PPFSchemeComponent,
    NscSchemeComponent,
    SsySchemeComponent,
    KvpSchemeComponent,
    ScssSchemeComponent,
    PoSavingsComponent,
    PoRdSchemeComponent,
    PoTdSchemeComponent,
    PoMisSchemeComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
})
export class AssetsModule { }
