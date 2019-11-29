import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersRoutingModule} from './customers-routing.module';
import {MaterialModule} from '../../../material/material';
import {BottomSheetComponent} from './component/common-component/bottom-sheet/bottom-sheet.component';
import {ChartModule} from 'angular-highcharts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import {CustomerComponent} from './component/customer/customer.component';
import {AddLiabilitiesComponent} from './component/common-component/add-liabilities/add-liabilities.component';
import { CopyDocumentsComponent } from './component/common-component/copy-documents/copy-documents.component';

import {CustomCommonModule} from '../../../common/custom.common.module';
import {EntryComponentsModule} from '../../../entry.components.module';
import {AccountModule} from './component/customer/accounts/account.module';
import {PlanModule} from './component/customer/plan/plan.module';


// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';


@NgModule({
  declarations: [CustomerComponent, CopyDocumentsComponent],
  imports: [
    // BrowserModule,
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    // AccountModule,
    // PlanModule,
    CustomCommonModule,
    EntryComponentsModule,
    AccountModule,
    PlanModule
  ],
  exports: [],
  entryComponents: [ EntryComponentsModule.getComponentList()]
})
export class CustomersModule {
}
