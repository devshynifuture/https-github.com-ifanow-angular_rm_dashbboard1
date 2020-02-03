import { EntryComponentsModule } from '../../../../entry.components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { OverviewTransactionsComponent } from './overview-transactions/overview-transactions.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';
import { InvestorsTransactionsComponent } from './investors-transactions/investors-transactions.component';
import { MandatesTransactionsComponent } from './mandates-transactions/mandates-transactions.component';
import { KycTransactionsComponent } from './kyc-transactions/kyc-transactions.component';
import { SettingsTransactionsComponent } from './settings-transactions/settings-transactions.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { SettingsTransactionsModule } from './settings-transactions/settings-transactions.module';
// import { TransactionsComponent } from './t/transactions.component';




@NgModule({
  declarations: [TransactionsComponent, OverviewTransactionsComponent, TransactionsListComponent, InvestorsTransactionsComponent, MandatesTransactionsComponent, KycTransactionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransactionRoutingModule,
    EntryComponentsModule,
    MaterialModule,
    SettingsTransactionsModule
  ], exports: [

    TransactionsComponent
  ]
})
export class TransactionsModule {

}
