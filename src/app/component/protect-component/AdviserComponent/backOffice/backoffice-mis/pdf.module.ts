import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'src/app/material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomDirectiveModule} from 'src/app/common/directives/common-directive.module';
import {TableVirtualScrollModule} from 'ng-table-virtual-scroll';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CustomCommonModule} from 'src/app/common/custom.common.module';
import { AssetsComponent } from '../../../customers/component/customer/accounts/assets/assets.component';
import { MutualFundComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund.component';
import { AssetStocksComponent } from '../../../customers/component/customer/accounts/assets/asset-stocks/asset-stocks.component';
import { RealEstateComponent } from '../../../customers/component/customer/accounts/assets/realEstate/real-estate/real-estate.component';
import { RetirementAccountComponent } from '../../../customers/component/customer/accounts/assets/retirementAccounts/retirement-account/retirement-account.component';
import { SmallSavingSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/small-saving-scheme/small-saving-scheme.component';
import { CashAndBankComponent } from '../../../customers/component/customer/accounts/assets/cash&bank/cash-and-bank/cash-and-bank.component';
import { CommoditiesComponent } from '../../../customers/component/customer/accounts/assets/commodities/commodities/commodities.component';
import { FixedIncomeComponent } from '../../../customers/component/customer/accounts/assets/fixedIncome/fixed-income/fixed-income.component';
import { MutualFundsCapitalComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { MutualFundOverviewComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundSummaryComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundUnrealizedTranComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { MutualFundGoalLinkageComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-goal-linkage/mutual-fund-goal-linkage.component';
import { PPFSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/ppf-scheme/ppf-scheme.component';
import { NscSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/nsc-scheme/nsc-scheme.component';
import { SsySchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/ssy-scheme/ssy-scheme.component';
import { KvpSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/kvp-scheme/kvp-scheme.component';
import { ScssSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/scss-scheme/scss-scheme.component';
import { PoSavingsComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/po-savings/po-savings.component';
import { PoRdSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/po-rd-scheme/po-rd-scheme.component';
import { PoTdSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/po-td-scheme/po-td-scheme.component';
import { PoMisSchemeComponent } from '../../../customers/component/customer/accounts/assets/smallSavingScheme/po-mis-scheme/po-mis-scheme.component';
import { MfCapitalDetailedComponent } from '../../../customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mf-capital-detailed/mf-capital-detailed.component';
import { AssetsRoutingModule } from '../../../customers/component/customer/accounts/assets/assets-routing.module';


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
    MfCapitalDetailedComponent,
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    TableVirtualScrollModule,
    ScrollingModule,
    CustomCommonModule,
  ]
})

export class PdfModule { }
