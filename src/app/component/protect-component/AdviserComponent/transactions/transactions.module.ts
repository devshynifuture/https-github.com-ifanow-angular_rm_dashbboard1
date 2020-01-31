import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { OverviewTransactionsComponent } from './overview-transactions/overview-transactions.component';
// import { TransactionsComponent } from './t/transactions.component';




@NgModule({
  declarations: [TransactionsComponent, OverviewTransactionsComponent],
  imports: [
    CommonModule,
    TransactionRoutingModule
  ], exports: [

    TransactionsComponent
  ]
})
export class TransactionsModule {

}
