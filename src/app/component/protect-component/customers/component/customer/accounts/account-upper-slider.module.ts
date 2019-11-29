import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {CustomerComponent} from '../customer.component';
import {ChartModule} from 'angular-highcharts';
import {MaterialModule} from '../../../../../../material/material';
import {FactShitComponent} from '../../common-component/fact-shit/fact-shit.component';
import {TransactionsComponent} from '../../common-component/transactions/transactions.component';

const componentList = [
  FactShitComponent,
  TransactionsComponent];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    ChartModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [componentList],
})
export class AccountUpperSliderModule {
}
