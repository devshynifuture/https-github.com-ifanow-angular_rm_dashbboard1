import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MutualFundComponent } from './mutual-fund.component';
import { MutualFundOverviewComponent } from './mutual-fund-overview/mutual-fund-overview.component';
import { MutualFundSummaryComponent } from './mutual-fund-summary/mutual-fund-summary.component';
import { MutualFundsCapitalComponent } from './mutual-funds-capital/mutual-funds-capital.component';
import { MutualFundGoalLinkageComponent } from './mutual-fund-goal-linkage/mutual-fund-goal-linkage.component';
import { MutualFundAllTransactionComponent } from './mutual-fund-all-transaction/mutual-fund-all-transaction.component';
import { MutualFundUnrealizedTranComponent } from './mutual-fund-unrealized-tran/mutual-fund-unrealized-tran.component';


const routes: Routes = [
    {
        path: '',
        component: MutualFundComponent,
        children: [
            { path: 'overview', component: MutualFundOverviewComponent, runGuardsAndResolvers: 'always' },
            { path: 'summary', component: MutualFundSummaryComponent, runGuardsAndResolvers: 'always' },
            { path: 'capital-gain', component: MutualFundsCapitalComponent },
            { path: 'goal-linkage', component: MutualFundGoalLinkageComponent },
            { path: 'all-transaction', component: MutualFundAllTransactionComponent },
            { path: 'unrealize-transaction', component: MutualFundUnrealizedTranComponent },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MutualFundRoutingModule { }
