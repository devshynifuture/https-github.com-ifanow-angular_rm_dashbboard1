import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersRoutingModule} from './customers-routing.module';
import {CustomerComponent} from './component/customer/customer.component';
import {AccountsComponent} from './component/customer/accounts/accounts.component';
import {SummaryComponent} from './component/customer/accounts/summary/summary.component';
import {AssetsComponent} from './component/customer/accounts/assets/assets.component';
import {LiabilitiesComponent} from './component/customer/accounts/liabilities/liabilities.component';
import {InsuranceComponent} from './component/customer/accounts/insurance/insurance.component';
import {IncomeComponent} from './component/customer/accounts/income/income.component';
import {ExpensesComponent} from './component/customer/accounts/expenses/expenses.component';
import {CustomerDocumentsComponent} from './component/customer/accounts/customer-documents/customer-documents.component';
import {AddProfileSummaryComponent} from './component/common-component/add-profile-summary/add-profile-summary.component';
import {SchemeLevelTransactionComponent} from './component/common-component/scheme-level-transaction/scheme-level-transaction.component';


@NgModule({
  declarations: [/*CustomerComponent, AccountsComponent,SummaryComponent,*/ /*AssetsComponent,*/
    /*LiabilitiesComponent, InsuranceComponent, ExpensesComponent, AddProfileSummaryComponent,  */ SchemeLevelTransactionComponent, IncomeComponent, CustomerDocumentsComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule {
}
