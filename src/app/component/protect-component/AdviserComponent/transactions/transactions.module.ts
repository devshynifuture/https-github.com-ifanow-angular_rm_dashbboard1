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
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
//import { NomineeDetailsComponent } from './overview-transactions/know-your-customer/nominee-details/nominee-details.component';
//import { PermanentAddressComponent } from './overview-transactions/know-your-customer/permanent-address/permanent-address.component';
//import { BackDetailsComponent } from './overview-transactions/know-your-customer/back-details/back-details.component';
//import { PersonalDetailsComponent } from './overview-transactions/know-your-customer/personal-details/personal-details.component';
//import { KnowYourCustomerComponent } from './overview-transactions/know-your-customer/know-your-customer.component';
// import { TransactionsHistoryComponent } from './transactions-list/transactions-history/transactions-history.component';

// import { TransactionsComponent } from './t/transactions.component';




@NgModule({
  declarations: [
    TransactionsComponent,
    OverviewTransactionsComponent,
    TransactionsListComponent,
    InvestorsTransactionsComponent,
    MandatesTransactionsComponent,
    KycTransactionsComponent,





  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransactionRoutingModule,
    EntryComponentsModule,
    MaterialModule,
    CustomDirectiveModule,
    CustomCommonModule,
    SettingsTransactionsModule,
  ], exports: [

    TransactionsComponent
  ]
})
export class TransactionsModule {

}
