import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material';

import { CustomerTransactRoutingModule } from './customer-transact-routing.module';
import { CustomerTransactComponent } from './customer-transact.component';
import { TransactionsModule } from '../../../../AdviserComponent/transactions/transactions.module';


@NgModule({
  declarations: [CustomerTransactComponent],
  imports: [
    CommonModule,
    TransactionsModule,
    CustomerTransactRoutingModule,
    MaterialModule
  ]
})
export class CustomerTransactModule { }
