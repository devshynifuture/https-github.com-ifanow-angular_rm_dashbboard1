import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { MaterialModule } from '../../../material/material';
import { BottomSheetComponent } from './component/common-component/bottom-sheet/bottom-sheet.component';
import { ChartModule } from 'angular-highcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { AccountModule } from './component/customer/accounts/account.module';
// import { RightFilterComponent } from './component/common-component/right-filter/right-filter.component';
// import { FactShitComponent } from './component/common-component/fact-shit/fact-shit.component';
// import { TransactionsComponent } from './component/common-component/transactions/transactions.component';




@NgModule({
  declarations: [ ],
  imports: [
    // BrowserModule,
    CommonModule,
    CustomersRoutingModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    AccountModule
  ],
  exports: [],
  entryComponents: [BottomSheetComponent]
})
export class CustomersModule {
}
