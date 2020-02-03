import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { OverviewTransactionsComponent } from './overview-transactions/overview-transactions.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { InvestorsTransactionsComponent } from './investors-transactions/investors-transactions.component';
import { MandatesTransactionsComponent } from './mandates-transactions/mandates-transactions.component';
import { KycTransactionsComponent } from './kyc-transactions/kyc-transactions.component';

const routes: Routes = [
    {
        path: '',
        component: TransactionsComponent,
        children: [
            {
                path: 'overview',
                component: OverviewTransactionsComponent
            },
            {
                path: 'transactions',
                component: TransactionsListComponent
            },
            {
                path: 'investors',
                component: InvestorsTransactionsComponent
            },
            {
                path: 'mandates',
                component: MandatesTransactionsComponent
            },
            {
                path: 'kyc',
                component: KycTransactionsComponent
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings-transactions/settings-transactions.module').then(m => m.SettingsTransactionsModule),

            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
