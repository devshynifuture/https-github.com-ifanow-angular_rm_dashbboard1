import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { MutualFundOverviewComponent } from './mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundUnrealizedTranComponent } from './mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { MutualFundsCapitalComponent } from './mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { MfCapitalDetailedComponent } from './mutual-fund/mutual-fund/mf-capital-detailed/mf-capital-detailed.component';
import { MutualFundSummaryComponent } from './mutual-fund/mutual-fund/mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundComponent } from './mutual-fund/mutual-fund/mutual-fund.component';
import { AssetStocksComponent } from './asset-stocks/asset-stocks.component';
import { FixedIncomeComponent } from './fixedIncome/fixed-income/fixed-income.component';
import { RealEstateComponent } from './realEstate/real-estate/real-estate.component';
import { RetirementAccountComponent } from './retirementAccounts/retirement-account/retirement-account.component';
import { SmallSavingSchemeComponent } from './smallSavingScheme/small-saving-scheme/small-saving-scheme.component';
import { CashAndBankComponent } from './cash&bank/cash-and-bank/cash-and-bank.component';
import { CommoditiesComponent } from './commodities/commodities/commodities.component';


const routes: Routes = [
  {
    path: '', component: AssetsComponent,
    // children: [
    // { path: 'mutual-funds', loadChildren: () => import('./mutual-fund/mutual-fund/mutual-fund.module').then(m => m.MutualFundModule) }
    // ]
    children: [
      {
        path: 'mutual', component: MutualFundComponent,

      },
      {
        path: 'stock', component: AssetStocksComponent,

      },
      {
        path: 'fix', component: FixedIncomeComponent,

      },
      {
        path: 'real', component: RealEstateComponent,

      },
      {
        path: 'retire', component: RetirementAccountComponent,

      },
      {
        path: 'small', component: SmallSavingSchemeComponent,

      },
      {
        path: 'cash_bank', component: CashAndBankComponent,

      },
      {
        path: 'commodities', component: CommoditiesComponent,

      },
      {
        path: '',
        redirectTo: 'mutual',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: 'overview', component: MutualFundOverviewComponent,

  },
  {
    path: 'summary', component: MutualFundSummaryComponent,

  }, {
    path: 'allTransactions', component: MutualFundUnrealizedTranComponent,

  }, {
    path: 'unrealisedTransactions', component: MutualFundUnrealizedTranComponent,

  }, {
    path: 'capitalGainSummary', component: MutualFundsCapitalComponent,

  }, {
    path: 'capitalGainDetailed', component: MfCapitalDetailedComponent,

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
