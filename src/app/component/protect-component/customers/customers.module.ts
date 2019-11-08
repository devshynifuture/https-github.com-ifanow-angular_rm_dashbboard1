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
import {MaterialModule} from '../../../material/material';
import {DocumentsComponent} from './component/customer/accounts/documents/documents.component';
import {MutualFundsCapitalComponent} from './component/customer/accounts/mutual-funds-capital/mutual-funds-capital.component';
import {BottomSheetComponent} from './component/common-component/bottom-sheet/bottom-sheet.component';
import {AddLiabilitiesComponent} from './component/common-component/add-liabilities/add-liabilities.component';
import {AddInsuranceComponent} from './component/common-component/add-insurance/add-insurance.component';
import {LibilitiesRightComponent} from './component/customer/accounts/liabilities/libilities-right/libilities-right.component';
import {ChartModule} from 'angular-highcharts';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    SchemeLevelTransactionComponent,
    IncomeComponent,
    CustomerDocumentsComponent,
    CustomerComponent,
    AccountsComponent,
    SummaryComponent,
    AssetsComponent,
    LiabilitiesComponent,
    InsuranceComponent,
    ExpensesComponent,
    AddProfileSummaryComponent,
    IncomeComponent,
    DocumentsComponent,
    MutualFundsCapitalComponent,
    BottomSheetComponent,
    AddLiabilitiesComponent,
    AddInsuranceComponent,
    LibilitiesRightComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    ChartModule,
    ReactiveFormsModule
  ],
  exports: [AddLiabilitiesComponent, AddInsuranceComponent, LibilitiesRightComponent],
  entryComponents: [BottomSheetComponent]
})
export class CustomersModule {
}
