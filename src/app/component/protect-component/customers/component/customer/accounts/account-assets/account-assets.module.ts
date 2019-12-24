import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountAssetsRoutingModule } from './account-assets-routing.module';
import { AccountAssetsComponent } from './account-assets.component';
import { AssetsComponent } from '../assets/assets.component';
import { MaterialModule } from 'src/app/material/material';
import { MutualFundComponent } from '../assets/mutual-fund/mutual-fund/mutual-fund.component';
import { AssetStocksComponent } from '../assets/asset-stocks/asset-stocks.component';
import { RealEstateComponent } from '../assets/realEstate/real-estate/real-estate.component';
import { RetirementAccountComponent } from '../assets/retirementAccounts/retirement-account/retirement-account.component';
import { SmallSavingSchemeComponent } from '../assets/smallSavingScheme/small-saving-scheme/small-saving-scheme.component';
import { CashAndBankComponent } from '../assets/cash&bank/cash-and-bank/cash-and-bank.component';
import { CommoditiesComponent } from '../assets/commodities/commodities/commodities.component';
import { FixedIncomeComponent } from '../assets/fixedIncome/fixed-income/fixed-income.component';
import { MutualFundOverviewComponent } from '../assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundSummaryComponent } from '../assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundAllTransactionComponent } from '../assets/mutual-fund/mutual-fund/mutual-fund-all-transaction/mutual-fund-all-transaction.component';
import { MutualFundUnrealizedTranComponent } from '../assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { MutualFundGoalLinkageComponent } from '../assets/mutual-fund/mutual-fund/mutual-fund-goal-linkage/mutual-fund-goal-linkage.component';
import { MutualFundsCapitalComponent } from '../assets/mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { PPFSchemeComponent } from '../assets/smallSavingScheme/ppf-scheme/ppf-scheme.component';
import { NscSchemeComponent } from '../assets/smallSavingScheme/nsc-scheme/nsc-scheme.component';
import { SsySchemeComponent } from '../assets/smallSavingScheme/ssy-scheme/ssy-scheme.component';
import { KvpSchemeComponent } from '../assets/smallSavingScheme/kvp-scheme/kvp-scheme.component';
import { ScssSchemeComponent } from '../assets/smallSavingScheme/scss-scheme/scss-scheme.component';
import { PoSavingsComponent } from '../assets/smallSavingScheme/po-savings/po-savings.component';
import { PoRdSchemeComponent } from '../assets/smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import { PoTdSchemeComponent } from '../assets/smallSavingScheme/po-td-scheme/po-td-scheme.component';
import { PoMisSchemeComponent } from '../assets/smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';


@NgModule({
  declarations: [AccountAssetsComponent,
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
    AccountAssetsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ]
})
export class AccountAssetsModule { }
