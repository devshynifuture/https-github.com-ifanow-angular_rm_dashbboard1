import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomerTransactRoutingModule} from './customer-transact-routing.module';
import {CustomerTransactComponent} from './customer-transact.component';
import {TransactionsModule} from '../../../../AdviserComponent/transactions/transactions.module';


@NgModule({
  declarations: [CustomerTransactComponent],
  imports: [
    CommonModule,
    TransactionsModule,
    CustomerTransactRoutingModule
  ]
})
export class CustomerTransactModule { }
