import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './assets.component';
import { MutualFundOverviewComponent } from './mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundUnrealizedTranComponent } from './mutual-fund/mutual-fund/mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';
import { MutualFundsCapitalComponent } from './mutual-fund/mutual-fund/mutual-funds-capital/mutual-funds-capital.component';
import { MfCapitalDetailedComponent } from './mutual-fund/mutual-fund/mf-capital-detailed/mf-capital-detailed.component';


const routes: Routes = [
  {
    path: '', component: AssetsComponent,
    // children: [
    // { path: 'mutual-funds', loadChildren: () => import('./mutual-fund/mutual-fund/mutual-fund.module').then(m => m.MutualFundModule) }
    // ]
  }, {
    path: 'overview', component: MutualFundOverviewComponent,

  }, {
    path: 'summary', component: MutualFundOverviewComponent,

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
