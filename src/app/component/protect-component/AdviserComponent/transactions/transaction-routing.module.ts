import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions/transactions.component';
import { OverviewTransactionsComponent } from './overview-transactions/overview-transactions.component';

const routes: Routes = [
    {
        path: '',
        component: TransactionsComponent
    },
    {
        path: 'overview',
        component: OverviewTransactionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
