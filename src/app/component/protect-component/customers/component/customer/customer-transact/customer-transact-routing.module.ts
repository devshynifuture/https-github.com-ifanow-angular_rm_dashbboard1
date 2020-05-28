import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerTransactComponent } from './customer-transact.component';
import { TransactionsListComponent } from '../../../../AdviserComponent/transactions/transactions-list/transactions-list.component';
import { InvestorsTransactionsComponent } from '../../../../AdviserComponent/transactions/investors-transactions/investors-transactions.component';
import { MandatesTransactionsComponent } from '../../../../AdviserComponent/transactions/mandates-transactions/mandates-transactions.component';

const routes: Routes = [{
  path: '', component: CustomerTransactComponent,
  children: [{ path: 'list', component: TransactionsListComponent },
  { path: 'investors', component: InvestorsTransactionsComponent },
  { path: 'mandate', component: MandatesTransactionsComponent },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTransactRoutingModule {
}
