import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerDocumentsComponent} from "./customer-documents/customer-documents.component";
import {AddProfileSummaryComponent} from "../../common-component/add-profile-summary/add-profile-summary.component";
import {CustomersRoutingModule} from "../../../customers-routing.module";
import {MutualFundsCapitalComponent} from "./mutual-funds-capital/mutual-funds-capital.component";
import {DocumentsComponent} from "./documents/documents.component";
import {InsuranceComponent} from "./insurance/insurance.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CustomerComponent} from "../customer.component";
import {MaterialModule} from "../../../../../../material/material";
import {AddInsuranceComponent} from "../../common-component/add-insurance/add-insurance.component";
import {AccountsComponent} from "./accounts.component";
import {AddLiabilitiesComponent} from "../../common-component/add-liabilities/add-liabilities.component";
import {AssetsComponent} from "./assets/assets.component";
import {SchemeLevelTransactionComponent} from "../../common-component/scheme-level-transaction/scheme-level-transaction.component";
import {FixedDepositComponent} from "./assets/fixedIncome/fixed-deposit/fixed-deposit.component";
import {ExpensesComponent} from "./expenses/expenses.component";
import {SummaryComponent} from "./summary/summary.component";
import {BottomSheetComponent} from "../../common-component/bottom-sheet/bottom-sheet.component";
import {LibilitiesRightComponent} from "./liabilities/libilities-right/libilities-right.component";
import {IncomeComponent} from "./income/income.component";
import {LiabilitiesComponent} from "./liabilities/liabilities.component";
import {ChartModule} from "angular-highcharts";
import { FactShitComponent } from '../../common-component/fact-shit/fact-shit.component';
import { TransactionsComponent } from '../../common-component/transactions/transactions.component';
import { UpperCustomerComponent } from '../../common-component/upper-customer/upper-customer.component';
import { RightFilterComponent } from '../../common-component/right-filter/right-filter.component';
import { FixedIncomeComponent } from './assets/fixedIncome/fixed-income/fixed-income.component';
import { RecuringDepositComponent } from './assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { BondsComponent } from './assets/fixedIncome/bonds/bonds.component';
import { AddIncomeComponent } from '../../common-component/add-income/add-income.component';
import { IncomeDetailComponent } from '../../common-component/income-detail/income-detail.component';


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
    FixedDepositComponent,
    FactShitComponent,
    TransactionsComponent,
    UpperCustomerComponent,
    RightFilterComponent,
    FixedIncomeComponent,
    RecuringDepositComponent,
    BondsComponent,
    AddIncomeComponent,
    IncomeDetailComponent
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AddLiabilitiesComponent, AddInsuranceComponent, LibilitiesRightComponent, FixedDepositComponent, RecuringDepositComponent, BondsComponent, ReactiveFormsModule,AddIncomeComponent,IncomeDetailComponent,  ReactiveFormsModule,FactShitComponent,TransactionsComponent,UpperCustomerComponent,RightFilterComponent],
  entryComponents: [BottomSheetComponent]
})
export class AccountModule {
}
