import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CustomerTransactComponent} from './customer-transact.component';
import {TransactionsListComponent} from '../../../../AdviserComponent/transactions/transactions-list/transactions-list.component';

const routes: Routes = [{
  path: '', component: CustomerTransactComponent,
  children: [{path: 'list', component: TransactionsListComponent}]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTransactRoutingModule {
}
